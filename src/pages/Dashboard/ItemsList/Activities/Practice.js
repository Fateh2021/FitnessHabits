const formatHourMinute = (time) => {
    return ((time - (time % 60)) / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + ':' + (time % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

const getPracticesFilter = (practices, currentDate) => {
    let date3MontsPrior = new Date(currentDate.getYear(), currentDate.getMonth() - 3, currentDate.getDate())
    return practices.filter((practice) => {
        let dateToFilter = new Date(practice.date)
        return dateToFilter > date3MontsPrior
    }).sort((a, b) => {
        return (new Date(b.date)) - (new Date(a.date))
    })
}

export default {formatHourMinute, getPracticesFilter}
