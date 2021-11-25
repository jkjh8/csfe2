export function deviceCount(state) {
  return state.devices.length
}

export function error(state) {
  const errorDevice = []
  if (state.devices.length) {
    state.devices.forEach((device) => {
      if (!device.status) {
        errorDevice.push(device)
      }
    })
  }
  return errorDevice.length
}

export function getMasters(state) {
  const masters = []
  if (state.devices.length) {
    state.devices.forEach((device) => {
      if (device.mode === 'Master') {
        masters.push(device)
      }
    })
  }
  return masters
}
