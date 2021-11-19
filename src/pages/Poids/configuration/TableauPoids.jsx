import { Line } from "react-chartjs-2";
import moment from "moment"
import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import * as poidsService from "../../Poids/configuration/poidsService"
import * as translate from "../../../translate/Translator";


const TableauPoids = () => {
    const [refData, setRefData] = useState()
    const [poidsInitial, setPoidsInitial] = useState("");
    const [poidsCible, setPoidsCible] = useState("");

    function formatDate (date) {
        let formattedDate = moment(date).format('YYYY-MM-DD')
        return formattedDate
    }

    useEffect(() => {
        const userUID = localStorage.getItem('userUid');
        let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
        preferencesPoidsRef.once("value").then(function(snapshot) {
            if (snapshot.val() != null) {
              setPoidsInitial(poidsService.formatPoids(parseFloat(snapshot.val().poidsInitial)));
              setPoidsCible(poidsService.formatPoids(parseFloat(snapshot.val().poidsCible)));
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
                setPoidsInitial(poidsService.formatPoids(parseFloat(snapshot.val().poidsInitial)));
                setPoidsCible(poidsService.formatPoids(parseFloat(snapshot.val().poidsCible)))
            }
          })
    }, [])


    var graphData = []
    if (refData != null) {
      for (const [key, value] of Object.entries(refData)) {
          if (value.poids.datePoids != undefined) {
              let datePoids = formatDate(value.poids.datePoids)
              let poids = poidsService.formatPoids(value.poids.dailyPoids)
              graphData.push ({x: datePoids, y: poids})
          }
      }
      graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);
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
            label: translate.getText("POIDS_PREF_POIDS_INITIAL"),
            data: dataPoidsInitial,
            fill: false,
            borderColor: "#F45650",
            backgroundColor: "#F45650",
            pointRadius: 0
        },
        {
            label: translate.getText("POIDS_NOM_SECTION"),
            data: graphData,
            fill: false,
            borderColor: "#3B81C4",
            backgroundColor: "#3B81C4"
        },
        {
            label: translate.getText("POIDS_PREF_POIDS_CIBLE"),
            data: dataPoidsCible,
            fill: false,
            borderColor: "#37F52E",
            backgroundColor: "#37F52E",
            pointRadius: 0
        }
        ]
    };
  var options = {
    title: {text: translate.getText("POIDS_TABL_EVO_3_MOIS"), display: true},
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
          labelString: translate.getText("POIDS_NOM_SECTION") + ' (' + poidsService.getprefUnitePoids() + ")" 
        }
      }]
    }
  }

  return (<Line className="ionTableau poidsGraph" data={data} options={options} />)

}

export default TableauPoids;
