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
    const [activity, setActivity] = useState(props.activity)
    const [currentDate, setCurrentDate] = useState({startDate: props.currentDate.startDate});
    const [formatedCurrentDate, setFormatedCurrentDate] = useState('');

    useEffect(() => {
        FormatDate(props.currentDate.startDate).then(dt => setFormatedCurrentDate(dt))
    }, [props.currentDate])

    return (
        <div className='activityItem'>
            <b className='activityName'>{activity.name}</b>
            <p className='activityOther'>{formatedCurrentDate} | {formatHourMinute(activity.time)}, {activity.intensity}</p>
        </div>
    )
}

export default PratiquesItem