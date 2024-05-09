'use strict'

function placeMinesOnBoard(gLevel, board, cellI, cellJ) {
  const elMine = document.querySelector('.mine-count')
  var mineCount = 0
  for (var i = 0; i < gLevel.MINES; i++) {
    const randomI = getRandomInt(0, gLevel.SIZE)
    const randomJ = getRandomInt(0, gLevel.SIZE)

    const randomCell = board[randomI][randomJ]
    randomCell.type = MINE
    randomCell.isMine = true
    randomCell.location = {i: randomI, j: randomJ}
    gGame.mines.push(randomCell.location)

    mineCount++
    setMinesNegsCount(board)
  }
  elMine.innerHTML = mineCount
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
      // console.log('countNegs', board[i][j])
      if (board[i][j].type === MINE) neighborsCount++
    }
  }
  return neighborsCount
}

function expandShown(board, rowIdx, colIdx) {
  if(rowIdx >= board.length || colIdx >= board[0].length) return
  if(rowIdx < 0 || colIdx < 0) return
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
        if (!board[i][j].minesAroundCount) {
        expandShown(board, i, j)
     
        }
        else if (board[i][j].minesAroundCount > 0) {
          board[i][j].isShown = true
        }
      }
    }
  }
  console.log('board:', board)

  renderBoard(board)
}

function updateLife() {
  var elLife = document.querySelector('.life')
  var lifeArray = []
  for (var i = 0; i < gUserLife; i++) {
    lifeArray.push(LIFE)
  }
  elLife.innerHTML = lifeArray.join(' ')
}

function switchEmoji(newEmoji) {
  const elPlayer = document.querySelector('.player-emoji')
  elPlayer.textContent = newEmoji
}


function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown

  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var currCell = gBoard[i][j]

      if (currCell.isMine && !currCell.isMarked) return
      if (!currCell.isMine && !currCell.isShown) return
    }
  }
  endGame(true)
}

function endGame(isWin) {
  const elModel = document.querySelector('.modal')
  const elMsg = document.querySelector('.modal-message')
  const elCloseBtn = document.querySelector('.close')
  if (!isWin) {
    switchEmoji(LOSERPLAYER)
    console.log('YOU LOSE!')
    elMsg.textContent = 'Game over! You lost  try again!'
  } else {
    switchEmoji(WINNERLAYER)
    elMsg.textContent = 'Congratulations! You won! 🏆'
    console.log('YOU WON!')
  }
  elModel.style.display = 'block'
  if (elCloseBtn) {
    elCloseBtn.addEventListener('click', hideModal)
  }
  stopTimer()
  gGame.isOn = false
}

function hideModal() {
  const elModel = document.querySelector('.modal')
  if (elModel) {
    elModel.style.display = 'none'
  }
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
