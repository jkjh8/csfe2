import { api } from '@/boot/axios'

export async function login({ commit }) {
  try {
    const r = await api.get('/api/auth/login')
    commit('updateUser', r.data.user)
  } catch (err) {
    commit('updateUser', null)
  }
}
