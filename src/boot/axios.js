import { boot } from 'quasar/wrappers'
import axios from 'axios'

// const { state } = useStore()

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let api
if (process.env.DEV) {
  api = axios.create({ baseURL: `http://${window.location.hostname}:3000` })
} else {
  api = axios.create({ baseURL: `http://${window.location.hostname}` })
}
api.defaults.withCredentials = true

export default boot(({ app, router, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  api.interceptors.request.use(
    function (config) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
      console.log(config)
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
