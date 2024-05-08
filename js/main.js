'use strict'
const MINE = '💣'
const EMPTY = 'empty'

const FLAG = '🚩'
const NUM = 'num'
const LIFE = '❤'

const tileType = {
  EMPTY: 'empty',
  MINE: '💣',
  NUM: 'num',
}

const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  mines: [],
}
const gLevels = [
  {NAME: 'easy',
    SIZE: 4,
    MINES: 2,
  }
]
  

const gLevel = {
  //later will be update by lvl
  SIZE: 4,
  MINES: 2,
}

var gIntervalId
var gTimeInterval
var gFirstClick
var gUserLife = 2

//Model:
var gBoard = [];

function onInit() {
  stopTimer()
  clearInterval(gTimeInterval)
  clearInterval(gUserLife)
  updateLife()
  document.querySelector('.minutes').innerHTML = `00`
  document.querySelector('.seconds').innerHTML = `00`
  document.querySelector('.life').innerHTML = ''
  gBoard = buildBoard()
  console.log('onInit gboardL', gBoard)
  renderBoard(gBoard)
  gGame.isOn = true
  gFirstClick = true
}

function buildBoard() {
  //Build the board
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      const cell = {
        type: tileType.EMPTY,
        location: {i, j},
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        initialState: true,
      }
      board[i][j] = cell

      // // turn off after i done
      if ((i === 0 && j === 1) || (i === 3 && j === 2)) {
        cell.type = MINE
        cell.isMine = true
        gGame.mines.push(board[i][j].location)
      }
    }
  }

  // Return the created board
  return board
}

// Render the board to an HTML table
function renderBoard(board) {
  const elBoard = document.querySelector('.board-game')
  var strHtml = ''

  for (var i = 0; i < board.length; i++) {
    strHtml += `\n<tr>`
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]

      var className = cell.isShown ? `seen cell-${i}-${j}` : `hidden cell-${i}-${j}`
      // maybe bring here an if Q to decide with type i should get
      // if (!cell.initialState) {
        var cellContent = cell.isShown ? (cell.type === MINE ? MINE : cell.minesAroundCount) : EMPTY
      // }

      if (cell.isMarked) {
        cellContent = FLAG
        className = 'marked'
      } else if (cell.isShown) {
        if (cell.type === MINE) {
          cellContent = MINE
        } else {
          cellContent = cell.minesAroundCount > 0 ? cell.minesAroundCount : EMPTY
        }
      }

      strHtml += `\n\t<td data-i="${i}" data-j="${j}"
                onclick="onCellClicked(this, ${i}, ${j})"
                oncontextmenu="onCellMarked(this,event,${i},${j})"
                class=${className}>${cellContent}
                </td>`
    }
    strHtml += `\n</tr>`
  }

  elBoard.innerHTML = strHtml
}

function onCellClicked(elCell, i, j) {
  const clickedCell = gBoard[i][j]
  // console.log('before', clickedCell)
  if (!gGame.isOn || clickedCell.isMarked || clickedCell.isShown) return

  if (gFirstClick) {
    gFirstClick = false

    placeMinesOnBoard(gLevel, gBoard, i, j)
    setMinesNegsCount(gBoard)
  }

  if (clickedCell.type === EMPTY) {
    // onEmptyCellClicked(elCell, i , j)
    expandShown(gBoard, i, j)
  }
  if (clickedCell.isMine) {
    clickedOnMine(clickedCell)
  }

  clickedCell.isShown = true
  elCell.classList.remove('hidden')
  elCell.classList.add('seen')
  // console.log('clickedCell:', clickedCell)

  renderBoard(gBoard)
}

function expandShown(board, rowIdx, colIdx) {
  if (board[rowIdx][colIdx].isShown || board[rowIdx][colIdx].isMarked) return
  board[rowIdx][colIdx].isShown = true
  if (board[rowIdx][colIdx].minesAroundCount > 0) return

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (
        i >= 0 &&
        i < board.length &&
        j >= 0 &&
        j < board.length &&
        (i - rowIdx) * (j - colIdx) === 0 &&
        (i !== rowIdx || j !== colIdx)
      ) {
        if (!board[i][j].minesAroundCount) expandShown(board, i, j)
        else if (board[i][j].minesAroundCount > 0) {
          board[i][j].isShown = true
        }
      }
    }
  }
  console.log('board:', board)
  
  renderBoard(board)
}

function onCellMarked(elCell, ev, i, j) {
  //   Called when a cell is right- clicked See how you can hide the context

  ev.preventDefault()
  const clickedCell = gBoard[i][j]

  if (!gGame.isOn) return
  if (clickedCell.isShown) return

  //toggle the visual appetence base on its mark
  clickedCell.isMarked = !clickedCell.isMarked
  if (clickedCell.isMarked) {
    elCell.innerText = FLAG
    elCell.classList.remove('hidden')
    elCell.classList.add('marked')
    elCell.initialState = false
  } else {
    elCell.innerText = ''
  }
}
//maybe make an array and pop them print in for loop
function updateLife() {
  var elLife = document.querySelector('.life')
  for (var i = 0; i < gUserLife; i++) {
    elLife.innerHTML += LIFE
  }
}

function clickedOnMine(clickedCell) {
  console.log('clickedOnMine:', clickedCell)
  if (clickedCell.isMarked) return

  if (clickedCell.isMine) {
    gUserLife--
  }
  if (gUserLife === 0) {
    endGame()
  }
  renderBoard(gBoard)
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
  console.log('hi')
}

function endGame() {
  alert('you Lose :( ')
  stopTimer()
  gGame.isOn = false
}
