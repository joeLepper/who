const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const debounce = require('debounce')
const Screen = require('./components/screen')
const styled = require('styled-components').default
const ee = require('nee')()

const Person = require('./person')
const Handle = require('./handle')

const PERSON_ID = 'yaml'
const BASE_ZOOM = 0.5

const Button = require('./components/button')
const ControlPanel = require('./components/control-panel')

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width:100vw;
  height:100vh;
  overflow: none;
  font-family: arial;
`
class Game extends Component {
  constructor () {
    super(...arguments)

    this.person = new Person({
      personId: PERSON_ID,
      baseZoom: BASE_ZOOM,
      ee: ee,
    })
    this.updateState = this.person.update.bind(this.person)
    this.handle = new Handle({
      person: this.person,
    })

    console.log(this.person)
    window.person = this.person

    this.handleResize = this.handle.resize.bind(this)
    this.handleLinkAdd = this.handle.linkAdd.bind(this)
    this.handleButtonAdd = this.handle.buttonAdd.bind(this)
    this.handleButtonChange = this.handle.buttonChange.bind(this)
    this.handleButtonDelete = this.handle.buttonDelete.bind(this)
    this.handleMessageAdd = this.handle.messageAdd.bind(this)
    this.handleMessageChange = this.handle.messageChange.bind(this)
    this.handleMessageDelete = this.handle.messageDelete.bind(this)
    this.handleEditChange = this.handle.editChange.bind(this)

    const initialState = this.updateState({ zoom: { x: BASE_ZOOM, y: BASE_ZOOM } })
    initialState.editing = false

    this.state = initialState
  }
  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    ee.on('select-node', ({ id }, updatePath) => {
      console.log(id)
      const newState = Object.assign(this.state, { selectedId: id })
      this.setState(this.updateState(newState, updatePath))
    })
  }
  render () {
    return (
      <GameContainer>
        <ControlPanel
          editing={this.state.editing}
          selected={this.state.selected}
          ee={ee}
          personId={PERSON_ID}
          person={this.person}
          onEditChange={this.handleEditChange}
          baseZoom={BASE_ZOOM}
          zoom={this.state.zoom}
          maxZoomX={this.state.maxNodeHeight}
          maxZoomY={this.state.maxNodeDepth}
          onZoomChange={({ zoom }) => {
            this.setState(this.updateState({ zoom }))
          }}
          />
        <Motion style={{
          x: spring(this.state.selected.x),
          y: spring(this.state.selected.y),
          w: spring(this.state.w),
          h: spring(this.state.h),
          zoomX: spring(this.state.zoom.x),
          zoomY: spring(this.state.zoom.y),
          maxZoomX: spring(this.state.maxNodeHeight),
          maxZoomY: spring(this.state.maxNodeDepth),
        }}>
          {
            ({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY }) => (
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
                ee={ee}
                onLinkAdd={this.handleLinkAdd}
                onButtonAdd={this.handleButtonAdd}
                onButtonChange={this.handleButtonChange}
                onButtonDelete={this.handleButtonDelete}
                onMessageAdd={this.handleMessageAdd}
                onMessageChange={this.handleMessageChange}
                onMessageDelete={this.handleMessageDelete}
                maxZoomX={maxZoomX}
                maxZoomY={maxZoomY}
                links={this.state.links}
                additionalLinks={this.state.additionalLinks}
                nodes={this.state.nodes} />
            )
          }
        </Motion>
      </GameContainer>
    )
  }
}
module.exports = Game
