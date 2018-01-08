const React = require('react')
const { Component } = React
const styled = require('styled-components').default

const MessageContainer = styled.li`
  font-size: 32;
  margin: auto;
  flex: 1 1 auto;
  width: 96vw;
  flex-flow: row nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s;
`

const P = styled.p`
  margin: auto;
`

const Input = styled.input`
  margin: auto;
  font-size: 32;
  border: none;
  outline: none;
  width: 100%;
  text-align: center;
  color: #f09;
`

class Message extends Component {
  constructor () {
    super(...arguments)
    this.renderDisplayMessage = this.renderDisplayMessage.bind(this)
  }
  renderDisplayMessage () {
    if (this.props.editing) return (
      <Input
        value={this.props.children}
        onChange={(e) => {
          this.props.onChange(this.props.nodeId, this.props.messageIndex, e.currentTarget.value)
        }}/>
    )
    return (
      <P>{this.props.children}</P>
    )
  }
  render () {
    return (
      <MessageContainer onClick={this.props.onClick} style={{ opacity: this.props.opacity}}>
        {this.renderDisplayMessage()}
      </MessageContainer>
    )
  }
}

module.exports = Message
