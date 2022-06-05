import React, {useEffect, useState} from "react";
import FormatDate from "../../../../DateUtils";

const formatHourMinute = (time) => {
    return ((time - (time % 60)) / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + ':' + (time % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

const PratiquesItem = (props) =>  {
    const [practice, setPractice] = useState(props.practice)
    const [formatedCurrentDate, setFormatedCurrentDate] = useState('');

    useEffect(() => {
        FormatDate(practice.date.startDate).then(dt => setFormatedCurrentDate(dt))
    }, [practice.date])

    return (
        <div className='activityItem'>
            <b className='activityName'>{practice.name}</b>
            <p className='activityOther'>{formatedCurrentDate} | {formatHourMinute(practice.time)}, {practice.intensity}</p>
        </div>
    )
}

export default PratiquesItem