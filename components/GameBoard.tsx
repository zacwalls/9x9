import { useEffect } from "react"
import { View } from 'react-native'

import Sudoku from '@/utils/Sudoku'
import useGameStore from "@/hooks/useGameStore"
import GameBoardCell from "./GameBoardCell"


export default function GameBoard() {
    const board = useGameStore((state) => state.board)
    const setBoard = useGameStore((state) => state.setBoard)
    const setSolution = useGameStore((state) => state.setSolution)
    const isNewGame = useGameStore((state) => state.isNewGame)
    const setIsNewGame = useGameStore((state) => state.setIsNewGame)

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
        <View className='flex flex-wrap flex-row w-[400px] h-[500px]'>
            {board.map((row, rowNumber) =>
                row.map((cellValue, columnNumber) =>
                    <GameBoardCell
                        key={`${rowNumber},${columnNumber}`}
                        row={rowNumber}
                        column={columnNumber}
                        value={cellValue}
                    />
                ))}
        </View>
    )
}