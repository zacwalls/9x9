import { useEffect, useState } from 'react'
import { Image, StyleSheet, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function PlayBoard() {
  const [activeCell, setActiveCell] = useState([-1, -1])
  const [solution, setSolution] = useState([[]])
  const [gameBoard, setGameBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ])

  useEffect(() => {
    const fetchBoard = async () => {
      const data = await fetch('https://sudoku-api.vercel.app/api/dosuku')
      const json = await data.json()

      setGameBoard(json.newboard.grids[0].value)
      setSolution(json.newboard.grids[0].solution)
    }

    fetchBoard().catch(console.error)
  }, [])

  function updateCell(newNumber: number, cellCoordinates: number[]) {
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

    const [targetRow, targetValue] = cellCoordinates

    if (gameBoard[targetRow][targetValue] !== 0) {
      // Cell is populated
      return
    }

    const newGameBoard = [...gameBoard]

    newGameBoard[targetRow][targetValue] = newNumber
    setGameBoard(newGameBoard)
  }

  return (
    <div>
      <div style={styles.board}>
        {gameBoard.map((row, rowNumber) => (
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
                  backgroundColor: (activeCell[0] === rowNumber && activeCell[1] === columnNumber) ? 'blue' : 'transparent'
                }}
                onClick={() => setActiveCell([rowNumber, columnNumber])}
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
            onPress={() => updateCell(number, activeCell)}
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
