const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const debounce = require('debounce')
const Screen = require('./components/screen')
const d3 = require('d3-hierarchy')
const styled = require('styled-components').default

const PERSON_ID = 'joe'
const BASE_ZOOM = 0.5

const Button = require('./components/button')
const person = require(`./people/${PERSON_ID}.json`)
const stratifier = d3.stratify().parentId((d) => {
  const parent = person.filter((node) => (
    node.children.some((child) => child === d.id)
  ))[0]
  if (parent) return parent.id
  return undefined
})

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

    this.updateState = this.updateState.bind(this)

    this.renderZoomButton = this.renderZoomButton.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
    this.renderParentButton = this.renderParentButton.bind(this)
    this.renderControlPanel = this.renderControlPanel.bind(this)

    this.handleSelectNode = this.handleSelectNode.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleButtonAdd = this.handleButtonAdd.bind(this)

    this.handleButtonChange = this.handleButtonChange.bind(this)
    this.handleButtonDelete = this.handleButtonDelete.bind(this)

    this.handleMessageAdd = this.handleMessageAdd.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)

    const initialState = this.updateState({ zoom: { x: BASE_ZOOM, y: BASE_ZOOM } })
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
  handleButtonDelete (nodeId) {
    if (confirm('Deleting this button will delete its associated page. Are you sure?')) {
      let deleteIndex
      person.forEach((node, i) => {
        if (nodeId === node.id) deleteIndex = i
      })
      person.splice(deleteIndex, 1)

      this.setState(this.updateState(this.state))
    }
  }
  handleButtonAdd (newNodeId, currentNodeId) {
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
    person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages[messageIndex] = message
        person[i] = node
      }
    })
    this.setState(this.updateState(this.state))
  }
  handleMessageDelete (nodeId, messageIndex) {
    person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages = node.messages.filter((_, i) => i !== messageIndex)
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
  updateState ({ selectId, zoom }) {
    const selectedId = selectId || (this.state && this.state.selectedId)
    const newState = {
      zoom,
      selectedId,
      w: window.innerWidth,
      h: window.innerHeight,
      maxNodeHeight: 0,
      maxNodeDepth: 0,
    }
    if (newState.zoom.x === undefined) newState.zoom = { x: BASE_ZOOM, y: BASE_ZOOM }

    const treeLayout = d3.tree().size([newState.w, newState.h])

    const tree = treeLayout(stratifier(person))

    window.treeLayout = treeLayout
    window.tree = tree
    window.d3 = d3

    const nodes = []
    tree.each((node) => {
      newState.maxNodeHeight = Math.max(node.height, newState.maxNodeHeight)
      newState.maxNodeDepth = Math.max(node.depth, newState.maxNodeDepth)
      if (selectedId && selectedId === node.data.id) {
        newState.selected = node
        newState.selectedId = node.data.id
      }
      nodes.push(node)
    })
    newState.nodes = nodes

    const links = tree.links()
    newState.links = links

    if (!newState.selected) {
      const selected = nodes.filter(({ parent }) => (
        parent === null
      ))[0]
      newState.selected = selected
      newState.selectedId = selected.data.id
    }
    return newState
  }
  handleSelectNode ({ id }) {
    const newState = Object.assign(this.state, { selectedId: id })
    this.setState(this.updateState(newState))
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
        style={{ fontSize: 16 }}
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
  renderZoomButton () {
    return (
      <Button
        editing={false}
        opacity="1"
        style={{ fontSize: 16 }}
        onClick={(e) => {
          this.setState(this.updateState({
            zoom: (this.state.zoom.x !== BASE_ZOOM) ?
              {
                x: BASE_ZOOM,
                y: BASE_ZOOM,
              } : {
                x: this.state.maxNodeHeight + 1,
                y: this.state.maxNodeDepth + 1,
              }
          }))
        }}>zoom</Button>
    )
  }
  renderControlPanel () {
    return (
      <ControlPanel>
        {this.renderParentButton()}
        {this.renderEditButton()}
        {this.renderZoomButton()}
      </ControlPanel>
    )
  }

  render () {
    return (
      <GameContainer>
        {this.renderControlPanel()}
        <svg
          width={this.state.w}
          height={this.state.h}>
          <Motion style={{
            x: spring(this.state.selected.x),
            y: spring(this.state.selected.y),
            w: spring(this.state.w),
            h: spring(this.state.h),
            zoomX: spring(this.state.zoom.x),
            zoomY: spring(this.state.zoom.y),
            maxNodeDepth: spring(this.state.maxNodeDepth),
            maxNodeHeight: spring(this.state.maxNodeHeight),
          }}>
            {
              ({ x, y, w, h, zoomX, zoomY, maxNodeDepth, maxNodeHeight }) => (
                <Screen
                  editing={this.state.editing}
                  selectedId={this.state.selected.data.id}
                  baseZoom={BASE_ZOOM}
                  zoomX={zoomX}
                  zoomY={zoomY}
                  x={x}
                  y={y}
                  w={w}
                  h={h}
                  onSelectNode={this.handleSelectNode}
                  onButtonAdd={this.handleButtonAdd}
                  onButtonChange={this.handleButtonChange}
                  onButtonDelete={this.handleButtonDelete}
                  onMessageAdd={this.handleMessageAdd}
                  onMessageChange={this.handleMessageChange}
                  onMessageDelete={this.handleMessageDelete}
                  maxNodeDepth={maxNodeDepth}
                  maxNodeHeight={maxNodeHeight}
                  links={this.state.links}
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
