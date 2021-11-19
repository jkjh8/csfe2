import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// import example from './module-example'
import user from './user'
import users from './users'

let Store

export default store(function (/* { ssrContext } */) {
  Store = createStore({
    modules: {
      user,
      users
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
