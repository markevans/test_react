import React from 'react'
import treehouse from 'treehouse'
import App from './components/app'
import {Router, serializers} from 'treehouse-router'
import ReactDOM from 'react-dom'

export default () => {
  global.treehouse = treehouse

  treehouse.extendReact(React.Component.prototype)
  treehouse.registerActions(require('./actions/actions'))
  treehouse.registerFilters(require('./filters/filters'))
  treehouse.registerQueries(require('./queries/queries'))
  treehouse.registerMutators(require('./mutators/array'))

  let gridSize = 20
  let range = (size) => {
    return Array.apply(null, Array(size))
  }
  treehouse.init({
    message: "",
    users: [
      {name: 'Mark'},
      {name: 'Egg'},
      {name: 'Toast'}
    ],
    grid: range(gridSize).map((row) => {
      return range(gridSize).map(cell => 0)
    })
  })

  let serializer = {
    serialize (object) {
      return (object.first || '') + ',' + (object.second || '')
    },
    deserialize (string) {
      let parts = string.split(',')
      return {
        first: parts[0] || "",
        second: parts[1] || ""
      }
    }
  }

  global.router = new Router(treehouse, (t) => {
    return {
      first: t.at('users', 0, 'name'),
      second: t.at('users', 1, 'name')
    }
  }, serializer)

  // Render into DOM
  ReactDOM.render(<App/>, document.getElementById('app'))
}
