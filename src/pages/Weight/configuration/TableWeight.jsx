import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react"
import { IonLabel, IonSegment, IonSegmentButton} from "@ionic/react";
import "../../../pages/weight.css";
import * as weightService from "../../Weight/configuration/weightService"
import * as translate from "../../../translate/Translator";

// Variables in Firebase remains in French for now with a translation in comment
const TableWeight = (props) => {
  const [dateInterval, setDateInterval] = useState({start:7, end:new Date()})
  const [data, setData] = useState({datasets: []});
  const [options, setOptions] = useState();

  const plugins = [{
    afterDraw: chart => {
        var ctx = chart.chart.ctx;
        var xAxis = chart.scales['x-axis-0'];
        var yAxis = chart.scales['y-axis-0'];
        var x = xAxis.getPixelForValue(props.targetWeightDate)
        ctx.save();
        ctx.strokeStyle = '#37F52E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, yAxis.bottom);
        ctx.lineTo(x, yAxis.top);
        ctx.stroke();
        ctx.restore();
    }
  }]

  useEffect(() => {
    let startDate = new Date(dateInterval.end);
    let endDate = dateInterval.end
    if(dateInterval.start < 0) {
      startDate.setDate(startDate.getDate() - -dateInterval.start);
    } else {
      startDate.setDate(startDate.getDate() - dateInterval.start);
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let weightIni = weightService.formatWeight(props.initialWeight)
    let weightCib = weightService.formatWeight(props.targetWeight)
    let dataWeightInitial = [{x: startDate, y: weightIni},{x: endDate, y: weightIni}]
    let dataWeightTarget = [{x: startDate, y: weightCib},{x: endDate, y: weightCib}]

    const dataInit = {
      datasets: [
      {
          label: translate.getText("WEIGHT_PREF_WEIGHT_INITIAL"),
          data: dataWeightInitial,
          fill: false,
          borderColor: "#F45650",
          backgroundColor: "#F45650",
          pointRadius: 0
      },
      {
          label: translate.getText("WEIGHT_NAME_SECTION"),
          data: props.graphData,
          fill: false,
          borderColor: "#3B81C4",
          backgroundColor: "#3B81C4",
          lineTension: 0
      },
      {
          label: translate.getText("WEIGHT_PREF_WEIGHT_TARGET"),
          data: dataWeightTarget,
          fill: false,
          borderColor: "#37F52E",
          backgroundColor: "#37F52E",
          pointRadius: 0
      }
      ]
    };

    setData(dataInit)

    var optionsInit = {
      title: {text: translate.getText("WEIGHT_TABL_EVO"), display: true},
      legend: {
        position: "bottom",
        align: "middle"
      },
      scales: {
        xAxes: [{
          type: "time",
          ticks: {
            min: startDate,
            max: endDate,
            unit: "day",
            minRotation: 50
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: translate.getText("WEIGHT_NAME_SECTION") + ' (' + weightService.getPrefUnitWeight() + ")" 
          }
        }]
      }
    }

    setOptions(optionsInit);
  }, [props.initialWeight, props.targetWeight, props.graphData, props.targetWeightDate, dateInterval])

  const handleDateFilter = (event) => {
    const value = event.detail.value;
    if(value < 0) {
      const targetDate = weightService.toDate(props.targetWeightDate)
      targetDate.setMonth(targetDate.getMonth()+1)
      setDateInterval({start: value, end: targetDate});
    } else {
      setDateInterval({start: value, end: new Date()});
    }
  };

  return (
    <div className="tableWeight">
      <Line data-testid = "chart" className="ionTableau poidsGraph" height={250} data={data} options={options} plugins={plugins}/>

      <hr className="lineSeparator"/>

      <IonSegment data-testid = "dateFilter" className="dateFilter" value={dateInterval.start} onIonChange={handleDateFilter}>
        <IonSegmentButton value="7">
          <IonLabel>{translate.getText("WEIGHT_WEEK")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="30">
          <IonLabel>{translate.getText("WEIGHT_MONTH")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="90">
          <IonLabel>{translate.getText("WEIGHT_QUARTER")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="182">
          <IonLabel>{translate.getText("WEIGHT_SEMESTER")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="365">
          <IonLabel>{translate.getText("WEIGHT_YEAR")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="-90">
          <IonLabel>{translate.getText("WEIGHT_TARGET_NAME")}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  );
}

export default TableWeight;