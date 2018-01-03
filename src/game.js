const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const Screen = require('./components/screen')
const d3 = require('d3-hierarchy')

const person = require('./people/b.json')

const dimensions = {
  w: window.innerWidth,
  h: window.innerHeight,
}
const center = {
  x: dimensions.w / 2,
  y: dimensions.h / 2,
}

const treeLayout = d3.tree().nodeSize([dimensions.w, dimensions.h])
const root = treeLayout(d3.hierarchy(person))
// console.log(root)
window.root = root

class Game extends Component {

  constructor () {
    super(...arguments)
    this.handleSelectNode = this.handleSelectNode.bind(this)
    this.state = {
      x: 1,
      y: 1,
      selected: root,
    }
  }

  handleSelectNode (selected) {
    this.setState({ selected })
  }

  render () {
    return (
      <svg
        height={dimensions.h}
        width={dimensions.w}>
        <Motion style={{
          x: spring(this.state.selected.x * -1),
          y: spring((this.state.selected.y * -1) + center.y),
        }}>
          {
            ({ x, y }) => (
              <Screen
                x={x}
                y={y}
                center={center}
                dimensions={dimensions}
                onSelectNode={this.handleSelectNode}
                node={root} />
            )
          }
        </Motion>
      </svg>
    )
  }
}
module.exports = Game
