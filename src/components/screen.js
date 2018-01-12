const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const ConversationNode = require('./conversation-node')
const GraphicalNode = require('./graphical-node')
const styled = require('styled-components').default
const d3 = require('d3-shape')
const { path } = require('d3-path')

const Path = styled.path`
  stroke: #099;
  stroke-width: 1px;
  stroke-linecap: round;
  fill: none;
`

class Screen extends Component {
  generateLink ({ source, target }) {
    const p = path()

    p.moveTo(source.x, source.y)
    p.bezierCurveTo(
      source.x, target.y,
      target.x, source.y,
      target.x, target.y
    )
    p.bezierCurveTo(
      target.x, source.y,
      source.x, target.y,
      source.x, source.y
    )
    p.closePath()
    return p.toString()
  }
  render () {
    const { x, y, w, h, zoomX, zoomY, maxNodeDepth, maxNodeHeight, baseZoom } = this.props

    const zoomDeltaX = maxNodeHeight - baseZoom
    const zoomDetlaRatioX = ((maxNodeHeight - zoomX) / zoomDeltaX)
    const zoomDriftX = (((w / 2) * zoomX) - (w / 2)) * zoomDetlaRatioX

    const zoomDeltaY = maxNodeDepth - baseZoom
    const zoomDetlaRatioY = ((maxNodeDepth - zoomY) / zoomDeltaY)
    const zoomDriftY = (((h / 2) * zoomY) - (h / 2)) * zoomDetlaRatioY

    const transX = (x * zoomX * -1) + (w / 2)
    const transY = (y * zoomY * -1) + (h / 2)
    console.log(transX, transY)

    const conversationNodes = this.props.nodes.filter((n) => (
      n.data.id === this.props.selectedId
    )).map((n, i) => {
      return (
        <ConversationNode
          editing={this.props.editing}
          onSelectNode={this.props.onSelectNode}
          onButtonChange={this.props.onButtonChange}
          onButtonDelete={this.props.onButtonDelete}
          onButtonAdd={this.props.onButtonAdd}
          onMessageDelete={this.props.onMessageDelete}
          onMessageChange={this.props.onMessageChange}
          onMessageAdd={this.props.onMessageAdd}
          zoomX={this.props.zoomX}
          zoomY={this.props.zoomY}
          key={`conversation-${i}`}
          node={n}
          w={w}
          h={h} />
      )
    })
    const graphicalNodes = this.props.nodes.map((n, i) => (
      <GraphicalNode key={`graphical-${i}`} node={n} w={w} h={h} />
    ))
    const links = this.props.links.map((l, i) => {
      return (
        <Path d={this.generateLink(l)} key={i}/>
      )
    })

    return (
      <g>
        <g
          className="ScreenTranslater"
          transform={`translate(${transX}, ${transY})`}>
          <g
            className="ScreenScaler"
            transform={`scale(${this.props.zoomX}, ${this.props.zoomY})`}>
            <g className="Links">{links}</g>
            <g className="GraphicalNodes">{graphicalNodes}</g>
          </g>
        </g>
        <g className="ConversationNodes">{conversationNodes}</g>
      </g>
    )
  }
}
module.exports = Screen
