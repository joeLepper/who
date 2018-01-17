const React = require('react')
const { Component } = React

const styled = require('styled-components').default

const EditButton = require('./edit-button')
const ZoomSlider = require('./zoom-slider')

const Panel = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 5vh;
`
class ControlPanel extends Component {
  render () {
      return (
        <Panel>
          <EditButton
            editing={this.props.editing}
            personId={this.props.personId}
            person={this.props.person}
            onEditChange={this.props.onEditChange}
            />
          <ZoomSlider
            baseZoom={this.props.baseZoom}
            zoomX={this.props.zoom.x}
            zoomY={this.props.zoom.y}
            maxZoomX={this.props.maxZoomX}
            maxZoomY={this.props.maxZoomY}
            onZoomChange={this.props.onZoomChange}/>
        </Panel>
      )
    }

}
module.exports = ControlPanel






