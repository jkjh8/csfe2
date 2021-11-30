export function openPreview({ commit }, payload) {
  commit('updateFile', payload)
  commit('open')
}
