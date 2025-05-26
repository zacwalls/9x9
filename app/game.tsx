import { View, Text, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import GameBoard from '@/components/GameBoard'
import GameBoardNav from '@/components/GameBoardNav'
import GameBoardInputs from '@/components/GameBoardInputs'
import useGameStore from '@/hooks/useGameStore'
import { SudokuDifficulty } from '@/utils/Sudoku'


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
  const { difficulty } = useLocalSearchParams()
  const isWon = useGameStore((state) => state.isWon)

  return (
    <View className='flex h-full flex-col items-center bg-black'>
      {isWon ? <WonScreen />
      : <>
        <GameBoardNav />
        <GameBoard difficulty={difficulty as SudokuDifficulty} />
        <GameBoardInputs />
      </>
      }
    </View>
  )
}