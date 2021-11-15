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



  useEffect(() => {
    if (reloadGraph && dataPoints.length <= 0)
      fetchDatapoints();
  }, [reloadGraph])

  function getDataFormat() {
    console.log(dateFormat)
    return dateFormat;
  }

  function setDataFormat(format) {
    if (format === "dd-LL-yyyy") dateFormat = 'DD-MM-YYYY'
    if (format === "LL-dd-yyyy") dateFormat = 'MM-DD-YYYY'
    if (format === "yyyy-dd-LL") dateFormat = 'YYYY-DD-MM'
    if (format === "yyyy-LL-dd") dateFormat = 'YYYY-MM-DD'
    if (format === "yyyy-LLL-dd") dateFormat = 'YYYY-MMM-DD'
    if (format === "dd-LLL-yyyy") dateFormat = 'DD-MMM-YYYY'
  }

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
        arr.sort((a, b) => {
          return a.x - b.x;
        });

        setData(arr)

      });
  }



  function toMmoll(dp) {
    //  mgdl / 18
    var temp = dp.slice();

    for (var i = 0; i < temp.length; i++) {
      temp[i].y = temp[i].y / 18;
    }

    return temp;
  }

  function toMgdl(dp) {
    // mmol * 18
    var temp = dp.slice();

    for (var i = 0; i < temp.length; i++) {
      temp[i].y = temp[i].y * 18;
    }

    return temp;
  }

  const dataPoints = useMemo(
    () => data.filter((val) => val.x >= startDate && val.x <= endDate),
    [data, startDate, endDate]
  );

  const [average, setAverage] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMaximum] = useState(0);

  const [averageDataPoints, setAverageDataPoint] = useState([]);
  useEffect(() => {
    if (dataPoints && dataPoints.length > 0) {

      console.log(dataPoints)

      let av = Math.round((((dataPoints.map(val => val.y)).reduce((a, b) => (a + b), 0) / dataPoints.length) + Number.EPSILON) * 100) / 100;
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

      setAverage(av)
      setMinimum(min);
      setMaximum(max);
      setAverageDataPoint([
        { x: startDate, y: av },
        { x: endDate, y: av }
      ])
      console.log(averageDataPoints)

    }
  }, [dataPoints]);

  // const averageDataPoints = [
  //     { x: new Date(2021, 6, 18), y: 8 },
  //     { x: new Date(2021, 9, 18), y: 8 }
  // ]


  function getNewStartDateForRange(range) {
    const startDateAsMoment = moment(endDate);
    switch (range) {
      case '1w': return startDateAsMoment.subtract(1, 'week').toDate();
      case '1m': return startDateAsMoment.subtract(1, 'month').toDate();
      case '3m': return startDateAsMoment.subtract(3, 'month').toDate();
      case '6m': return startDateAsMoment.subtract(6, 'month').toDate();
      case '1y': return startDateAsMoment.subtract(1, 'year').toDate();
    }
  }

  function onRangeClick(range) {
    setStartDate(getNewStartDateForRange(range));
  }

  function onStartDateChange(event) {
    setStartDate(moment(event.target.value).toDate());
  }

  function onEndDateChange(event) {
    setEndDate(moment(event.target.value).toDate());
  }

  function onUnitTypeChange(unit) {
    if (unit !== tauxLabel) {
      setTauxLabel(unit);
      if (unit === " mg/dl") {
        setData(toMgdl(data))
      } else {
        setData(toMmoll(data))
      }
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
    return (

      <div style={{ overflowX: "scroll" }}>
        <h3 style={{ color: "#c0504e" }}>{averageText}: {average} {tauxLabel}</h3>
        <h3 style={{ color: "#c0504e" }}>{lastvText}: {data[data.length - 1].y} {tauxLabel} </h3>
        <h3 style={{ color: "#c0504e" }}> {minText}: {minimum} {tauxLabel} </h3>
        <h3 style={{ color: "#c0504e" }}> {maxText}: {maximum} {tauxLabel} </h3>
        <div>
          <button class="timeFilterFirst" onClick={() => { onRangeClick("1w"); }}><h3>1{weekLetter}</h3></button>
          <button class="timeFilter" onClick={() => { onRangeClick("1m"); }}><h3>1M</h3></button>
          <button class="timeFilter" onClick={() => { onRangeClick("3m"); }}><h3>3M</h3></button>
          <button class="timeFilter" onClick={() => { onRangeClick("6m"); }}><h3>6M</h3></button>
          <button class="timeFilter" onClick={() => { onRangeClick("1y"); }}><h3>1{yearLetter}</h3></button>
        </div>
        <div>
          <button class="timeFilterFirst" onClick={() => { onUnitTypeChange(" mg/dl"); }}><h3>mg/dl</h3></button>
          <button class="timeFilter" onClick={() => { onUnitTypeChange(" mmol/L"); }}><h3>mmol/L</h3></button>
        </div>
        <div>
          <h3>
            <input type="date" value={moment(startDate).format("YYYY-MM-DD")} onChange={onStartDateChange} /> -&nbsp;
            <input type="date" value={moment(endDate).format("YYYY-MM-DD")} onChange={onEndDateChange} />
          </h3>
        </div>
        <div style={{ width: "700px" }}>
          <CanvasJSChart options={options} />
        </div>
      </div>
    );

  }



};

export default Graphe;
