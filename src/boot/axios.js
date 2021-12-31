import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Cookies, LocalStorage } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let api
if (process.env.DEV) {
  api = axios.create({
    baseURL: `http://${window.location.hostname}:3000`
  })
} else {
  api = axios.create({
    // baseURL: `http://${window.location.hostname}`
    baseURL: `http://${window.location.hostname}:3000`
  })
}
api.defaults.withCredentials = true

export default boot(({ app, router, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  function deleteToken() {
    Cookies.remove('token')
    LocalStorage.remove('refresh')
    router.push('/')
    store.commit('user/updateUser', null)
  }

  api.interceptors.request.use(
    function (config) {
      if (!config.headers.Authorization) {
        const token = Cookies.get('token')
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  api.interceptors.response.use(
    function (response) {
      return response
    },
    async function (error) {
      try {
        const original = error.config
        const refreshtoken = LocalStorage.getItem('refresh')
        if (error.response.status === 401) {
          if (original.url === 'api/auth/refresh') {
            deleteToken()
            return Promise.reject(error)
          }
          if (!original._retry && refreshtoken) {
            original._retry = true
            return api
              .get('/api/auth/refresh', {
                headers: {
                  Authorization: `Bearer ${refreshtoken}`
                }
              })
              .then((res) => {
                let tokens
                if (res.status === 200) {
                  if (res.data.token) {
                    tokens = res.data.token
                    Cookies.set('token', tokens.access)
                    LocalStorage.set('refresh', tokens.refresh)
                  }
                  if (tokens && tokens.access) {
                    original.headers.Authorization = `Bearer ${tokens.access}`
                  }
                  return api(original)
                }
              })
          }
          return Promise.reject(error)
        }
        return Promise.reject(error)
      } catch (e) {
        return Promise.reject(e)
      }
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
