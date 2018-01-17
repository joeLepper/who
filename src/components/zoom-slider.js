const React = require('react')
const { Component } = React

const Button = require('./button')

class ZoomSlider extends Component {
  render () {
    return (
      <div>
      <input
        type="range"
        min={this.props.baseZoom}
        max={this.props.maxZoomX}
        value={this.props.zoomX}
        step="0.1"
        onChange={(e) => {
          const val = Math.round(e.currentTarget.value * 10) / 10
          this.props.onZoomChange({ zoom: { x: val, y: val } })
        }} />
        <span>{this.props.zoomX}</span>
      </div>
    )
  }
}
module.exports = ZoomSlider
