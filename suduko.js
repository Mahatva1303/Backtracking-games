const grid = document.getElementById("sudoku-grid");
const loadingOverlay = document.getElementById("loading-overlay");

// Create a 9x9 Sudoku input grid
for (let r = 0; r < 9; r++) {
  const row = grid.insertRow();
  for (let c = 0; c < 9; c++) {
    const cell = row.insertCell();
    const input = document.createElement("input");
    input.maxLength = 1;
    input.id = `cell-${r}-${c}`;
    cell.appendChild(input);
  }
}

// Get grid values as a 2D array
function getGrid() {
  let arr = [];
  for (let r = 0; r < 9; r++) {
    let row = [];
    for (let c = 0; c < 9; c++) {
      const val = document.getElementById(`cell-${r}-${c}`).value;
      row.push(val ? parseInt(val) : 0);
    }
    arr.push(row);
  }
  return arr;
}

// Set grid values from 2D array
function setGrid(arr) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      document.getElementById(`cell-${r}-${c}`).value =
        arr[r][c] === 0 ? "" : arr[r][c];
    }
  }
}

// Check if placing a number is safe
function isSafe(board, row, col, num) {
  for (let x = 0; x < 9; x++)
    if (board[row][x] === num || board[x][col] === num)
      return false;

  let sr = row - (row % 3),
      sc = col - (col % 3);

  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (board[sr + r][sc + c] === num)
        return false;

  return true;
}

// Backtracking Sudoku solver
function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, r, c, num)) {
            board[r][c] = num;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Solve Button
document.getElementById("solveBtn").addEventListener("click", async () => {
  let board = getGrid();
  
  // Show loading overlay
  loadingOverlay.classList.add("active");

  // Small delay to let the video appear
  await new Promise(resolve => setTimeout(resolve, 2000));

  const solved = solve(board);

  // Hide the overlay after solving
  loadingOverlay.classList.remove("active");

  if (solved) setGrid(board);
  else alert("No solution exists!");
});

// Clear Button
document.getElementById("clearBtn").addEventListener("click", () => {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      document.getElementById(`cell-${r}-${c}`).value = "";
});
