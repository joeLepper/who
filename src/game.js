const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const debounce = require('debounce')
const Screen = require('./components/screen')
const d3 = require('d3-hierarchy')
const styled = require('styled-components').default

const PERSON_ID = 'joe'

const Button = require('./components/button')
const person = require(`./people/${PERSON_ID}.json`)
const stratifier = d3.stratify().parentId((d) => {
  const parent = person.filter((node) => (
    node.children.some((child) => child === d.id)
  ))[0]
  if (parent) return parent.id
  return undefined
})
console.log('PERSON')
console.log(person)

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width:100vw;
  height:100vh;
  overflow: none;
  font-family: arial;
`

const ControlPanel = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 5vh;
`

class Game extends Component {

  constructor () {
    super(...arguments)

    this.handleSelectNode = this.handleSelectNode.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleButtonAdd = this.handleButtonAdd.bind(this)
    this.handleButtonChange = this.handleButtonChange.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.handleMessageAdd = this.handleMessageAdd.bind(this)

    const initialState = this.updateState({})
    initialState.editing = false
    this.state = initialState
  }

  componentDidMount () {
    window.addEventListener('resize', debounce(this.handleResize, 200))
  }

  handleResize () {
    this.setState(this.updateState({ selectedId: this.state.selectedId }))
  }

  handleButtonChange (nodeId, optionText) {
    // we've got to mutate here just because
    person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.optionText = optionText
        person[i] = node
      }
    })
    this.setState(this.updateState(this.state))
  }

  handleButtonAdd (newNodeId, currentNodeId) {
    // we've got to mutate here just because
    person.forEach((node, i) => {
      if (currentNodeId === node.id) {
        node.children.push(newNodeId)
        person[i] = node
      }
    })
    person.push({
      optionText: 'fresh button',
      id: newNodeId,
      fontSize: 32,
      messages: ['fresh page'],
      children: [],
    })
    this.setState(this.updateState(this.state))
  }
  handleMessageChange (nodeId, messageIndex, message) {
    // we've got to mutate here just because
    person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages[messageIndex] = message
        person[i] = node
      }
    })
    this.setState(this.updateState(this.state))
  }

  handleMessageAdd (nodeId, cb) {
    // we've got to mutate here just because
    person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages.push('fresh message')
        person[i] = node
      }
    })
    this.setState(this.updateState(this.state), cb)
  }

  updateState ({ selectedId }) {
    const newState = {
      selectedId,
      w: window.innerWidth,
      h: window.innerHeight,
    }
    const treeLayout = d3.tree().nodeSize([newState.w, newState.h * 2])
    const tree = treeLayout(stratifier(person))
    const nodes = []
    tree.each((node) => {
      if (selectedId && selectedId === node.data.id) {
        newState.selected = node
        newState.selectedId = node.data.id
      }
      nodes.push(node)
    })

    if (!newState.selected) {
      const selected = nodes.filter(({ parent }) => (
        parent === null
      ))[0]
      newState.selected = selected
      newState.selectedId = selected.data.id
    }
    newState.nodes = nodes
    return newState
  }

  handleSelectNode ({ id }) {
    this.setState(this.updateState({ selectedId: id }))
  }
  renderParentButton () {
    const { parent } = this.state.selected
    if (parent === null || this.state.editing) return null
    return (
      <Button
        editing={false}
        opacity="1"
        onClick={(e) => {
          e.preventDefault()
          this.handleSelectNode({ id: parent.data.id })
        }}>{'<--'}</Button>
    )
  }

  renderEditButton () {
    return (
      <Button
        editing={false}
        opacity="1"
        onClick={(e) => {
          e.preventDefault()
          const newEditingState = !this.state.editing
          this.setState({ editing: newEditingState }, () => {
            if (!newEditingState) fetch(`/person/${PERSON_ID}`, {
              method: 'POST',
              body: JSON.stringify(person),
              headers: {
                'content-type': 'application/json'
              },
            }).then((res) => {
              if (res.ok) res.json().then((data) => { console.log(data) })
            })
          })
        }}>{this.state.editing ? 'dynamic' : 'static'}</Button>
    )
  }
  renderControlPanel () {
    return (
      <ControlPanel>
        {this.renderParentButton()}
        {this.renderEditButton()}
      </ControlPanel>
    )
  }

  render () {
    console.log(this.state)
    return (
      <GameContainer>
        {this.renderControlPanel()}
        <svg
          width={this.state.w}
          height={this.state.h}>
          <Motion style={{
            x: spring(this.state.selected.x * -1),
            y: spring(this.state.selected.y * -1),
            w: spring(this.state.w),
            h: spring(this.state.h),
          }}>
            {
              ({ x, y, w, h }) => (
                <Screen
                  editing={this.state.editing}
                  x={x} y={y}
                  dimensions={{
                    w: w,
                    h: h,
                  }}
                  onButtonAdd={this.handleButtonAdd}
                  onSelectNode={this.handleSelectNode}
                  onButtonChange={this.handleButtonChange}
                  onMessageChange={this.handleMessageChange}
                  onMessageAdd={this.handleMessageAdd}
                  nodes={this.state.nodes} />
              )
            }
          </Motion>
        </svg>
      </GameContainer>
    )
  }
}
module.exports = Game
