import { api } from '@/boot/axios'
export async function updateUsers({ commit }) {
  try {
    const r = await api.get('/api/users')
    commit('updateUsers', r.data.users)
  } catch (err) {
    console.error(err)
  }
}
