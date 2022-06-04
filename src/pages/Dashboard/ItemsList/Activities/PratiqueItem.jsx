import React, {useState} from "react";

const leadingHourMinute = (time) => {
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
    const [currentDate, setCurrentDate] = useState(props.currentDate)

    return (
        <div className='activityItem'>
            <b className='activityName'>{activity.name}</b>
            <p className='activityOther'> | {leadingHourMinute(activity.time)}, {activity.intensity}</p>
        </div>
    )
}

export default PratiquesItem