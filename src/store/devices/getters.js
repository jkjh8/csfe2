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

export function parents(state) {
  const parents = []
  if (state.devices.length) {
    state.devices.forEach((device) => {
      if (device.mode === 'Master') {
        parents.push(device)
      }
    })
  }
  return parents
}

export function childrens(state) {
  const childrens = []
  if (state.devices.length) {
    state.devices.forEach((device) => {
      if (device.mode === 'Slave') {
        if (state.selected) {
          if (device.parent._id === state.selected._id) {
            childrens.push(device)
          }
        } else {
          childrens.push(device)
        }
      }
    })
  }
  return childrens
}
