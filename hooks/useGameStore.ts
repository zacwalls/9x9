import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
    board: number[][]
    solution: number[][]
    selectedCell: number[]
    isNewGame: boolean
    history: number[][]
    isWon: boolean
    selectedGrid: number[][]
    gameTimeSeconds: number
    validateWin: () => void
    undo: () => void
    setCellValue: (newNumber: number, cellCoordinates: number[]) => void
    setSelectedCell: (cellCoordinates: number[]) => void
    setBoard: (newBoard: number[][]) => void
    setSolution: (solutionBoard: number[][]) => void
    setIsNewGame: (isNewGame: boolean) => void
    setWon: (isWon: boolean) => void
    setGameTimeSeconds: (gameTimeSeconds: number) => void
}

export default create<GameState>()(
    persist(
        (set, get) => ({
            board: [],
            solution: [],
            selectedCell: [-1, -1],
            selectedGrid: [],
            isNewGame: true,
            history: [],
            isWon: false,
            gameTimeSeconds: 0,
            setGameTimeSeconds: (gameTimeSeconds) => set(() => ({ gameTimeSeconds })),
            setBoard: (newBoard) => set(() => ({ board: newBoard })),
            setIsNewGame: (isNewGame) => set(() => ({ isNewGame })),
            setSolution: (solutionBoard) => set(() => ({ solution: solutionBoard })),
            setWon: (isWon) => set(() => ({ isWon })),
            validateWin: () => {
                const gameBoard = get().board
                const solutionBoard = get().solution

                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (gameBoard[row][col] !== solutionBoard[row][col]) {
                            return
                        }
                    }
                }

                set(() => ({ isWon: true }))
            },
            undo: () => {
                const historyStack = get().history
                const gameBoard = get().board

                if (historyStack.length <= 0) {
                    return
                }

                const [row, col] = historyStack.pop() as number[]
                const newGameBoard = [...gameBoard]

                newGameBoard[row][col] = 0
                set(() => ({ board: newGameBoard, history: historyStack }))
            },
            setCellValue: (newNumber, cellCoordinates) => {
                if (
                    (cellCoordinates[0] < 0 || cellCoordinates[0] > 9) ||
                    (cellCoordinates[1] < 0 || cellCoordinates[1] > 9)
                ) {
                    // Invalid coordinates
                    return
                }

                if (newNumber < 0 || newNumber > 9) {
                    // Invalid input
                    return
                }

                const [targetRow, targetColumn] = cellCoordinates
                const gameBoard = get().board

                if (gameBoard[targetRow][targetColumn] !== 0) {
                    // Cell is populated
                    return
                }

                const historyStack = get().history
                const newGameBoard = [...gameBoard]

                historyStack.push(cellCoordinates)
                newGameBoard[targetRow][targetColumn] = newNumber
                set(() => ({ board: newGameBoard, history: historyStack }))
            },
            setSelectedCell: (cellCoordinates) => {
                const [row, col] = cellCoordinates
                const localX = Math.floor(row / 3) * 3
                const localY = Math.floor(col / 3) * 3
                const selectedGrid: number[][] = []

                if ((row < 0 || row > 9) || (col < 0 || col > 9)) {
                    return
                }

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        selectedGrid.push([localX + i, localY + j])
                    }
                }

                set(() => ({ selectedCell: cellCoordinates, selectedGrid }))
            }
        }),
        {
            name: 'game',
            storage: createJSONStorage(() => AsyncStorage)
        })
)