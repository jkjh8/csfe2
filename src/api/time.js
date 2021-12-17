import moment from 'moment'

const dateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD hh:mm:ss')
}
const dateFormatWithWeekday = (date) => {
  return moment(date).format('YYYY-MM-DD hh:mm:ss a')
}
const dateFormatObj = (date) => {
  const rt = moment(date)
  return {
    date: rt.format('YYYY-MM-DD'),
    time: rt.format('hh:mm:ss')
  }
}
const hms = (seconds) => {
  const hour =
    parseInt(seconds / 3600) < 10
      ? '0' + parseInt(seconds / 3600)
      : parseInt(seconds / 3600)
  const min =
    parseInt((seconds % 3600) / 60) < 10
      ? '0' + parseInt((seconds % 3600) / 60)
      : parseInt((seconds % 3600) / 60)
  const sec = seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60
  return `${hour}:${min}:${sec}`
}

export { dateFormat, dateFormatWithWeekday, dateFormatObj, hms }
