import { View, Text, TouchableOpacity } from 'react-native'

import GameBoard from '@/components/GameBoard'
import GameTimer from '@/components/GameTimer'
import GameBoardInputs from '@/components/GameBoardInputs'
import useGameStore from '@/hooks/useGameStore'

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
    <View className='flex h-full flex-col justify-around items-center bg-black'>
      {isWon ? <WonScreen />
      : <>
        <GameTimer />
        <GameBoard />
        <GameBoardInputs />
      </>
      }
    </View>
  )
}