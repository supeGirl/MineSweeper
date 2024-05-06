'use strict'
const MINE = '💣'
const EMPTY = 'empty'
const FLAG = '🚩'
const NUM = 'num'

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
var gTimeInterval
var gFirstClick

//Model:
var gBoard

function onInit() {
  // stopTimer()
  document.querySelector('.minutes').innerHTML = `00`
  document.querySelector('.seconds').innerHTML = `00`

  gBoard = buildBoard()
  // console.log(gGame)
  console.log(gBoard)
  clearInterval(gTimeInterval)
  renderBoard(gBoard)
  setMinesNegsCount(gBoard)
  gGame.isOn = true
  gFirstClick = true
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
        cell.isMine = true
        gGame.mines.push(board[i][j].location)
      }
    }
  }
  // here to call the function mine that set them in the table

  setMinesNegsCount(board)
  board[2][0].type = EMPTY
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
      const className = cell.isShown
        ? `seen cell-${i}-${j}`
        : `hidden cell-${i}-${j}`
      var cellContent = cell.isShown
        ? cell.type === MINE
          ? MINE
          : cell.minesAroundCount
        : EMPTY

      if (cell.type === MINE) {
        cellContent = MINE
      } else {
        cellContent = cell.minesAroundCount > 0 ? cell.minesAroundCount : EMPTY
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

// // location is an object like this - { i: 2, j: 7 }
// function renderCell(i, j, value) {
//   // Select the elCell and set the value
//   const elCell = document.querySelector(`.hidden cell-${i}-${j}` || `.seen cell-${i}${j}`)
//   console.log('elCell', elCell)

//   if (value === 0) {
//     value = ''
//     console.log(`Setting cell (${i}, ${j}) to empty string`)
//   }
//   elCell.innerHTML = value
// }

//Called when a cell is clicked

function onCellClicked(elCell, i, j) {
  const clickedCell = gBoard[i][j]
  // console.log('before', clickedCell)
  if (!gGame.isOn || clickedCell.isMarked || clickedCell.isShown) return

  if (gFirstClick) {
    startTimer()
  }

  // if (clickedCell.isMine) {
  //   if (!gFirstClick) {
  //     clickedOnMine(elCell, clickedCell)
  //     elCell.classList.remove('hidden')
  //     elCell.classList.add('seen')
  //     clickedCell.isShown = true
  //     console.log('ismine:', clickedCell)
  //     return
  //   }
  // }

  if (clickedCell.isMine) {
    clickedOnMine(clickedCell)
  }

  if (clickedCell.type === EMPTY) {
    // onEmptyCellClicked(elCell, i , j)
    expandShown(gBoard, clickedCell, i, j)
  }

  gFirstClick = false
  clickedCell.isShown = true
  elCell.classList.remove('hidden')
  elCell.classList.add('seen')
  // console.log('clickedCell:', clickedCell)

  setMinesNegsCount(gBoard, i, j)
  renderBoard(gBoard)
}

function expandShown(board, elCell, rowIdx, colIdx) {
  // When user clicks a cell with no mines around, we need to open
  // not only that cell, but also its neighbors.
  // NOTE: start with a basic implementation that only opens
  // the non-mine 1st degree neighbors
  var neighbors = []

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i === gGame.SIZE) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gGame.SIZE) continue

      var currCell = board[rowIdx][colIdx]
      console.log('currCell:', currCell)
      console.log('elCell1', elCell)

      
      if (i === rowIdx && j === colIdx) continue
      neighbors.push({ row: i, col: j })

      // for (var n = 0; n < neighbors; n++) {
        console.log('elCell2', elCell)
        

        if (!currCell.isMine && !currCell.isShown) {
          currCell.innerHTML =
            currCell.minesAroundCount <= 1 ? '' : currCell.minesAroundCount
        }

        if (currCell.minesAroundCount === 0){
          elCell.location === currCell.location ? expandShown(board, elCell, i, j) : console.log('the same')

        }
        else return currCell.minesAroundCount

        currCell.isShown = true
        // neighbors[n].isShown = true
        console.log('board:', gBoard)

      // }
      console.log('neighbors', neighbors)
    }
  }

  renderBoard(gBoard)
  elCell.isShown = true
  console.log('after:',gBoard)

  // BONUS: if you have the time later, try to work more like the
  // real algorithm (see description at the Bonuses section below)
}

// function onEmptyCellClicked(elCell, i , j ) {

// console.log('i', i)
// console.log('j', j)
// }
function onCellMarked(elCell, ev, i, j) {
  //   Called when a cell is right- clicked See how you can hide the context

  ev.preventDefault()

  if (!gGame.isOn) return
  const clickedCell = gBoard[i][j]
  if (clickedCell.isShown) return

  //toggle the visual appetence base on its mark
  clickedCell.isMarked = !clickedCell.isMarked

  if (clickedCell.isMarked) {
    addFlag(elCell)
    elCell.classList.add('marked')
  } else {
    elCell.classList.remove('marked')
    elCell.classList.add('hidden')
    removeFlag(elCell)
  }
}

function addFlag(elCell) {
  elCell.innerHTML = FLAG
  elCell.classList.remove('hidden')
}

function removeFlag(elCell) {
  if (elCell.type === MINE) {
    elCell.innerHTML = MINE
    //donst bring back flag
  } else {
    elCell.innerHTML = EMPTY
  }
  // elCell.classList.add
  renderBoard(gBoard)
}

// function onRightClick(ev) {

// }

function clickedOnMine(clickedCell) {
  console.log('clickedOnMine:', clickedCell)

  //remove one live after
  endGame()
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
  console.log('hi')
}

function endGame() {
  alert('you Lose :( ')
  stopTimer()
}
