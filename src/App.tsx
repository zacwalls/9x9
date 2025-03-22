import { useEffect } from '@lynx-js/react'
import { create } from 'zustand'

import './App.css'
import { Sudoku } from './utils/sudoku.js'

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
  (set, get) => ({
    board: [],
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
  })
)

function modInverse(a: number, m: number) {
  a = ((a % m) + m) % m;
  
  // Find using Extended Euclidean Algorithm
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  
  return null; // No modular inverse exists if a and m are not coprime
}

export function App() {
  const board = useGameStore((state) => state.board)
  const setBoard = useGameStore((state) => state.setBoard)
  const setSolution = useGameStore((state) => state.setSolution)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setSelectedCell = useGameStore((state) => state.setSelectedCell)
  const isNewGame = useGameStore((state) => state.isNewGame)
  const setIsNewGame = useGameStore((state) => state.setIsNewGame)
  const undo = useGameStore((state) => state.undo)
  const validateWin = useGameStore((state) => state.validateWin)
  const isWon = useGameStore((state) => state.isWon)
  const verticalSubgridDividerCells = [2,11,20,29,38,47,56,65,74,5,14,23,32,41,50,59,68,77]
  const horizontalSubgridDividerCells = [18,19,20,21,22,23,24,25,26,45,46,47,48,49,50,51,52,53]

  useEffect(() => {
    if (isNewGame) {
      const puzzle = new Sudoku('evil')
      setBoard(puzzle.board)
      setSolution(puzzle.solution)
      setIsNewGame(false)
    }
  }, [])

  return (
    <view className="game-view">
      <view className="game-grid">
        {board.map((row, rowNumber) =>
          row.map((cellValue, columnNumber) => {
            const linearIndex = rowNumber * 9 + columnNumber
            let borderStyle = ''

            if (verticalSubgridDividerCells.includes(linearIndex)) {
              borderStyle += 'border-right: 2px black;'
            }

            if (horizontalSubgridDividerCells.includes(linearIndex)) {
              borderStyle += 'border-bottom: 2px black;'
            }

            return <text className='game-grid-cell' style={borderStyle}>{cellValue === 0 ? ' ' : cellValue.toString()}</text>
          })
        )}
      </view>
      <view className="game-inputs">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number =>
          <text className="game-input">{number}</text>
        )}
        <text className="game-input undo">↶</text>
      </view>
    </view>
  )
}
