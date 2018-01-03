const React = require('react')
const { render } = require('react-dom')
const Game = require('./game')

setTimeout(() => {
  const container = document.querySelector('.container')

  render(<Game />, container)
}, 4)


