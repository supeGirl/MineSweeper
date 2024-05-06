'use strict'

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
  