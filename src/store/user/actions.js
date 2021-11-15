import { api } from '@/boot/axios'

export async function login({ commit }) {
  const r = await api.get('/api/auth/login')
  commit('updateUser', r.data.user)
}
