import { View, Text, TouchableOpacity } from "react-native"
import useGameStore from "@/hooks/useGameStore"
import Svg, { G, Path } from "react-native-svg"

export default function GameBoardInputs() {
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const validateWin = useGameStore((state) => state.validateWin)
  const undo = useGameStore((state) => state.undo)

  return (
    <View className='flex flex-row flex-wrap items-center justify-center gap-5 py-8'>
      {Array.from({ length: 9 }, (_, i) => i + 1).map(number =>
        <TouchableOpacity
          className='flex justify-center items-center border border-white p-5 lg:p-3'
          key={number}
          onPress={() => {
            setCellValue(number, selectedCell)
            validateWin()
          }}
        >
          <Text className='text-white text-4xl lg:text-2xl text-center'>
            {number}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className='flex justify-center items-center border border-white px-[0.8em] py-[1.4em] lg:px-2 lg:py-4'
        onPress={() => undo()}
      >
        <Svg fill="#fff" className="w-9 h-9 lg:w-6 lg:h-6" viewBox="0 0 16 16">
          <G>
            <Path d="M15,6V1.76l-1.7,1.7A7,7,0,1,0,14.92,9H13.51a5.63,5.63,0,1,1-1.2-4.55L10.76,6Z" />
          </G>
        </Svg>
      </TouchableOpacity>
    </View>
  )
}