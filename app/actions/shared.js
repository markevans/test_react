import i from 'immutable'

export default {

  init (state, payload, commit) {
    state.setAndCommit(i.fromJS({
      message: "Change me",
      users: [
        {name: 'Mark'},
        {name: 'Egg'},
        {name: 'Toast'}
      ],
      preferences: {
        network: {
          timestamp: Date()
        }
      }
    }))
  },

  changeMessage (state, {text}, commit) {
    state.setAndCommit('message', text)
  },

  changeName (state, {user, name}, commit) {
    user.setAndCommit('name', name)
  },

}
