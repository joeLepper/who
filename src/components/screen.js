const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')

const ConversationNode = require('./conversation-node')

class Screen extends Component {
  render () {
    const nodes = []
    this.props.node.each((n, i) => {
      nodes.push(
        <ConversationNode
          onSelectNode={this.props.onSelectNode}
          dimensions={this.props.dimensions}
          center={this.props.center}
          key={Math.random() + ''}
          node={n} />
      )
    })
    return (
      <g
        className="Screen"
        transform={`translate(${this.props.x}, ${this.props.y})`}>
        {nodes}
      </g>
    )
  }
}
module.exports = Screen
