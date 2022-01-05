import { useQuasar } from 'quasar'

export default function nofi() {
  const $q = useQuasar()
  function notifyInfo(message) {
    return $q.notify({
      icon: 'svguse:icons.svg#info-circle-fill',
      message: message.message,
      caption: message.caption,
      position: 'top',
      color: 'primary',
      actions: [
        {
          icon: 'close',
          round: true,
          size: 'sm',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }

  function notifyWarn(message) {
    return $q.notify({
      icon: 'svguse:icons.svg#info-circle-fill',
      message: message.message,
      caption: message.caption,
      position: 'top',
      color: 'orange',
      actions: [
        {
          icon: 'close',
          round: true,
          size: 'sm',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }

  function notifyError(message) {
    return $q.notify({
      icon: 'svguse:icons.svg#exclamation',
      message: message.message,
      caption: message.caption ?? '',
      position: 'top',
      color: 'negative',
      textColor: 'white',
      actions: [
        {
          icon: 'close',
          round: true,
          size: 'sm',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }
  return { notifyInfo, notifyError, notifyWarn }
}
