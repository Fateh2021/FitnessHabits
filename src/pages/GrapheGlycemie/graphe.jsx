import React, { useEffect, useState, useMemo } from 'react';
import '../Tab1.css'
import moment from "moment";
import firebase from 'firebase'
import "firebase/auth";
import * as translate from '../../translate/Translator';

import CanvasJSReact from './canvasjs.stock.react';
let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let dateFormat;

//enum equivalents
const Taux = Object.freeze({
    mmoll: ' mmol/L',
    mgdl: ' mg/dl'
})

const DateRange = Object.freeze({
    _1w: '1' + translate.getText("WEEK_LETTER"),
    _1m: '1m',
    _3m: '3m',
    _6m: '6m',
    _1y: '1' + translate.getText("YEAR_LETTER")
})



const Graphe = (reloadGraph) => {
    const [data, setData] = useState([]);
    const [tauxLabel, setTauxLabel] = useState(Taux.mmoll);
    const [taux, setTaux] = useState(Taux.mmoll);
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(() => getNewStartDateForRange(DateRange._3m));
    const [average, setAverage] = useState(0);
    const [minimum, setMinimum] = useState(0);
    const [maximum, setMaximum] = useState(0);
    const [loading, setLoading] = useState(true);
    //used to keep track of button style
    const [range, setRange] = useState(DateRange._3m);
    //Used to display average line on graphe *---*
    const [averageDataPoints, setAverageDataPoint] = useState([]);

    //datapoint is a filtered subset of data between 2 dates
    const dataPoints = useMemo(
        () => convertMesurementUnit(taux, tauxLabel, data.filter((val) => val.x >= startDate && val.x <= endDate)),
        [data, startDate, endDate, tauxLabel, taux]
    );

    //Get data on graphe display
    useEffect(() => {
        if (reloadGraph && dataPoints.length <= 0)
            fetchDatapoints();
    }, [reloadGraph])

    function getDataFormat() {
        return dateFormat;
    }

    function convertMesurementUnit(currentType, newType, _data) {
        const copy = [..._data]

        for (var i = 0; i < _data.length; i++) {
            if (newType === Taux.mmoll && currentType === Taux.mgdl) {
                copy[i].y = copy[i].y * 18; //  mmol/L = mg/dl * 18
                setTaux(newType)
            }

            if (newType === Taux.mgdl && currentType === Taux.mmoll) {
                copy[i].y = copy[i].y / 18; //  mg/dl = mmol/L / 18
                setTaux(newType)
            }
        }

        return copy;
    }

    //Get glycemie data from Firebase using userUID from localstorage
    function fetchDatapoints() {
        const userUID = localStorage.getItem('userUid');
        var arr = [];
        firebase.database().ref('profiles/' + userUID + '/dateFormat/').once("value", (snapshot) => {
            setDataFormat(snapshot.val());
        })
        firebase.database().ref('dashboard/' + userUID)
            .once("value", (snapshot) => {
                const sets = snapshot.val();
                if (sets) {
                    var index = 0;
                    for (const key in sets) {
                        arr[index] = { x: moment(key, "DDMMYYYY").toDate(), y: parseInt(sets[key].glycemie.dailyGlycemie) }
                        index++
                    }
                }
                //Sorting data by datetime
                arr.sort((a, b) => {
                    return a.x - b.x;
                });
                setData(arr)
            });
        setLoading(false)
    }

    function setDataFormat(format) {
        if (format === "dd-LL-yyyy") dateFormat = 'DD-MM-YYYY'
        if (format === "LL-dd-yyyy") dateFormat = 'MM-DD-YYYY'
        if (format === "yyyy-dd-LL") dateFormat = 'YYYY-DD-MM'
        if (format === "yyyy-LL-dd") dateFormat = 'YYYY-MM-DD'
        if (format === "yyyy-LLL-dd") dateFormat = 'YYYY-MMM-DD'
        if (format === "dd-LLL-yyyy") dateFormat = 'DD-MMM-YYYY'
    }

    useEffect(() => {
        if (dataPoints && dataPoints.length > 0) {
            let sum = (dataPoints.map(val => val.y)).reduce((a, b) => (a + b), 0)
            let _average = Math.round(((sum / dataPoints.length) + Number.EPSILON) * 100) / 100;
            setAverage(_average)
            setAverageDataPoint([
                { x: startDate, y: _average },
                { x: endDate, y: _average }
            ])

            // minimum
            let min = Math.round(
                (Math.min.apply(
                    Math,
                    dataPoints.map(function (o) {
                        return o.y;
                    })
                ) + Number.EPSILON) * 100) / 100;
            console.log(min)
            setMinimum(min);

            // maximum
            let max = Math.round(
                (Math.max.apply(
                    Math,
                    dataPoints.map(function (o) {
                        return o.y;
                    })
                ) + Number.EPSILON) * 100) / 100;
            setMaximum(max);
        }
    }, [dataPoints]);


    function getNewStartDateForRange(range) {
        const startDateAsMoment = moment(endDate);
        switch (range) {
            case DateRange._1w: return startDateAsMoment.subtract(1, 'week').toDate()
            case DateRange._1m: return startDateAsMoment.subtract(1, 'month').toDate()
            case DateRange._3m: return startDateAsMoment.subtract(3, 'month').toDate()
            case DateRange._6m: return startDateAsMoment.subtract(6, 'month').toDate()
            case DateRange._1y: return startDateAsMoment.subtract(1, 'year').toDate()
        }
    }

    function onRangeClick(range) {
        setRange(range)
        setStartDate(getNewStartDateForRange(range))
    }

    function onStartDateChange(event) {
        setStartDate(moment(event.target.value).toDate())
    }

    function onEndDateChange(event) {
        setEndDate(moment(event.target.value).toDate())
    }

    function getOptions() {
        return {
            animationEnabled: true,
            // title: {
            //     text: "glycemie"
            // },
            axisX: {
                valueFormatString: getDataFormat()
            },
            axisY: {
                title: translate.getText("BLOOD_SUGAR_LEVEL"),
                suffix: tauxLabel
            },
            data: [
                {
                    yValueFormatString: "#0.##",
                    xValueFormatString: getDataFormat(),
                    type: "spline",
                    dataPoints: dataPoints
                },
                {
                    type: "line",
                    dataPoints: averageDataPoints
                }
            ]
        };
    }

    let graphWidth = window.innerWidth < 700 ? window.innerWidth * 2 : window.innerWidth
    let tableLeftColStyle = {textAlign: 'right', paddingRight: '10px'}
    let tableMidColStyle = {textAlign: 'right', paddingRight: '5px'}

    return (

        <div style={{ overflowX: "scroll" }}>
            <div>
                {Object.values(DateRange).map(val => {
                    return (
                        <button class={(range === val ? "selectedGraphButton" : "") + " graphButton"}
                            onClick={() => { onRangeClick(val); }}>
                            <h3>{val}</h3>
                        </button>
                    )
                })}
            </div>
            <div>
                <button class={(tauxLabel === " mg/dl" ? "selectedGraphButton" : "") + " graphButton"} onClick={() => { setTauxLabel(Taux.mgdl); }}><h3>mg/dl</h3></button>
                <button class={(tauxLabel === " mmol/L" ? "selectedGraphButton" : "") + " graphButton"} onClick={() => { setTauxLabel(Taux.mmoll); }}><h3>mmol/L</h3></button>
            </div>
            <div>
                <h3>
                    <input type="date" value={moment(startDate).format("YYYY-MM-DD")} onChange={onStartDateChange} /> -&nbsp;
                    <input type="date" value={moment(endDate).format("YYYY-MM-DD")} onChange={onEndDateChange} />
                </h3>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : !dataPoints || dataPoints.length <= 0 || !averageDataPoints || averageDataPoints.length <= 0 ? (
                <div>No data found</div>
            ) : (
                <>
                    <table>
                        <tbody style={{ color: "#c0504e" }}>
                            <tr>
                                <td style={tableLeftColStyle}>{translate.getText("LAST_VALUE")}:&nbsp;</td>
                                <td style={tableMidColStyle}>{Math.round(((data[data.length - 1].y) + Number.EPSILON) * 100) / 100}</td>
                                <td>{tauxLabel}</td>
                            </tr>
                            <tr>
                                <td style={tableLeftColStyle}>{translate.getText("AVERAGE")}:&nbsp;</td>
                                <td style={tableMidColStyle}>{average}</td>
                                <td>{tauxLabel}</td>
                            </tr>
                            <tr>
                                <td style={tableLeftColStyle}>{translate.getText("MINIMUM")}:&nbsp;</td>
                                <td style={tableMidColStyle}>{minimum}</td>
                                <td>{tauxLabel}</td>
                            </tr>
                            <tr>
                                <td style={tableLeftColStyle}>{translate.getText("MAXIMUM")}:&nbsp;</td>
                                <td style={tableMidColStyle}>{maximum}</td>
                                <td>{tauxLabel}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ width: graphWidth }}>
                        <CanvasJSChart options={getOptions()} />
                    </div>
                </>
            )}
        </div >
    )

};

export default Graphe;
