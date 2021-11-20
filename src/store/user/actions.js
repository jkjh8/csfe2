import { api } from '@/boot/axios'
import VueCookie from 'vue-cookie'

export async function login({ commit }) {
  try {
    const access = VueCookie.get('token')
    const refresh = localStorage.getItem('refresh')
    if (access || refresh) {
      const r = await api.get('/api/auth/login')
      commit('updateUser', r.data.user)
    }
  } catch (err) {
    commit('updateUser', null)
  }
}
