/*
  Change the format of an integer to hours and minutes (HH:MM).
*/
const formatHourMinute = (time) => {
    return ((time - (time % 60)) / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + ':' + (time % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

/*
  Return a list of practices created within the last three months.
*/
const getPracticesFilter = (practices, currentDate) => {
    let date3MontsPrior = new Date(currentDate.getYear(), currentDate.getMonth() - 3, currentDate.getDate())
    return practices.filter((practice) => {
        let dateToFilter = new Date(practice.date)
        return dateToFilter > date3MontsPrior
    }).sort((a, b) => {
        return (new Date(b.date)) - (new Date(a.date))
    })
}

const getCurrentMinDate = () => {
    let currentDate = new Date()
    let offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - (offset * 60 * 1000))
    currentDate = currentDate.toISOString().split('T')[0]

    let minDate = new Date()
    minDate.setMonth(minDate.getMonth() - 3)
    let offsetMinDate = minDate.getTimezoneOffset()
    minDate = new Date(minDate.getTime() - (offset * 60 * 1000))
    minDate = minDate.toISOString().split('T')[0]
    return [currentDate, minDate]
}

export default {formatHourMinute, getPracticesFilter, getCurrentMinDate}
