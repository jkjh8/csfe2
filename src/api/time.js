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
export { dateFormat, dateFormatWithWeekday, dateFormatObj }
