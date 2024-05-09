'use strict'

function onCellClicked(elCell, i, j) {
  const clickedCell = gBoard[i][j]
  // console.log('before', clickedCell)
  if (!gGame.isOn || clickedCell.isMarked || clickedCell.isShown) return

  if (gFirstClick) {
    gFirstClick = false
    startTimer()

    placeMinesOnBoard(gLevel, gBoard, i, j)
    setMinesNegsCount(gBoard)
  }

  if (clickedCell.type === EMPTY) {
    expandShown(gBoard, i, j)
  }
  if (clickedCell.isMine) {
    if (!gFirstClick) {
      clickedOnMine(clickedCell)
    }
  }

  clickedCell.isShown = true
  elCell.classList.remove('hidden')
  elCell.classList.add('seen')
  // console.log('clickedCell:', clickedCell)

  switchEmoji(STARTPLAYER)
  renderBoard(gBoard)
  checkGameOver(clickedCell)
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
  checkGameOver()
}

function clickedOnMine(clickedCell) {
  console.log('clickedOnMine:', clickedCell)
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
