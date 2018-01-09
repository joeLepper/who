const React = require('react')
const { Component } = React
const styled = require('styled-components').default

const Messages = require('./messages')
const Buttons = require('./buttons')

const Div = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`
class ConversationNode extends Component {
  constructor () {
    super(...arguments)
    this.advanceMessage = this.advanceMessage.bind(this)
    this.reverseMessage = this.reverseMessage.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
    this.state = {
      idx: 0,
    }
  }
  advanceMessage () {
    const proposedIdx = this.state.idx + 1
    this.setState({ opacity: 0 })
    setTimeout(() => {
      const newState = { opacity: 1 }
      if (proposedIdx < this.props.node.data.messages.length) {
        newState.idx = proposedIdx
      }
      this.setState(newState)
    }, 500)
  }
  reverseMessage (cb) {
    const proposedIdx = this.state.idx - 1
    this.setState({ opacity: 0 })
    setTimeout(() => {
      const newState = { opacity: 1 }
      if (proposedIdx >= 0) {
        newState.idx = proposedIdx
      }
      this.setState(newState, cb)
    }, 500)
  }
  handleMessageDelete (nodeId, messageIndex) {
    if (confirm('Delete this message?')) this.reverseMessage(() => {
      this.props.onMessageDelete(nodeId, messageIndex)
    })
  }
  render () {
    return (
      <g transform={`translate(${this.props.node.x}, ${this.props.node.y})`}>
        <foreignObject
          width={this.props.dimensions.w}
          height={this.props.dimensions.h}>
          <Div>
            <Messages
              advanceMessage={this.advanceMessage}
              reverseMessage={this.reverseMessage}
              opacity={this.state.opacity}
              index={this.state.idx}
              onMessageDelete={this.handleMessageDelete}
              onMessageChange={this.props.onMessageChange}
              onMessageAdd={this.props.onMessageAdd}
              editing={this.props.editing}
              node={this.props.node}/>
            <Buttons
              editing={this.props.editing}
              onButtonAdd={this.props.onButtonAdd}
              onButtonChange={this.props.onButtonChange}
              onButtonDelete={this.props.onButtonDelete}
              onSelectNode={this.props.onSelectNode}
              opacity={this.state.idx === this.props.node.data.messages.length - 1 ? 1 : 0}
              node={this.props.node} />
          </Div>
        </foreignObject>
      </g>
    )
  }
}
module.exports = ConversationNode
