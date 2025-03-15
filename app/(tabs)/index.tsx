import { useEffect } from 'react'
import { StyleSheet, Button } from 'react-native';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'evil'
class Sudoku {
  board: number[][]
  solution: number[][]
  difficulty: SudokuDifficulty

  private GIVENS = {
    'easy': 35,
    'medium': 28,
    'hard': 22,
    'evil': 17
  }

  constructor(difficulty: SudokuDifficulty) {
    this.difficulty = difficulty
    this.solution = this.generateFullBoard()
    // this.board = this.removeNumbers(this.solution)
  }

  /** Checks a given value is valid in a specified cell */
  isValid(board: number[][], row: number, col: number, value: number) {
    // Check row and column for value
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value || board[i][col] === value) {
        return false
      }
    }

    // Check local 3x3 grid for value
    const localX = Math.floor(row / 3)
    const localY = Math.floor(col / 3)

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[localX + i][localY + j] === value) {
          return false
        }
      }
    }

    return true
  }

  // solve() {
  //   for (let row = 0; row < 9; row++) {
  //     for (let col = 0; col < 9; col++) {
  //       if (this.board[row][col] === 0) {
  //         for (let num = 0; num < 9; num++) {
  //           if (this.isValid(row, col, num)) {
  //             this.board[row][col] = num
  
  //             if (this.solve()) {
  //               return true
  //             }
  
  //             this.board[row][col] = 0
  //           }
  //         }

  //         return false
  //       }
  //     }
  //   }

  //   return true
  // }

  /** 
   * Fisher-Yates Shuffle 
   * 
   * Re-arranges elements in an array randomly
   */
  shuffleRow(row: number[] | number[][]) {
    for (let i = row.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const aux = row[j]

      row[j] = row[i]
      row[i] = aux
    }

    return row
  }

  /** Generate complete and valid sudoku */
  generateFullBoard() {
    const board = Array(9).fill(null).map(() => Array(9).fill(0)) as number[][]
    const fillBoard = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

            this.shuffleRow(numbers)

            for (let number of numbers) {
              if (this.isValid(board, row, col, number)) {
                board[row][col] = number

                if (fillBoard()) {
                  return true
                }

                board[row][col] = 0
              }
            }

            return false
          }
        }
      }

      return true
    }

    fillBoard()

    return board
  }

  /** Verifies uniqueness of solution */
  isUnique(board: number[][]) {
    const solutions = []
    const findSolutions = (board: number[][]) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let number = 0; number < 9; number++) {
              if (this.isValid(board, row, col, number)) {
                board[row][col] = number
                findSolutions(board)
                board[row][col] = 0
              }
            }

            return
          }
        }
      }

      solutions.push([...board])

      if (solutions.length > 1) {
        return
      }
    }

    findSolutions(board)

    return solutions.length === 1
  }

  /** Removes numbers from full board given difficulty */
  removeNumbers(board: number[][]) {
    const givens = this.GIVENS[this.difficulty]
    const puzzle = [...board]
    const cells = [...Array(9).keys()].flatMap(r => [...Array(9).keys()].map(c => [r, c]))

    this.shuffleRow(cells)

    while(cells.length > givens) {
      const [row, col] = cells.pop() as number[]
      const tmp = puzzle[row][col]

      puzzle[row][col] = 0

      const tmpPuzzle = [...puzzle]

      if (!this.isUnique(tmpPuzzle)) {
        puzzle[row][col] = tmp
      }
    }

    return puzzle
  }
}

interface GameState {
  board: number[][]
  solution: number[][]
  selectedCell: number[]
  isNewGame: boolean
  history: number[][]
  isWon: boolean
  validateWin: () => void
  undo: () => void
  setCellValue: (newNumber: number, cellCoordinates: number[]) => void
  setSelectedCell: (cellCoordinates: number[]) => void
  setBoard: (newBoard: number[][]) => void
  setSolution: (solutionBoard: number[][]) => void
  setIsNewGame: (isNewGame: boolean) => void
}

