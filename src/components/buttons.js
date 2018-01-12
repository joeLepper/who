const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const Guid = require('guid')

const Button = require('./button')

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 1 1 100vw;
`

class Buttons extends Component {
  constructor () {
    super(...arguments)
    this.handleButtonAdd = this.handleButtonAdd.bind(this)
  }
  handleButtonAdd () {
    const newNodeId = Guid.raw()
    const currentNodeId = this.props.node.data.id
    this.props.onButtonAdd(newNodeId, currentNodeId)
  }
  render () {
    if (!this.props.node.children && !this.props.editing) return null
    const buttons = (this.props.node.children || []).map((child, i) => {
      return (
        <Button
          zoomed={this.props.zoomed}
          nodeId={child.data.id}
          editing={this.props.editing}
          opacity={this.props.opacity}
          onChange={this.props.onButtonChange}
          key={i}
          onButtonDelete={this.props.onButtonDelete}
          onClick={(e) => {
            if (!this.props.editing) this.props.onSelectNode({ id: child.data.id })
          }}>{child.data.optionText}</Button>
      )
    })
    if (this.props.editing) buttons.push(
      <Button
        editing={false}
        opacity={this.props.opacity}
        onClick={this.handleButtonAdd}
        key='new button'>New Button</Button>
    )
    return <ButtonsContainer>{buttons}</ButtonsContainer>
  }
}

module.exports= Buttons
