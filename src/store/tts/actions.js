export function updateInfo({ commit }, payload) {
  commit('updateRate', payload.rate)
  commit('updateVoices', payload.voices)
}
