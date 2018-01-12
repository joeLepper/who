const React = require('react')
const { Component } = React
const styled = require('styled-components').default

const Messages = require('./messages')
const Buttons = require('./buttons')

const Circle = styled.circle`
  fill: #f09;
`
const ActiveCircle = styled.circle`
  fill: #9f0;
`
const HitTarget = styled.circle`
  fill: rgba(0,0,0,0.0);
  cursor: pointer;
`
class GraphicalNode extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      hover: false,
      active: false,
    }
  }
  render () {
    return (
      <g transform={`translate(${this.props.node.x}, ${this.props.node.y})`}>
        <Circle r={ this.state.hover ? 8 : 2} />
        {this.state.hover ? <ActiveCircle r="5" /> : null}
        {this.state.hover ? <Circle r="2" /> : null}
        <HitTarget
          onMouseEnter={() => {
            this.setState({ hover: true })
          }}
          onMouseLeave={() => {
            this.setState({ hover: false })
          }}
          onMouseDown={() => {
            console.log('down.')
            this.setState({ active: false })
          }}
          r="8" />
      </g>
    )
  }
}
module.exports = GraphicalNode
