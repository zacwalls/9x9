import { useEffect } from '@lynx-js/react'

import './App.css'
import { Sudoku } from './utils/sudoku.js'
import useGameStore from "./hooks/useGameStore.js";


export function App() {
  const board = useGameStore((state) => state.board)
  const setBoard = useGameStore((state) => state.setBoard)
  const setSolution = useGameStore((state) => state.setSolution)
  const setCellValue = useGameStore((state) => state.setCellValue)
  const selectedCell = useGameStore((state) => state.selectedCell)
  const setSelectedCell = useGameStore((state) => state.setSelectedCell)
  const isNewGame = useGameStore((state) => state.isNewGame)
  const setIsNewGame = useGameStore((state) => state.setIsNewGame)
  const undo = useGameStore((state) => state.undo)
  const validateWin = useGameStore((state) => state.validateWin)
  const isWon = useGameStore((state) => state.isWon)
  const verticalSubgridDividerCells = [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77]
  const horizontalSubgridDividerCells = [18, 19, 20, 21, 22, 23, 24, 25, 26, 45, 46, 47, 48, 49, 50, 51, 52, 53]

  useEffect(() => {
    if (isNewGame) {
      const puzzle = new Sudoku('evil')
      setBoard(puzzle.board)
      setSolution(puzzle.solution)
      setIsNewGame(false)
    }
  }, [])

  return (
    <view className="game-view">
      <view className="game-grid">
        {board.map((row, rowNumber) =>
          row.map((cellValue, columnNumber) => {
            const linearIndex = rowNumber * 9 + columnNumber
            let style = ''

            if (verticalSubgridDividerCells.includes(linearIndex)) {
              style += 'border-right: 2px black;'
            }

            if (horizontalSubgridDividerCells.includes(linearIndex)) {
              style += 'border-bottom: 2px black;'
            }

            if (selectedCell[0] === rowNumber && selectedCell[1] === columnNumber) {
              style += 'background-color: blue;'
            }

            return (
              <text 
                className='game-grid-cell'
                style={style}
                bindtap={() => setSelectedCell([rowNumber, columnNumber])}
              >
                {cellValue === 0 ? ' ' : cellValue.toString()}
              </text>
            )
          })
        )}
      </view>
      <view className="game-inputs">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number =>
          <text
            className="game-input"
            bindtap={() => setCellValue(number, selectedCell)}
          >
            {number}
          </text>
        )}
        <text className="game-input undo" bindtap={() => undo()}>↶</text>
      </view>
    </view>
  )
}
