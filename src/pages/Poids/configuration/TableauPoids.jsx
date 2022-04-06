import { Line } from "react-chartjs-2";
import moment from "moment"
import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import * as weightService from "../../Poids/configuration/weightService"
import * as translate from "../../../translate/Translator";

// Variables in Firebase remains in French for now with a translation in comment
const TableauPoids = () => {
  const [refData, setRefData] = useState()
  const [initialWeight, setInitialWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  function formatDate (date) {
     return moment(date).format('YYYY-MM-DD');
  }

  useEffect(() => {
      const userUID = localStorage.getItem('userUid');
      let preferencesWeightRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
      preferencesWeightRef.once("value").then(function(snapshot) {
          if (snapshot.val() != null) {
            // Firebase : poidsInitial = initialWeight
            // Firebase : poidsCible = targetWeight
            setInitialWeight(parseFloat(snapshot.val().poidsInitial));
            setTargetWeight(parseFloat(snapshot.val().poidsCible));
          }
        })
  }, [])

  useEffect(() => {
      const userUID = localStorage.getItem('userUid');
      let weightRef = firebase.database().ref('dashboard/' + userUID)
        weightRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
        setRefData(snapshot.val())
      });
  }, [])

	// Preparing to build the graph
  var graphData = []
  if (refData != null) {
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));
    for (const [,value] of Object.entries(refData)) {

      if (value.poids.datePoids !== undefined) {
        let dateWeight = formatDate(value.poids.datePoids)
        let weight = weightService.formatWeight(value.poids.dailyPoids)

				// To do the live update of the value of the day without reloading the page
        if (dateWeight == formatDate(new Date())){
          weight = weightService.formatWeight(dashboard.poids.dailyPoids)
        }

        graphData.push ({x: dateWeight, y: weight})
      }
    }

    graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);
  }
  let start = new Date(),
  end = new Date();

  start.setDate(start.getDate() - 90); // set to 'now' minus 7 days.
  start.setHours(0, 0, 0, 0); // set to midnight.
  let weightIni = weightService.formatWeight(initialWeight)
  let weightCib = weightService.formatWeight(targetWeight)
  let dataWeightInitial = [{x: start, y: weightIni},{x: end, y: weightIni}]
  let dataWeightTarget = [{x: start, y: weightCib},{x: end, y: weightCib}]

  const data = {
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
        data: graphData,
        fill: false,
        borderColor: "#3B81C4",
        backgroundColor: "#3B81C4"
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
  var options = {
    title: {text: translate.getText("WEIGHT_TABL_EVO_3_MONTH"), display: true},
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
          labelString: translate.getText("WEIGHT_NAME_SECTION") + ' (' + weightService.getPrefUnitWeight() + ")" 
        }
      }]
    }
  }

  return (<Line className="ionTableau poidsGraph" data={data} options={options} />)
}

export default TableauPoids;
