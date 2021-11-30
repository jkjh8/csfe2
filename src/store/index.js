import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// import example from './module-example'
import user from './user'
import users from './users'
import eventlog from './eventlog'
import systemlog from './systemlog'
import devices from './devices'
import preview from './preview'
import schedules from './schedules'
let Store

export default store(function (/* { ssrContext } */) {
  Store = createStore({
    modules: {
      user,
      users,
      eventlog,
      systemlog,
      devices,
      preview,
      schedules
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
