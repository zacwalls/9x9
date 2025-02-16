import { useState } from 'react'
import { Image, StyleSheet, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function PlayBoard() {
  const [activeCell, setActiveCell] = useState([-1, -1])
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

    const newGameBoard = [...gameBoard]
    const [targetRow, targetValue] = cellCoordinates

    newGameBoard[targetRow][targetValue] = newNumber
    setGameBoard(newGameBoard)
  }

  return (
    <>
      <div style={styles.board}>
        {gameBoard.map((row, rowNumber) => (
          <div style={styles.boardRow}>
            {row.map((cellValue, columnNumber) => (
              <div style={styles.boardCell} onClick={() => setActiveCell([rowNumber, columnNumber])}>
                <ThemedText>{cellValue === 0 ? ' ' : cellValue}</ThemedText>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {Array.from({length: 9}, (_, i) => i + 1).map(number => (
          <Button
            title={number.toString()}
            onPress={() => updateCell(number, activeCell)}
          />
        ))}
      </div>
    </>
  )
}

export default function HomeScreen() {
  return (
      <ThemedView style={styles.titleContainer}>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
