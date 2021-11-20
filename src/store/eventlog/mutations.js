export function page(state, payload) {
  state.eventlog.page = payload
}

export function rowsPerPage(state, payload) {
  state.eventlog.limit = payload
}

export function updateEventlogs(state, payload) {
  state.eventlog = payload
}
