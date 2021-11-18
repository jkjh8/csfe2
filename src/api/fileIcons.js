export default function (type) {
  let rt = {}
  switch (type) {
    case 'directory':
      rt = { icon: 'svguse:icons.svg#folder-fill', color: 'yellow' }
      break
    case 'audio':
      rt = { icon: 'svguse:icons.svg#music-note-fill', color: 'purple' }
      break
    case 'video':
      rt = { icon: 'svguse:icons.svg#video-camera-fill', color: 'cyan' }
      break
    default:
      rt = { icon: 'svguse:icons.svg#file', color: 'grey' }
  }
  return rt
}
