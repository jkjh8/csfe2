export function changeView(state, payload) {
  state.viewMode = payload
}

export function updateSchedules(state, payload) {
  state.schedules = payload
}

export function updateSearch(state, payload) {
  state.search = payload
}
