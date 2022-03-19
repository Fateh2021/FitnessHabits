import { Line } from "react-chartjs-2";
import moment from "moment"
import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import * as weightService from "../../weight/configuration/weightService"
import * as translate from "../../../translate/Translator";

const Tableauweight = () => {
  const [refData, setRefData] = useState()
  const [initialWeight, setinitialWeight] = useState("");
  const [targetWeight, setweightCible] = useState("");

  function formatDate (date) {
     return moment(date).format('YYYY-MM-DD');
  }

  useEffect(() => {
      const userUID = localStorage.getItem('userUid');
      let prefWeightUnit = firebase.database().ref('profiles/' + userUID + "/preferencesweight")
      prefWeightUnit.once("value").then(function(snapshot) {
          if (snapshot.val() != null) {
            setinitialWeight(parseFloat(snapshot.val().initialWeight));
            setweightCible(parseFloat(snapshot.val().weightCible));
          }
        })
  }, [])

  useEffect(() => {
      const userUID = localStorage.getItem('userUid');
      let refWeight = firebase.database().ref('dashboard/' + userUID)
        refWeight.orderByChild("weight/dailyweight").once("value").then(function(snapshot){
        setRefData(snapshot.val())
      });
  }, [])

  var graphData = []
  if (refData != null) {
  // On doit comprendre à quoi sert la variable _
   for (const [,value] of Object.entries(refData)) {
      
      if (value.weight.dateWeight !== undefined) {
        let dateWeight = formatDate(value.weight.dateWeight)
        let weight = weightService.formatweight(value.weight.dailyweight)
        graphData.push ({x: dateWeight, y: weight})
      }
    }

    graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);
  }
  let start = new Date(),
  end = new Date();

  start.setDate(start.getDate() - 90); // set to 'now' minus 7 days.
  start.setHours(0, 0, 0, 0); // set to midnight.
  let weightIni = weightService.formatweight(initialWeight)
  let weightCib = weightService.formatweight(weightCible)
  let datainitialWeight = [{x: start, y: weightIni},{x: end, y: weightIni}]
  let dataweightCible = [{x: start, y: weightCib},{x: end, y: weightCib}]

  const data = {
    datasets: [
    {
        label: translate.getText("weight_PREF_weight_INITIAL"),
        data: datainitialWeight,
        fill: false,
        borderColor: "#F45650",
        backgroundColor: "#F45650",
        pointRadius: 0
    },
    {
        label: translate.getText("weight_NOM_SECTION"),
        data: graphData,
        fill: false,
        borderColor: "#3B81C4",
        backgroundColor: "#3B81C4"
    },
    {
        label: translate.getText("weight_PREF_weight_CIBLE"),
        data: datatargetWeight,
        fill: false,
        borderColor: "#37F52E",
        backgroundColor: "#37F52E",
        pointRadius: 0
    }
    ]
  };
  var options = {
    title: {text: translate.getText("weight_TABL_EVO_3_MOIS"), display: true},
    legend: {
      position: "bottom",
      align: "middle"
    },
    scales: {
      xAxes: [{
        type: "time",
        ticks: {
          min: start,
          max: end,
          unit: "day"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: translate.getText("weight_NOM_SECTION") + ' (' + weightService.getPrefUniteweight() + ")" 
        }
      }]
    }
  }

  return (<Line className="ionTableau weightGraph" data={data} options={options} />)
}

export default Tableauweight;
