const React = require('react')
const { Component } = React

const Message = require('./message')

const BUTTON_PADDING = 16
const BUTTON_FONT_SIZE = 16


class ConversationNode extends Component {
  constructor () {
    super(...arguments)
    this.advanceMessage = this.advanceMessage.bind(this)
    this.renderButtons = this.renderButtons.bind(this)
    this.renderMessages = this.renderMessages.bind(this)
    this.state = {
      idx: 0,
    }
  }
  advanceMessage () {
    const proposedIdx = this.state.idx + 1
    if (proposedIdx < this.props.node.data.messages.length) {
      this.setState({ idx: proposedIdx })
    }
  }
  renderMessages () {
    const messages = this.props.node.data.messages.map((msg, i) => (
      <Message
        x={this.props.dimensions.w * i}
        y={this.props.node.data.fontSize * (i + 1)}
        key={i}
        fontSize={this.props.node.data.fontSize}>{msg}</Message>
    ))
    return (
      <g className="Messages">{messages}</g>
    )
  }
  renderButtons () {
    if (!this.props.node.children) return null
    const buttons = this.props.node.children.map((child, i) => {
      const transX = this.props.dimensions.w * (this.props.node.data.messages.length - 1)
      const transY = BUTTON_PADDING +
        (BUTTON_FONT_SIZE * (i + 1)) +
        (this.props.node.data.messages.length * this.props.node.data.fontSize)
      return (
        <text
          x="1em"
          y={transY}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            this.props.onSelectNode(child)
          }}
          key={i}>{child.data.optionText}</text>
      )
    })
    return <g className="Buttons">{buttons}</g>
  }
  render () {
    return (
      <g transform={`translate(${this.props.node.x}, ${this.props.node.y})`}>
        {this.renderMessages()}
        {this.renderButtons()}
      </g>
    )
  }
}
module.exports = ConversationNode
