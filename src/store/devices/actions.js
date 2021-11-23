import { api } from '@/boot/axios'

export async function getDevices({ state, commit }) {
  try {
    const r = await api.get(`/api/devices?search=${state.search}`)
    commit('updateDevices', r.data)
  } catch (err) {
    console.error(err)
  }
}
