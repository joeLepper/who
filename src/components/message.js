const React = require('react')
const { Component } = React

class Message extends Component {
  render () {
    return (
      <g>
        <text
          x="1vw"
          y={this.props.y}
          fontSize={this.props.fontSize}>{this.props.children}</text>
      </g>
    )
  }
}
module.exports = Message
