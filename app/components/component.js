require('../polyfill')
import React from 'react'

let state, actions, dirtyTracker

let areEqual = (var1, var2) => {
  if ( var1.equals ) {
    return var1.equals(var2)
  } else {
    return var1 == var2
  }
}

// assumes objects are the same length
let elementsAreEqual = (obj1, obj2) => {
  let key
  for ( key in obj1 ) {
    if ( !areEqual(obj1[key], obj2[key]) ) {
      return false
    }
  }
  return true
}

let component = (spec) => {
  return React.createClass(Object.assign({

    stateCursors: {},

    appStateCursors () {
      var key, path, cursors = {}
      for ( key in this.stateCursors ) {
        path = this.stateCursors[key]
        cursors[key] = state.at(path)
      }
      return cursors
    },

    appStateData () {
      let key, data = {}
      for (key in this.cursors) {
        data[key] = this.cursors[key].get()
      }
      return data
    },

    componentWillMount () {
      this.cursors = this.appStateCursors()
      this.currentAppStateData = this.appStateData()
      this.subscribeToState()
    },

    shouldComponentUpdate (nextProps, nextState) {
      return !elementsAreEqual(this.state, nextState) ||
        !elementsAreEqual(this.props, nextProps) ||
        !elementsAreEqual(this.currentAppStateData, this.appStateData())
    },

    componentWillUpdate () {
      this.currentAppStateData = this.appStateData()
      console.log('Updating', this.componentName, this._reactInternalInstance._rootNodeID)
    },

    componentDidUpdate () {
      dirtyTracker.remove(this)
    },

    componentWillUnmount () {
      this.unsubscribeToState()
      dirtyTracker.remove(this)
    },

    subscribeToState () {
      this.subscriptions = []
      var key, path
      for ( key in this.stateCursors ) {
        path = this.stateCursors[key]
        state.onUpdate(path, () => {
          dirtyTracker.add(this)
        })
      }
    },

    unsubscribeToState () {
      this.subscriptions.forEach(s => s.unsubscribe())
    },

    //--------------------------------------------------

    action (name, payload) {
      actions.call(name, payload)
    }

  }, spec))
}

component.setAppState = (s) => { state = s }
component.setActions = (a) => { actions = a }
component.setDirtyTracker = (d) => { dirtyTracker = d }

export default component
