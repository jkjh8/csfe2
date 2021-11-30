export function changeView({ state, commit }) {
  if (state.viewMode === 'list') {
    commit('changeView', 'calendar')
  } else {
    commit('changeView', 'list')
  }
}
