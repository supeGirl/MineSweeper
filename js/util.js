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
