import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SudokuDifficulty, sudokuDifficulty } from "@/utils/Sudoku";

function DifficultySelector({ setDifficulty }: { setDifficulty: React.Dispatch<React.SetStateAction<SudokuDifficulty>> }) {
  const [currentOption, setCurrentOption] = useState(0)

  const nextOption = () => {
    setCurrentOption(prevIdx => (prevIdx + 1) % sudokuDifficulty.length)
  }

  const prevOption = () => {
    setCurrentOption(prevIdx => prevIdx === 0 ? sudokuDifficulty.length - 1 : prevIdx - 1)
  }

  useEffect(() => setDifficulty(sudokuDifficulty[currentOption]), [currentOption])

  return (
    <View className="w-72">
      <View className='relative rounded-2xl shadow-lg p-10 h-40 flex items-center justify-center text-xl font-semibold transition-all duration-500'>
        <Text className='text-white text-3xl'>{sudokuDifficulty[currentOption]}</Text>
      </View>
      <View className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <TouchableOpacity onPress={prevOption}>
          <Text className='text-white text-3xl'>{'\u2039'}</Text>
        </TouchableOpacity>
      </View>
      <View className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <TouchableOpacity onPress={nextOption}>
          <Text className='text-white text-3xl'>{'\u203A'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function Index() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('easy')
  let savedGames = [] as string[]

  useEffect(() => {
    (async () => {
      let keys = [] as string[]

      try {
        keys = await AsyncStorage.getAllKeys() as string[]
      } catch (e) {
        console.error(e)
      }

      savedGames = keys
    })()
  }, [])



  return (
    <View className='bg-black h-full flex flex-col justify-center items-center gap-10'>
      <Text className='text-white text-5xl'>9x9</Text>
      <DifficultySelector setDifficulty={setDifficulty} />
      <Link
        className='border border-white text-white text-2xl p-5'
        href={{ pathname: '/game', params: { difficulty } }}
      >
        New Game
      </Link>

    </View>
  );
}
