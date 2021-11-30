export function open(state) {
  state.dialog = true
}

export function updateDialog(state, payload) {
  state.dialog = payload
}

export function updateFile(state, payload) {
  state.file = payload
}
