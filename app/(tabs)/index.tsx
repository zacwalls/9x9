import { useEffect, useState } from 'react'
import { StyleSheet, Button } from 'react-native';
import { create } from 'zustand'

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface GameState {
  board: number[][]
  solution: number[][]
  selectedCell: number[]
  setCellValue: (newNumber: number, cellCoordinates: number[]) => void
  setSelectedCell: (cellCoordinates: number[]) => void
  setBoard: (newBoard: number[][]) => void
  setSolution: (solutionBoard: number[][]) => void
}

const useGameStore = create<GameState>()((set, get) => ({
  board: Array(9).fill(null).map(() => Array(9).fill(0)),
  solution: [],
  selectedCell: [-1, -1],
  setBoard: (newBoard) => set(() => ({ board: newBoard })),
  setSolution: (solutionBoard) => set(() => ({ solution: solutionBoard })),
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

    const newGameBoard = [...gameBoard]

    newGameBoard[targetRow][targetColumn] = newNumber
    set(() => ({ board: newGameBoard }))
  },
  setSelectedCell: (cellCoordinates) => {
    const [row, col] = cellCoordinates

    if ((row < 0 || row > 9) || (col < 0 || col > 9)) {
      return
    }

    set(() => ({ selectedCell: cellCoordinates }))
  }
}))

function PlayBoard() {
  const board = useGameStore((state) => state.board)
  const setBoard = useGameStore((state) => state.setBoard)
  const setSolution = useGameStore((state) => state.setSolution)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setSelectedCell = useGameStore((state) => state.setSelectedCell)
  

  useEffect(() => {
    const fetchBoard = async () => {
      const data = await fetch('https://sudoku-api.vercel.app/api/dosuku')
      const json = await data.json()

      setBoard(json.newboard.grids[0].value)
      setSolution(json.newboard.grids[0].solution)
    }

    fetchBoard().catch(console.error)
  }, [])

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
            onPress={() => setCellValue(number, selectedCell)}
          />
        ))}
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
