const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const Button = require('./button')

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
  width: 90%;
  text-align: center;
  color: #f09;
`

const Div = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
`

const A = styled.a`
  width: 10%;
  margin: auto;
  font-size: 16;
`

class Message extends Component {
  constructor () {
    super(...arguments)
    this.renderDisplayMessage = this.renderDisplayMessage.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
  }
  handleMessageDelete () {
    this.props.onMessageDelete(this.props.nodeId, this.props.messageIndex)
  }
  renderDisplayMessage () {
    if (this.props.editing) return (
      <Div>
        <Button
          editing={false}
          style={{
            width: '6%',
            fontSize: 16,
          }}
          opacity={this.props.opacity}
          onClick={this.handleMessageDelete}
          key='new button'>delete</Button>
        <Input
          value={this.props.children}
          onChange={(e) => {
            this.props.onChange(this.props.nodeId, this.props.messageIndex, e.currentTarget.value)
          }}/>
      </Div>
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
