import { View, Text, TouchableOpacity } from "react-native"
import useGameStore from "@/hooks/useGameStore"

export default function GameBoardInputs() {
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const validateWin = useGameStore((state) => state.validateWin)
  const undo = useGameStore((state) => state.undo)

  return (
    <View className='flex flex-row flex-wrap items-center justify-center gap-5'>
      {Array.from({ length: 9 }, (_, i) => i + 1).map(number =>
        <TouchableOpacity
          className='flex justify-center items-center border border-white p-5'
          key={number}
          onPress={() => {
            setCellValue(number, selectedCell)
            validateWin()
          }}
        >
          <Text className='text-white text-4xl text-center'>
            {number}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className='flex justify-center items-center border border-white p-5'
        onPress={() => undo()}
      >
        <Text className='text-white text-4xl text-center'>
          {'\u21b6'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}