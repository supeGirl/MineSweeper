'use strict'
var gIsHintOn = false

function onCellClicked(elCell, i, j) {
  const clickedCell = gBoard[i][j]
  // console.log('before', clickedCell)
  if (!gGame.isOn || clickedCell.isMarked || clickedCell.isShown) return

  if (gFirstClick) {
    gFirstClick = false
    startTimer()

    placeMinesOnBoard(gLevel, gBoard, i, j)
    setMinesNegsCount(gBoard)
    gGame.secsPassed = 0
  }

  if (gIsHintOn) {
    hideCellHint(clickedCell)
  }

  if (clickedCell.type === EMPTY) {
    expandShown(gBoard, i, j)
  }
  if (clickedCell.isMine) {
    if (!gFirstClick && !gIsHintOn)  {
      clickedOnMine(clickedCell)
    }
  }

  clickedCell.isShown = true
  elCell.classList.remove('hidden')
  elCell.classList.add('seen')
  gGame.shownCount++
  // console.log('clickedCell:', clickedCell)
  // console.log('game show count',gGame.shownCount )

  switchEmoji(STARTPLAYER)
  checkGameOver(clickedCell)
  renderBoard(gBoard)
}

function expandShown(board, rowIdx, colIdx) {
  if (rowIdx >= board.length || colIdx >= board[0].length) return
  if (rowIdx < 0 || colIdx < 0) return
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
        } else if (board[i][j].minesAroundCount > 0) {
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
  const elFlag = document.querySelector('.flag-count')
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
    gGame.markedCount++
  } else {
    elCell.innerText = ''
    elCell.classList.add('hidden')
    gGame.markedCount--
  }

  elFlag.innerHTML = gGame.markedCount

  checkGameOver()
}

function clickedOnMine(clickedCell) {
  //   console.log('clickedOnMine:', clickedCell)
  if (clickedCell.isMarked) return

  if (clickedCell.isMine) {
    gUserLife--
    switchEmoji(ONMINEPLAYER)
    // setTimeout(() => {
    //     switchEmoji(STARTPLAYER)
    // }, 2000)

    updateLife()
  }

  if (gUserLife === 0) {
    switchEmoji(LOSERPLAYER)
    endGame()
  }
  renderBoard(gBoard)
}

function useHint() {
  if (gGame.hints > 0) {
    gIsHintOn = true
    gGame.hints--
    updateHintBtn()
  }
}

function hideCellHint(clickedCell) {
  if (!clickedCell.isShown) {
    clickedCell.isShown = true
    setTimeout(() => {
      gIsHintOn = false
      clickedCell.isShown = false
      renderBoard(gBoard)
    }, 1000)
  }
}

function updateHintBtn() {
  const elHints = document.querySelector('.hints-emoji')
  var hintsArray = []
  for (var i = 0; i < gGame.hints; i++) {
    hintsArray.push(HINTS)
  }
  elHints.innerText = hintsArray.join(' ')
}
