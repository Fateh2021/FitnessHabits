import { Line } from "react-chartjs-2";
import moment from "moment"
import React, { useState, useEffect } from "react"
import firebase from 'firebase'

const TableauPoids = () => {

    const [refData, setRefData] = useState()
    const [poidsInitial, setPoidsInitial] = useState("");
    const [poidsCible, setPoidsCible] = useState("");
    const [unitePoids, setUnitePoids] = useState("");


    function formatDate (date) {
        let formattedDate = moment(date).format('YYYY-MM-DD')
        return formattedDate
    }

    useEffect(() => {
        const userUID = localStorage.getItem('userUid');
        let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
        preferencesPoidsRef.once("value").then(function(snapshot) {
            if (snapshot.val() != null) {
              setPoidsInitial(parseFloat(snapshot.val().poidsInitial).toFixed(2));
              setPoidsCible(parseFloat(snapshot.val().poidsCible).toFixed(2));
              setUnitePoids(snapshot.val().unitePoids);
            }
          })
    }, [])

    useEffect(() => {
        const userUID = localStorage.getItem('userUid');
        let poidsRef = firebase.database().ref('dashboard/' + userUID)
          poidsRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
          setRefData(snapshot.val())
        });
        let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
        preferencesPoidsRef.once("value").then(function(snapshot) {
            if (snapshot.val() != null) {
                setUnitePoids(snapshot.val().unitePoids);
                setPoidsInitial(parseFloat(snapshot.val().poidsInitial).toFixed(2));
                setPoidsCible(parseFloat(snapshot.val().poidsCible).toFixed(2));
            }
          })
    }, [])


    var graphData = []
    if (refData != null) {
      for (const [key, value] of Object.entries(refData)) {
          if (value.poids.datePoids != undefined) {
              let datePoids = formatDate(value.poids.datePoids)
              let poids = value.poids.dailyPoids
              graphData.push ({x: datePoids, y: poids})
          }
      }
      let sortedGraphData = graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);
    }
    let start = new Date(),
    end = new Date();

    start.setDate(start.getDate() - 90); // set to 'now' minus 7 days.
    start.setHours(0, 0, 0, 0); // set to midnight.

    let dataPoidsInitial = [{x: start, y: poidsInitial},{x: end, y: poidsInitial}]
    let dataPoidsCible = [{x: start, y: poidsCible},{x: end, y: poidsCible}]
    
    const data = {
        
        datasets: [
        {
            label: "Poids initial",
            data: dataPoidsInitial,
            fill: false,
            borderColor: "#F45650",
            backgroundColor: "#F45650",
            pointRadius: 0
        },
        {
            label: "Poids",
            data: graphData,
            fill: false,
            borderColor: "#3B81C4",
            backgroundColor: "#3B81C4"
        },
        {
            label: "Poids Cible",
            data: dataPoidsCible,
            fill: false,
            borderColor: "#37F52E",
            backgroundColor: "#37F52E",
            pointRadius: 0
        }
        ]
    };
  var options = {
    title: {text: "Évolution du poids des 3 derniers mois", display: true},
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
          labelString: 'Poids (Kg)'
        }
      }]
    }
  }

  return (<Line className="ionTableau poidsGraph" data={data} options={options} />)

}

export default TableauPoids;
