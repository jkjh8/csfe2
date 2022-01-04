import { api } from '@/boot/axios'
export async function updatePlaylist({ state, commit }) {
  const r = await api.get('/api/playlist')
  commit('updatePlaylist', r.data)
  if (state.selected && state.selected._id) {
    r.data.forEach((item) => {
      if (item._id === state.selected._id) {
        commit('updateSelected', item)
      }
    })
  }
}
