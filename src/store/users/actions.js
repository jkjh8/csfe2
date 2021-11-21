import { api } from '@/boot/axios'

export async function updateUsers({ commit }) {
  const r = await api.get('/api/users')
  commit('updateUsers', r.data.users)
}
