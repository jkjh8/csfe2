import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'
import { Notify, Loading } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
let Router
export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr'
        ? void 0
        : process.env.VUE_ROUTER_BASE
    )
  })
  Router.beforeEach(async (to, from, next) => {
    try {
      if (
        to.fullPath === '/' ||
        to.fullPath === '/login' ||
        to.fullPath === '/register'
      )
        return next()
      Loading.show()
      await store.dispatch('user/login')
      Loading.hide()
      if (store.state.user.user) {
        next()
      } else {
        Notify.create({
          icon: 'svguse:icons.svg#exclamation',
          message: '사용자가 로그인 하지 않았습니다',
          caption: '사용을 위해서 먼저 로그인 해주세요',
          position: 'top',
          color: 'negative',
          textColor: 'white',
          actions: [
            {
              icon: 'close',
              round: true,
              size: 'sm',
              color: 'white',
              handler: () => {}
            }
          ]
        })
        return next('/login')
      }
    } catch (e) {
      Loading.hide()
      Notify.create({
        icon: 'svguse:icons.svg#exclamation',
        message: '사용자가 로그인 하지 않았습니다',
        caption: '사용을 위해서 먼저 로그인 해주세요',
        position: 'top',
        color: 'negative',
        textColor: 'white',
        actions: [
          {
            icon: 'close',
            round: true,
            size: 'sm',
            color: 'white',
            handler: () => {}
          }
        ]
      })
      console.error(e.message)
      return next('/login')
    }
  })

  return Router
})

export { Router }