const useGameStore = create<GameState>()(
  persist(
      (set, get) => ({
        board: Array(9).fill(null).map(() => Array(9).fill(0)),
        solution: [],
        selectedCell: [-1, -1],
        isNewGame: true,
        history: [],
        isWon: false,
        setBoard: (newBoard) => set(() => ({ board: newBoard })),
        setIsNewGame: (isNewGame) => set(() => ({ isNewGame })),
        setSolution: (solutionBoard) => set(() => ({ solution: solutionBoard })),
        validateWin: () => {
          const gameBoard = get().board
          const solutionBoard = get().solution

          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              if (gameBoard[row][col] !== solutionBoard[row][col]) {
                return
              }
            }
          }

          set(() => ({ isWon: true }))
        },
        undo: () => {
          const historyStack = get().history
          const gameBoard = get().board

          if (historyStack.length <= 0) {
            return
          }

          const [row, col] = historyStack.pop() as number[]
          const newGameBoard = [...gameBoard]

          newGameBoard[row][col] = 0
          set(() => ({ board: newGameBoard, history: historyStack }))
        },
        setCellValue: (newNumber, cellCoordinates) => {
          if (
            (cellCoordinates[0] < 0 || cellCoordinates[0] > 9) ||
            (cellCoordinates[1] < 0 || cellCoordinates[1] > 9)
          ) {
            // Invalid coordinates
            return
          }

          if (newNumber < 0 || newNumber > 9) {
            // Invalid input
            return
          }

          const [targetRow, targetColumn] = cellCoordinates
          const gameBoard = get().board

          if (gameBoard[targetRow][targetColumn] !== 0) {
            // Cell is populated
            return
          }

          const historyStack = get().history
          const newGameBoard = [...gameBoard]

          historyStack.push(cellCoordinates)
          newGameBoard[targetRow][targetColumn] = newNumber
          set(() => ({ board: newGameBoard, history: historyStack }))
        },
        setSelectedCell: (cellCoordinates) => {
          const [row, col] = cellCoordinates

          if ((row < 0 || row > 9) || (col < 0 || col > 9)) {
            return
          }

          set(() => ({ selectedCell: cellCoordinates }))
        }
      }
    ),
    {
      name: 'current-game',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

function PlayBoard() {
  const board = useGameStore((state) => state.board)
  const setBoard = useGameStore((state) => state.setBoard)
  const setSolution = useGameStore((state) => state.setSolution)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setSelectedCell = useGameStore((state) => state.setSelectedCell)
  const isNewGame = useGameStore((state) => state.isNewGame)
  const setIsNewGame = useGameStore((state) => state.setIsNewGame)
  const undo = useGameStore((state) => state.undo)
  const validateWin = useGameStore((state)=> state.validateWin)
  const isWon = useGameStore((state) => state.isWon)

  useEffect(() => {
    const fetchBoard = async () => {
      // const data = await fetch('https://sudoku-api.vercel.app/api/dosuku')
      // const json = await data.json()

      // setBoard(json.newboard.grids[0].value)
      // setSolution(json.newboard.grids[0].solution)
      const puzzle = new Sudoku('easy')
      setBoard(puzzle.board)
      setSolution(puzzle.solution)
      setIsNewGame(false)
    }

    if (isNewGame) {
      fetchBoard().catch(console.error)
    }
  }, [])

  if (isWon) {
    return <h1>You win!</h1>
  }

  return (
    <div>
      <div style={styles.board}>
        {board.map((row, rowNumber) => (
          <div
            key={rowNumber}
            style={styles.boardRow}
          >
            {row.map((cellValue, columnNumber) => (
              <div
                key={`${rowNumber}-${columnNumber}`}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'white',
                  borderStyle: 'solid',
                  padding: 20,
                  backgroundColor: (selectedCell[0] === rowNumber && selectedCell[1] === columnNumber) ? 'blue' : 'transparent'
                }}
                onClick={() => setSelectedCell([rowNumber, columnNumber])}
              >
                <ThemedText>{cellValue === 0 ? ' ' : cellValue}</ThemedText>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={styles.numberBoard}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number => (
          <Button
            key={`button-${number}`}
            title={number.toString()}
            onPress={() => {
              setCellValue(number, selectedCell)
              validateWin()
            }}
          />
        ))}
          <Button
            key='undo'
            title="Undo"
            onPress={() => undo()}
          />
      </div>
    </div>
  )
}

export default function HomeScreen() {
  return (
    <ThemedView>
      <PlayBoard />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  board: {
    display: 'flex',
    flexDirection: 'row'
  },
  boardRow: {
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid'
  },
  boardCell: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderStyle: 'solid',
    padding: 20
  },
  boardContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  numberBoard: {
    display: 'flex',
    gap: '10px'
  },
  numberBoardButton: {
    padding: 20
  }
});
