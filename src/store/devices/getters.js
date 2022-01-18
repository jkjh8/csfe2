import { useStore } from 'vuex'
const store = useStore()

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

export function parents(state, getters, rootState, rootGetters) {
  const parents = []
  if (state.devices.length) {
    state.devices.forEach((device) => {
      if (device.mode === 'Master') {
        if (rootState.user.user.admin) {
          parents.push(device)
        } else {
          const children = []
          if (device.children && device.children.length) {
            device.children.forEach((child) => {
              const disabled = !rootState.user.user.auth.includes(
                child._id
              )
              children.push({
                _id: child._id,
                index: child.index,
                name: child.name,
                mode: child.mode,
                channel: child.channel,
                ipaddress: child.ipaddress,
                status: child.status,
                disabled: disabled
              })
            })
            parents.push({
              _id: device._id,
              index: device.index,
              name: device.name,
              mode: device.mode,
              ipaddress: device.ipaddress,
              channels: device.channels,
              active: device.active,
              mute: device.mute,
              gain: device.gain,
              status: device.status,
              children: children
            })
          } else {
            const disabled = !rootState.user.user.auth.includes(
              device._id
            )
            parents.push({
              _id: device._id,
              index: device.index,
              name: device.name,
              mode: device.mode,
              ipaddress: device.ipaddress,
              channels: device.channels,
              active: device.active,
              mute: device.mute,
              gain: device.gain,
              status: device.status,
              disabled: disabled
            })
          }
        }
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
        childrens.push(device)
      }
    })
  }
  return childrens
}

export function childrenSelected(state) {
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

export function actives(state) {
  const actives = 0
  if (state.devices.length) {
    state.devices.forEach((device) => {
      if (device.mode === 'Master') {
        if (device.activeCount) {
          actives += device.activeCount
        }
      }
    })
  }
  return actives
}
