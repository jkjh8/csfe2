import io from 'socket.io-client'

let address
if (process.env.DEV) {
  address = `http://${window.location.hostname}:3000`
} else {
  address = `http://${window.location.hostname}`
}

const socket = io(address)

export { socket }
