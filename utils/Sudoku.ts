export const sudokuDifficulty = ['easy', 'medium', 'hard', 'evil'] as const
export type SudokuDifficulty = typeof sudokuDifficulty[number]

export default class Sudoku {
  board: number[][]
  solution: number[][]
  difficulty: SudokuDifficulty

  private GIVENS = {
    'easy': 35,
    'medium': 28,
    'hard': 22,
    'evil': 17
  }

  constructor(difficulty: SudokuDifficulty) {
    this.difficulty = difficulty
    this.solution = this.generateFullBoard()
    this.board = this.removeNumbers(this.solution)
  }

  /** Checks a given value is valid in a specified cell */
  isValid(board: number[][], row: number, col: number, value: number) {
    // Check row and column for value
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value || board[i][col] === value) {
        return false
      }
    }

    // Check local 3x3 grid for value
    const localX = Math.floor(row / 3) * 3
    const localY = Math.floor(col / 3) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[localX + i][localY + j] === value) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Shuffle an array in-place using Fisher-Yates algorithm.
   */
  shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /** Generate complete and valid sudoku */
  generateFullBoard() {
    const board = Array(9).fill(null).map(() => Array(9).fill(0))

    const fillBoard = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
            this.shuffleArray(numbers)

            for (let number of numbers) {
              if (this.isValid(board, row, col, number)) {
                board[row][col] = number

                if (fillBoard()) {
                  return true
                }

                board[row][col] = 0
              }
            }
            return false
          }
        }
      }
      return true
    }

    fillBoard()
    return board
  }

  /** Verifies uniqueness of solution */
  isUnique(board: number[][]) {
    const solutions: number[][][] = []

    const findSolutions = (b: number[][]) => {
      if (solutions.length > 1) return;

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (b[row][col] === 0) {
            for (let number = 1; number <= 9; number++) {
              if (this.isValid(b, row, col, number)) {
                b[row][col] = number
                findSolutions(b)
                b[row][col] = 0
              }
            }
            return
          }
        }
      }

      solutions.push(b.map(row => [...row]))
    }

    findSolutions(board)
    return solutions.length === 1
  }

  /** Removes numbers from full board given difficulty */
  removeNumbers(board: number[][]) {
    const givens = this.GIVENS[this.difficulty]
    const puzzle = board.map(row => [...row]);
    let cells = []

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            cells.push([r, c])
        }
    }

    this.shuffleArray(cells)

    while(cells.length > givens) {
      const [row, col] = cells.pop()!
      const tmp = puzzle[row][col]
      puzzle[row][col] = 0

      const tmpPuzzle = puzzle.map(row => [...row])

      if (!this.isUnique(tmpPuzzle)) {
        puzzle[row][col] = tmp
      }
    }

    return puzzle
  }
}