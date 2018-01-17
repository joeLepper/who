const Route = require('route-parser')
const route = new Route('/person/:id/node/:nodeId')

module.exports = function (ee) {
  function read () {
    return route.match(location.pathname)
  }
  function update (nodeId, title) {
    const { id } = read()
    history.pushState({ nodeId, title }, title, `/person/${id}/node/${nodeId}`)
  }
  window.onpopstate = function (e) {
    console.log(e)
    const { nodeId } =read()
    ee.emit('select-node', [{ id: nodeId }, false])
  }
  return { update, read }
}
