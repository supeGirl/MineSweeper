'use strict'



function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function pad(val) {
  var valStr = val + ''
  if (valStr.length < 2) {
    return '0' + valStr
  } else {
    return valStr
  }
}


function findEmptyCell(gBoard) {
  const emptyCells = []

  for (var i = 1; i < gBoard.length - 1; i++) {
    for (var j = 1; j < gBoard[i].length - 1; j++) {
      const currCell = gBoard[i][j]
      if (!currCell.isMine) emptyCells.push({ i, j })
    }
  }

  if (!emptyCells.length) return null

  const randomIdx = getRandomInt(0, emptyCells.length)
  return emptyCells[randomIdx] // give the position in the array
}
