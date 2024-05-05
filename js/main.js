'use strict'
const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'

const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  mines: [],
}

const gLevel = {
  //later will be update by lvl
  SIZE: 4,
  MINES: 2,
}

var gIntervalId

//Model:
var gBoard

function onInit() {
  stopTimer()
  document.querySelector('.minutes').innerHTML = `00`
  document.querySelector('.seconds').innerHTML = `00`

  gGame.isOn = true

  gBoard = buildBoard()
  // console.log(gGame)
  console.log(gBoard)

  renderBoard(gBoard)
  setMinesNegsCount(gBoard)
  gGame.secsPassed = startTimer()
}

function buildBoard() {
  //Build the board

  const board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      const cell = {
        type: EMPTY,
        location: { i, j },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
      board[i][j] = cell

      // set the mines manually done
      if ((i === 0 && j === 1) || (i === 3 && j === 2)) {
        cell.type = MINE
        gGame.mines.push(board[i][j].location)
      }
    }
  }
  setMinesNegsCount(board)
  // Return the created board
  return board
}

function setMinesNegsCount(board) {
  // Count mines around each cell and set the cell's minesAroundCount.
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j].type === EMPTY) {
        board[i][j].minesAroundCount = countNegs(board, i, j)
      }
    }
  }
}

function countNegs(board, rowIdx, colIdx) {
  var neighborsCount = 0

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue
      if (board[i][j].type === MINE) neighborsCount++
    }
  }
  return neighborsCount
}

// Render the board to an HTML table
function renderBoard(board) {
  const elBoard = document.querySelector('.board-game')
  var strHtml = ''

  for (var i = 0; i < board.length; i++) {
    strHtml += `\n<tr>`
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      const className = cell.isShown
        ? `seen cell-${i}-${j}`
        : `hidden cell-${i}-${j}`
      var cellContent

      if (cell.type === MINE) {
        cellContent = MINE
      } else {
        cellContent = cell.minesAroundCount > 0 ? cell.minesAroundCount : EMPTY
      }

      strHtml += `\n\t<td data-i="${i}" data-j="${j}"
                onclick="onCellClicked(this, ${i}, ${j})"
                class=${className}>${cellContent}</td>`
    }
    strHtml += `\n</tr>`
  }

  elBoard.innerHTML = strHtml
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(rowIdx, colIdx, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
  elCell.innerHTML = value
}

//Called when a cell is clicked
function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return

  if (!elCell.isShown) {
  elCell.classList.remove('hidden')
  elCell.classList.add('seen')
  elCell.isShown = true
  
  if (elCell.type === MINE) {
    endGame()
    return
  } else {
  }
  }

  if (elCell.isShown) {
    gGame.shownCount++
    setMinesNegsCount(gBoard, i, j)
  }

}

function shownCell(elCell, i, j) {}

function hideCells(elCell, i, j) {}

function onCellMarked() {
  //   Called when a cell is right- clicked See how you can hide the context
}

function onRightClick(eventKeyboard) {
  // console.log('eventKeyboard:', eventKeyboard)
}

// Returns the class name for a specific cell
function getClassName(position) {
  const cellClass = `cell-${position.i}-${position.j}`
  return cellClass
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
}

function expandShown(board, elCell, i, j) {
  // When user clicks a cell with no mines around, we need to open
  // not only that cell, but also its neighbors.
  // NOTE: start with a basic implementation that only opens
  // the non-mine 1st degree neighbors
  console.log('hi')
  // BONUS: if you have the time later, try to work more like the
  // real algorithm (see description at the Bonuses section below)
}

function endGame() {
  console.log('bey')
  stopTimer()
}

function startTimer() {
  var elMinuteContainer = document.querySelector('.minutes')
  var elSecondContainer = document.querySelector('.seconds')

  var startTime = Date.now()
  gIntervalId = setInterval(function () {
    var elapsed = Math.floor((Date.now() - startTime) / 1000)
    var minutes = Math.floor(elapsed / 60)
    var seconds = elapsed % 60

    elSecondContainer.innerText = pad(seconds)
    elMinuteContainer.innerText = pad(minutes)
  }, 1000)
}
function stopTimer() {
  clearInterval(gIntervalId)
}
