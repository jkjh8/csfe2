import { useQuasar } from 'quasar'

export default function nofi() {
  const $q = useQuasar()
  function notifyInfo(message) {
    return $q.notify({
      icon: 'svguse:icons.svg#info-circle-fill',
      message: message.message,
      caption: message.caption,
      position: 'top',
      color: 'primary'
    })
  }

  function notifyError(message) {
    return $q.notify({
      icon: 'svguse:icons.svg#exclamation',
      message: message.message,
      caption: message.caption ?? '잠시후에 다시 시도해주세요',
      position: 'top',
      color: 'negative'
    })
  }
  return { notifyInfo, notifyError }
}
