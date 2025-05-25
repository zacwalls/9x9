import { useEffect } from "react"
import { View } from 'react-native'
import { useLocalSearchParams } from "expo-router"

import Sudoku, { SudokuDifficulty } from '@/utils/Sudoku'
import useGameStore from "@/hooks/useGameStore"
import GameBoardCell from "@/components/GameBoardCell"
import { useIsFocused } from "@react-navigation/native"


export default function GameBoard({ difficulty }: { difficulty: SudokuDifficulty }) {
    const board = useGameStore((state) => state.board)
    const setBoard = useGameStore((state) => state.setBoard)
    const setSolution = useGameStore((state) => state.setSolution)
    const setGameTimeSeconds = useGameStore((state) => state.setGameTimeSeconds)
    const setGameTimerRunning = useGameStore((state) => state.setGameTimerRunning)
    const { newGame } = useLocalSearchParams()
    const isFocused = useIsFocused()

    // const verticalSubgridDividerCells = [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77]
    // const horizontalSubgridDividerCells = [18, 19, 20, 21, 22, 23, 24, 25, 26, 45, 46, 47, 48, 49, 50, 51, 52, 53]

    useEffect(() => {
        if (!isFocused) {
            setGameTimerRunning(false)
            return
        }

        if (newGame === 'true') {
            const puzzle = new Sudoku(difficulty)
            setBoard(puzzle.board)
            setSolution(puzzle.solution)
            setGameTimeSeconds(0)
        }

        setGameTimerRunning(true)
        useGameStore.persist.setOptions({ name: `${difficulty}` })
        useGameStore.persist.rehydrate()
    }, [isFocused])

    return (
        <View className='flex flex-1 flex-wrap flex-row w-[95%] lg:w-[30%]'>
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