export function page(state, payload) {
  state.log.page = payload
}

export function rowsPerPage(state, payload) {
  state.log.limit = payload
}

export function updateSystemlogs(state, payload) {
  state.log = payload
}

export function updateSearch(state, payload) {
  state.search = payload
}
