import { api } from '@/boot/axios'

export function changeView({ state, commit }) {
  if (state.viewMode === 'list') {
    commit('changeView', 'calendar')
  } else {
    commit('changeView', 'list')
  }
}

export async function updateSchedules({ commit }) {
  const r = await api.get('/api/broadcast/schedule')
  commit('updateSchedules', r.data)
}

export async function changeActive({ commit }, payload) {
  try {
    await api.get(
      `/api/broadcast/schedule/active?id=${
        payload.id
      }&value=${!payload.active}`
    )
    const r = await api.get('/api/broadcast/schedule')
    commit('updateSchedules', r.data)
  } catch (e) {
    console.error(e)
  }
}
