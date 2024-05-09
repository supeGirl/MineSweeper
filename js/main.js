'use strict'
const MINE = '💣'
const EMPTY = ''
const STARTPLAYER = '😀'
const ONMINEPLAYER = '😫'
const LOSERPLAYER = '☠'
const WINNERLAYER = '😎'

const FLAG = '🚩'
const NUM = 'num'
const LIFE = '❤'

const tileType = {
  EMPTY: '',
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


const gLevel = {
  //later will be update by lvl
  SIZE: 4,
  MINES: 2,
}

var gIntervalId
var gTimeInterval
var gFirstClick
var gUserLife
var gIsGameOver

//Model:
var gBoard 

function onInit() {
  gBoard = buildBoard()
  switchEmoji(STARTPLAYER)
  stopTimer()
  
  clearInterval(gTimeInterval)
  clearInterval(gUserLife)
  document.querySelector('.minutes').innerHTML = `00`
  document.querySelector('.seconds').innerHTML = `00`
  document.querySelector('.life').innerHTML = ''
  document.querySelector('.score').innerHTML = 0
 document.querySelector('.mine-count').textContent = 0
  if (gLevel.SIZE === 4) {
    gUserLife = 2
  } else {
    gUserLife = 3
  }

  console.log('onInit gboardL', gBoard)
  renderBoard(gBoard)
  gGame.isOn = true
  gFirstClick = true
  gIsGameOver = false
  updateLife()
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
      // if ((i === 0 && j === 1) || (i === 3 && j === 2)) {
      //   cell.type = MINE
      //   cell.isMine = true
      //   gGame.mines.push(board[i][j].location)
      // }
    }
  }

  // Return the created board
  return board
}

function changeLevel(size, mines) {
  const elTable = document.querySelector('.board-game')
 
  gLevel.SIZE = size
  gLevel.MINES = mines


  const cols = gLevel.SIZE
  const rows = gLevel.SIZE
  const totalCells = cols * rows

  const cellSize = 80 / Math.sqrt(totalCells)
  elTable.style.setProperty('--cols-size', `${cellSize}vw`)
  

  
  onInit()
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
