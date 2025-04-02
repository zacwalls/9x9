import { Text, TouchableOpacity } from "react-native"
import useGameStore from "@/hooks/useGameStore"

export default function GameBoardCell({ row, column, value }: { row: number, column: number, value: number }) {
  const selectedGrid = useGameStore((state) => state.selectedGrid)
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setSelectedCell = useGameStore((state) => state.setSelectedCell)
  const isSelectedCell = (selectedCell[0] === row && selectedCell[1] === column)
  let classNames = 'flex justify-center items-center basis-[calc(100%/9)] border border-white border-collapse'

  selectedGrid.forEach(cell => {
    if (row === cell[0] && column === cell[1] && !isSelectedCell) {
      classNames += ' bg-gray-500'
    }
  })

  if (isSelectedCell) {
    classNames += ' bg-blue-500'
  } else if (selectedCell[0] === row || selectedCell[1] === column) {
    classNames += ' bg-gray-500'
  }

  return (
    <TouchableOpacity
      key={row + ', ' + column}
      className={classNames}
      onPress={() => setSelectedCell([row, column])}
    >
      <Text className='text-white text-4xl'>{value !== 0 ? value : ' '}</Text>
    </TouchableOpacity>
  )
}