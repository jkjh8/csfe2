import { api } from '@/boot/axios'
import { useRouter } from 'vue-router'
const router = useRouter()

export async function login({ commit }) {
  try {
    const r = await api.get('/api/auth/login')
    commit('updateUser', r.data.user)
  } catch (err) {
    commit('updateUser', null)
    router.push('/')
  }
}
