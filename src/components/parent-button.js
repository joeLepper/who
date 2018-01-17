const React = require('react')
const { Component } = React

const Button = require('./button')

class ParentButton extends Component {
  render () {
    const { parent } = this.props.selected
    if (parent === null || this.props.editing) return null
    return (
      <Button
        editing={false}
        opacity="1"
        onClick={(e) => {
          e.preventDefault()
          this.props.ee.emit('select-node', [{ id: parent.data.id }])
        }}>{'<--'}</Button>
    )
  }
}
module.exports = ParentButton




