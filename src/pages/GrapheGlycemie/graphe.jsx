import React, { useEffect, useState, useMemo } from 'react';
import '../Tab1.css'
import moment from "moment";
import firebase from 'firebase'
import "firebase/auth";
import * as translate from '../../translate/Translator';

import CanvasJSReact from './canvasjs.stock.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dateFormat;

const Graphe = (reloadGraph) => {
    const today = new Date(2021, 9, 18);// Using preset date for testing
    const [data, setData] = useState([]);
    const [tauxLabel, setTauxLabel] = useState(" mmol/L"); //" mmol/L" | " mg/dl"
    const [endDate, setEndDate] = useState(today);
    const [startDate, setStartDate] = useState(() => getNewStartDateForRange('3m'));
    const averageText = translate.getText("AVERAGE");
    const sugarLevel = translate.getText("BLOOD_SUGAR_LEVEL");
    const weekLetter = translate.getText("WEEK_LETTER");
    const yearLetter = translate.getText("YEAR_LETTER");
    const minText = translate.getText("MINIMUM");
    const maxText = translate.getText("MAXIMUM");
    const lastvText = translate.getText("LAST_VALUE");
    const [average, setAverage] = useState(0);
    const [minimum, setMinimum] = useState(0);
    const [maximum, setMaximum] = useState(0);
    const [range, setRange] = useState("3m");
    const [averageDataPoints, setAverageDataPoint] = useState([]);

    //datapoint is a filtered subset of data between 2 dates
    const dataPoints = useMemo(
        () => data.filter((val) => val.x >= startDate && val.x <= endDate),
        [data, startDate, endDate]
    );

    //Get data on graphe display
    useEffect(() => {
        if (reloadGraph && dataPoints.length <= 0)
            fetchDatapoints();
    }, [reloadGraph])

    function getDataFormat() {
        return dateFormat;
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
    }

    function setDataFormat(format) {
        if (format === "dd-LL-yyyy") dateFormat = 'DD-MM-YYYY'
        if (format === "LL-dd-yyyy") dateFormat = 'MM-DD-YYYY'
        if (format === "yyyy-dd-LL") dateFormat = 'YYYY-DD-MM'
        if (format === "yyyy-LL-dd") dateFormat = 'YYYY-MM-DD'
        if (format === "yyyy-LLL-dd") dateFormat = 'YYYY-MMM-DD'
        if (format === "dd-LLL-yyyy") dateFormat = 'DD-MMM-YYYY'
    }

    function convertMesurementUnit(type, _data){
        
        _data = _data.slice();

        for (var i = 0; i < _data.length; i++) {
            if(type === "mmoll")
                //  mgdl / 18
                _data[i].y = _data[i].y / 18;

            if(type === "mgdl")
                //  mgdl / 18
                _data[i].y = _data[i].y * 18;
        }
        return _data;
    }

    useEffect(() => {
        if (dataPoints && dataPoints.length > 0) {
            let _average = Math.round((((dataPoints.map(val => val.y)).reduce((a, b) => (a + b), 0) / dataPoints.length) + Number.EPSILON) * 100) / 100;
            setAverage(_average)

            // minimum
            let min = Math.min.apply(
                Math,
                dataPoints.map(function (o) {
                    return o.y;
                })
            );
            // maximum
            let max = Math.max.apply(
                Math,
                dataPoints.map(function (o) {
                    return o.y;
                })
            );

            setMinimum(min);
            setMaximum(max);
            setAverageDataPoint([
                { x: startDate, y: _average },
                { x: endDate, y: _average }
            ])
        }
    }, [dataPoints]);

    // const averageDataPoints = [
    //     { x: new Date(2021, 6, 18), y: 8 },
    //     { x: new Date(2021, 9, 18), y: 8 }
    // ]


    function getNewStartDateForRange(range) {
        const startDateAsMoment = moment(endDate);
        switch (range) {
            case '1w': return startDateAsMoment.subtract(1, 'week').toDate()
            case '1m': return startDateAsMoment.subtract(1, 'month').toDate()
            case '3m': return startDateAsMoment.subtract(3, 'month').toDate()
            case '6m': return startDateAsMoment.subtract(6, 'month').toDate()
            case '1y': return startDateAsMoment.subtract(1, 'year').toDate()
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

    function onUnitTypeChange(unit) {
        if (unit !== tauxLabel) {
            setTauxLabel(unit);
            let type = unit === " mg/dl" ? "mgdl" : "mmoll"
            convertMesurementUnit(type, data)
        }
    }


    if (!dataPoints || dataPoints.length <= 0 || !averageDataPoints || averageDataPoints.length <= 0) {
        return (
            <>
                Loading...
            </>
        );
    } else {
        const options = {
            animationEnabled: true,
            // title: {
            //     text: "glycemie"
            // },
            axisX: {
                valueFormatString: getDataFormat()
            },
            axisY: {
                title: sugarLevel,
                suffix: tauxLabel
            },
            data: [
                {
                    yValueFormatString: "##",
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

        let graphWidth = window.innerWidth < 700 ? window.innerWidth * 2 : window.innerWidth

        let selectedButtonClass  = "bg-red color-white";
        let buttonClass = "bg-white color-black"

        return (

            <div style={{ overflowX: "scroll" }}>
                <div id="box1">
                    <div style={{ color: "#c0504e" }}>{lastvText}: {data[data.length - 1].y} {tauxLabel} </div>
                    <div style={{ color: "#c0504e" }}>{averageText}: {average} {tauxLabel}</div>
                </div>
                <div id="box2">
                    <div style={{ color: "#c0504e" }}> {minText}: {minimum} {tauxLabel} </div>
                    <div style={{ color: "#c0504e" }}> {maxText}: {maximum} {tauxLabel} </div>
                </div>

                <div>
                    <button class={(range==="1w"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onRangeClick("1w"); }}><h3>1{weekLetter}</h3></button>
                    <button class={(range==="1m"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onRangeClick("1m"); }}><h3>1M</h3></button>
                    <button class={(range==="3m"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onRangeClick("3m"); }}><h3>3M</h3></button>
                    <button class={(range==="6m"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onRangeClick("6m"); }}><h3>6M</h3></button>
                    <button class={(range==="1y"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onRangeClick("1y"); }}><h3>1{yearLetter}</h3></button>
                </div>
                <div>
                    <button class={(tauxLabel===" mg/dl"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onUnitTypeChange(" mg/dl"); }}><h3>mg/dl</h3></button>
                    <button class={(tauxLabel===" mmol/L"?"selectedGraphButton":"") + " graphButton"} onClick={() => { onUnitTypeChange(" mmol/L"); }}><h3>mmol/L</h3></button>
                </div>
                <div>
                    <h3>
                        <input type="date" value={moment(startDate).format("YYYY-MM-DD")} onChange={onStartDateChange} /> -&nbsp;
                        <input type="date" value={moment(endDate).format("YYYY-MM-DD")} onChange={onEndDateChange} />
                    </h3>
                </div>
                <div style={{ width: graphWidth }}>
                    <CanvasJSChart options={options} />
                </div>
            </div>
        );

    }

};

export default Graphe;
