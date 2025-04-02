import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import Sudoku from '@/utils/Sudoku'
import useGameStore from '@/hooks/useGameStore'

function GameBoard() {
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
  const selectedGrid = useGameStore((state) => state.selectedGrid)
  // const verticalSubgridDividerCells = [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77]
  // const horizontalSubgridDividerCells = [18, 19, 20, 21, 22, 23, 24, 25, 26, 45, 46, 47, 48, 49, 50, 51, 52, 53]

  useEffect(() => {
    if (isNewGame) {
      const puzzle = new Sudoku('easy')
      setBoard(puzzle.board)
      setSolution(puzzle.solution)
      setIsNewGame(false)
    }
  }, [])

  return (
    <>
      <View className='flex flex-wrap flex-row w-[400px] h-[500px]'>
        {board.map((row, rowNumber) =>
          row.map((cellValue, columnNumber) => {
            const isSelectedCell = (selectedCell[0] === rowNumber && selectedCell[1] === columnNumber)
            let classNames = 'flex justify-center items-center basis-[calc(100%/9)] border border-white border-collapse'

            selectedGrid.forEach(cell => {
              if (rowNumber === cell[0] && columnNumber === cell[1] && !isSelectedCell) {
                classNames += ' bg-gray-500'
              }
            })

            if (isSelectedCell) {
              classNames += ' bg-blue-500'
            } else if (selectedCell[0] === rowNumber || selectedCell[1] === columnNumber) {
              classNames += ' bg-gray-500'
            }

            return (
              <TouchableOpacity
                key={rowNumber + ', ' + columnNumber}
                className={classNames}
                onPress={() => setSelectedCell([rowNumber, columnNumber])}
              >
                <Text className='text-white text-4xl'>{cellValue !== 0 ? cellValue : ' '}</Text>
              </TouchableOpacity>
            )
          })
        )}
      </View>
      <View className='flex flex-row flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number =>
          <TouchableOpacity
            key={number}
            onPress={() => {
              setCellValue(number, selectedCell)
              validateWin()
            }}
          >
            <Text className='text-white w-16 h-16 text-4xl border border-white text-center flex justify-center items-center'>
              {number}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => undo()}>
          <Text className='text-white w-16 h-16 text-5xl border border-white text-center flex justify-center items-center'>
            {'\u21b6'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

function WonScreen() {
  const setWon = useGameStore((state) => state.setWon)
  const setIsNewGame = useGameStore((state) => state.setIsNewGame)

  return (
    <View className='flex flex-col items-center gap-14'>
      <Text className='text-white text-5xl'>You Won!</Text>
      <TouchableOpacity
        className='border border-white p-4'
        onPress={() => {
          setIsNewGame(true)
          setWon(false)
        }}
      >
        <Text className='text-white text-2xl'>New Game</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function GameScreen() {
  const isWon = useGameStore((state) => state.isWon)

  return (
    <View className='flex h-full flex-col justify-around items-center'>
      {isWon ? <WonScreen /> : <GameBoard />}
    </View>
  )
}