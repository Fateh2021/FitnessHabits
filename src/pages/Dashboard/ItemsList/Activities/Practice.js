const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
        (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
}

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
    }).sort(function (a, b) {
        let d1 = new Date(a.date)
        let d2 = new Date(b.date)
        if (d1.getUTCDate() === d2.getUTCDate()) {
            return a.id - b.id
        }
        else {
            return d2 - d1
        }
    })
}

export default {accor, formatHourMinute, getPracticesFilter}
