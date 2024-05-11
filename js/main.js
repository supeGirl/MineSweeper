'use strict'
const MINE = '💣'
const EMPTY = ''
const STARTPLAYER = '😀'
const ONMINEPLAYER = '😫'
const LOSERPLAYER = '☠'
const WINNERLAYER = '😎'
const HINTS = '💡'

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
  hints: 3,
}

const gLevel = {
  //later will be update by lvl
  SIZE: 4,
  MINES: 2,
  difficulty: 'Beginner'
}

// var gIntervalId
var gTimeInterval
var gCurrScore = 0
var gFirstClick
var gUserLife
var gIsGameOver

//Model:
var gBoard

function onInit() {
  gBoard = buildBoard()
  switchEmoji(STARTPLAYER)
  stopTimer()

  resetParameters()
  renderBoard(gBoard)
  updateLife()
  updateHintBtn(gBoard)
}

function changeLevel(size, mines, difficulty) {
  const elTable = document.querySelector('.board-game')

  gLevel.SIZE = size
  gLevel.MINES = mines
  gLevel.difficulty = difficulty

  const cols = gLevel.SIZE
  const rows = gLevel.SIZE
  const totalCells = cols * rows

  const cellSize = 80 / Math.sqrt(totalCells)
  elTable.style.setProperty('--cols-size', `${cellSize}vw`)

  onInit()
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

function resetParameters() {
  document.querySelector('.minutes').innerHTML = `00`
  document.querySelector('.seconds').innerHTML = `00`
  document.querySelector('.life').innerHTML = ''

  clearInterval(gTimeInterval)
  clearInterval(gUserLife)

  document.querySelector('.mine-count').textContent = 0
  document.querySelector('.flag-count').textContent = 0
  document.querySelector('.score').textContent = 0


  if (gLevel.SIZE === 4) {
    gUserLife = 2
  } else {
    gUserLife = 3
  }

  gGame.isOn = true
  gGame.markedCount = 0
  gGame.hints = 3

  gFirstClick = true
  gIsGameOver = false
}


//CR here
function saveHighScore() {
  if (typeof Storage !== 'undefined') { 
    var bestScores = JSON.parse(localStorage.getItem('bestScore')) || {}// Parse the stored string to convert it back to an object

    if (!(gLevel.difficulty in bestScores)) {
      bestScores[gLevel.difficulty] = [] // Initialize the array if it doesn't exist
    }

    var currentScores = bestScores[gLevel.difficulty]
    checkBestScore(currentScores)

    localStorage.setItem('bestScore', JSON.stringify(bestScores)) // Stringify the object before storing it
  } else {
    console.log('Sorry! No web storage support.')
  }
}


function checkBestScore(currentScores) {
  if(currentScores.length === 0){
    currentScores.push(gCurrScore)
    return
  }
  if (gCurrScore > currentScores[currentScores.length - 1] && currentScores.length >= 5) {
    return
  }
  for (var i = 0; i < currentScores.length; i++) {
    if (gCurrScore <= currentScores[i]) {
      currentScores.splice(i, 0, gCurrScore) // Insert the new score at the appropriate position
      if (currentScores.length > 5) {
        currentScores.pop() // Keep only the top 5 scores
      }
      break
    }
  }
}


function moveScoreToRight(scoreToReplace, currentScores, index){
for(var i = index; i < currentScores.length; i++){
  var temp = currentScores[i]
  currentScores[i] = scoreToReplace
  scoreToReplace = temp
}
}


function displayBestScore() {
  var bestScores = JSON.parse(localStorage.getItem('bestScore')) || {}
  var bestScore = bestScores[gLevel.difficulty]
  for(var i = 1; i <= bestScore.length; i++){
    console.log(document.querySelectorAll(`#highScore${i}`).innerHTML)
    document.getElementById(`highScore${i}`).innerText = bestScore[i-1]
    
  }
  document.querySelector('.highScores').style.display = 'block'
}

function formTime(seconds) {
  var minutes = Math.floor(seconds / 60)
  var remainingSec = seconds % 60
  return pad(minutes) + ':' + pad(remainingSec)
}

