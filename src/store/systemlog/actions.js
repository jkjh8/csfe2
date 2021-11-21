import { api } from 'src/boot/axios'

export async function getSystemlogs({ state, commit }) {
  try {
    const r = await api.get(
      `/api/systemlog?limit=${state.log.limit}&page=${state.log.page}&search=${state.search}`
    )
    commit('updateSystemlogs', r.data)
  } catch (err) {
    console.error(err)
  }
}
