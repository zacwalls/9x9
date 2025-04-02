import { View, Text, TouchableOpacity } from "react-native"
import useGameStore from "@/hooks/useGameStore"

export default function GameBoardInputs() {
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const validateWin = useGameStore((state) => state.validateWin)
  const undo = useGameStore((state) => state.undo)

  return (
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
  )
}