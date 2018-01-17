module.exports = function resize () {
  this.setState(this.updateState({
    selectedId: this.state.selectedId,
  }))
}
