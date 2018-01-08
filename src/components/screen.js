const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const ConversationNode = require('./conversation-node')

class Screen extends Component {
  render () {
    const nodes = this.props.nodes.map((n, i) => (
      <ConversationNode
        editing={this.props.editing}
        onSelectNode={this.props.onSelectNode}
        onButtonChange={this.props.onButtonChange}
        onButtonAdd={this.props.onButtonAdd}
        onMessageChange={this.props.onMessageChange}
        onMessageAdd={this.props.onMessageAdd}
        dimensions={this.props.dimensions}
        key={i}
        node={n} />
    ))
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
