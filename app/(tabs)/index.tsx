import { useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import { Sudoku } from '@/utils/Sudoku'
import useGameStore from '@/hooks/useGameStore'

export default function HomeScreen() {
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
  const verticalSubgridDividerCells = [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77]
  const horizontalSubgridDividerCells = [18, 19, 20, 21, 22, 23, 24, 25, 26, 45, 46, 47, 48, 49, 50, 51, 52, 53]

  useEffect(() => {
    if (isNewGame) {
      const puzzle = new Sudoku('evil')
      setBoard(puzzle.board)
      setSolution(puzzle.solution)
      setIsNewGame(false)
    }
  }, [])

  return (
    <View className='flex h-full flex-col justify-around items-center'>
      <View className='flex flex-wrap h-[400px] w-[400px]'>
        {board.map((row, rowNumber) =>
          row.map((cellValue, columnNumber) =>
            <TouchableOpacity
              key={rowNumber + ', ' + columnNumber}
              className='flex justify-center items-center basis-[calc(100%/9)] border border-white border-collapse'
              onPress={() => setSelectedCell([rowNumber, columnNumber])}
            >
              <Text className='text-white'>{cellValue !== 0 ? cellValue : ' '}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
      <View className='flex flex-row flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number =>
          <TouchableOpacity
            key={number}
            onPress={() => setCellValue(number, selectedCell)}
          >
            <Text className='text-white w-20 h-20 text-5xl border border-white rounded-[50%] text-center flex justify-center items-center'>
              {number}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => undo()}>
          <Text className='text-white w-20 h-20 text-5xl border border-white rounded-[50%] text-center flex justify-center items-center'>
            {'\u21b6'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}