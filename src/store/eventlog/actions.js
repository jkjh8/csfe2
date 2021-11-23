import { api } from '@/boot/axios'

/*
export function someAction (context) {
}
*/
export async function getEventlogs({ state, commit }) {
  try {
    const r = await api.get(
      `/api/eventlog?limit=${state.eventlog.limit}&page=${state.eventlog.page}&search=${state.search}`
    )
    commit('updateEventlogs', r.data)
  } catch (err) {
    console.error(err)
  }
}
