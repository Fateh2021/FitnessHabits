import React, {Fragment} from 'react';
import firebase from "firebase";
import * as translate from '../../translate/Translator'
import { getLang } from "../../translate/Translator";

//import React, {Fragment} from 'react';
// import {Text, View, StyleSheet} from '@react-pdf/renderer';

const arrayWeights = [];
const arraySleeps = [];
const arrayActivities = [];

export async function compilerBilan(dataSelected, d1, d2) {
    d1.setHours(0, 0, 0, 0)
    const userUID = localStorage.getItem("userUid");
    //Array of all datas in the BD
    let dataFormat = [];

    //Fetch all datas in BD for the current user and set the date from Firebase (like: 2044, 2046, 2022022
    //to a date in format mm-jj-aaaa
    //Note: not sure how date < 10 and month <10 are managed....
    if (!window.navigator.onLine) {
        dataFormat = [JSON.parse(localStorage.getItem("dashboard"))];
        let ajd = new Date();
        dataFormat[0].date = ('0' + ajd.getDate()).slice(-2) + '-'
            + ('0' + (ajd.getMonth() + 1)).slice(-2) + '-'
            + ajd.getFullYear();
    } else {
        let ref = firebase.database().ref("dashboard/" + userUID + "/");
        await ref.once("value", (snap) => {
            snap.forEach((data) => {
                const currentDate = new Date();
                var jour = data.key[0] + data.key[1] + "-";
                var mois = "0" + data.key[2] + "-";
                var annee = data.key[3] + data.key[4] + data.key[5] + data.key[6];
                var date = jour + mois + annee;
                var obj = data.val();
                obj.date = date;
                dataFormat.push(obj);
            });
        });
    }

    // With the new array(with the good date format), filter the datas with date selected by user
    // in the datepicker
    // dataFormat = Array of all datas in the BD with date as mm-jj-aaaa
    // dataSelected = Checkbox selected by user
    // retour =

    let datePickerDates = getDates(d1, d2);
    dataFormat = dataFormat.filter((data) => {
        return !!datePickerDates.find((item) => {
            return (
                item.getTime() ==
                new Date(
                    data.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                ).getTime()
            );
        });
    });

    let retour = [];



    // With the filtered datas, make a dictionnary for each parameters
    // so the front end can easily fetch datas with keys and show parameters selected by activity/date.
    //NOTE: comment are let as the old way. To refactor.
    for (let i = 0; i < dataFormat.length; ++i) {
        retour[i] = {};
        /*retour[i].date = dataFormat[i].date
            ? dataFormat[i].date
            : new Date().toISOString().slice(0, 10);*/

        var formatedDate = dataFormat[i].date
            ? dataFormat[i].date
            : new Date().toISOString().slice(0, 10);

        for (const data of dataSelected) {
            switch (data) {
                case "hydratation":
                /*
                    if (dataFormat[i].hydratation.hydrates) {
                        for (const hydr of dataFormat[i].hydratation.hydrates) {
                            if (retour[i][data])
                                retour[i][data] +=
                                    (hydr.name ? hydr.name : "NO-NAME") +
                                    ": " +
                                    hydr.qtte +
                                    " " +
                                    hydr.unit +
                                    "; ";
                            else
                                retour[i][data] =
                                    (hydr.name ? hydr.name : "NO-NAME") +
                                    ": " +
                                    hydr.qtte +
                                    " " +
                                    hydr.unit +
                                    "; ";
                        }
                    } else {
                        retour[i][data] = "empty";
                    }*/
                    break;

                case "nourriture":/*
                    var nourriture = dataFormat[i].nourriture;
                    if (nourriture.globalConsumption === "0")
                        retour[i][data] = " NO DATA FOUND IN NOURRITURE";
                    else retour[i][data] = nourriture.globalConsumption;*/
                    break;
                case "toilettes":/*
                    var toilettes = dataFormat[i].toilettes;
                    retour[i][data] =
                        translate.getText("FECES_TITLE") + ": " + toilettes.feces + "; " + translate.getText("URINE_TITLE") + ": " + toilettes.urine;
                    */
                    break;
                case "alcool":/*
                    if (dataFormat[i].alcool.alcools) {
                        dataFormat[i].alcool.alcools.forEach((alc) => {
                            if (retour[i][data])
                                retour[i][data] +=
                                    (alc.name ? alc.name : "NO-NAME") +
                                    ": " +
                                    alc.qtte +
                                    " " +
                                    alc.unit +
                                    "; ";
                            else
                                retour[i][data] =
                                    (alc.name ? alc.name : "NO-NAME") +
                                    ": " +
                                    alc.qtte +
                                    " " +
                                    alc.unit +
                                    "; ";
                        });
                    } else {
                        retour[i][data] = "empty";
                    }
                    */
                    break;
                case "glycémie":/*
                    var glycemie = dataFormat[i].glycemie.dailyGlycemie;
                    retour[i][data] = glycemie;
                    */
                    break;

                case "supplements":/*
                    var supplement = dataFormat[i].supplement;
                    if (!supplement)
                        retour[i][data] =
                            translate.getText("SUPP_NOT_YET_IMPLEMENTED") + "\n";
                    else retour[i][data] = supplement;
                    */
                    break;
                case "poids":
                    var weight;
                    if (dataFormat[i].poids.dailyPoids) {
                        weight = dataFormat[i].poids.dailyPoids;
                    }
                    fetchWeights(weight, formatedDate);
                    break;
                case "activities":
                    var activity;
                    if (dataFormat[i].activities) {
                        activity = dataFormat[i].activities;
                    }
                    fetchActivities(activity, formatedDate);
                    break;
                case "sommeil":
                    var sommeil;
                    if (dataFormat[i].sommeil) {
                        sommeil = dataFormat[i].sommeil;
                    }
                    fetchSleeps(sommeil, formatedDate);
                    break;
                default:
                    break;
            }
        }
    }
    return retour;
}

/*
    //NOTE: Old way to get datas (string)  -- let here just for reference
    for (let i = 0; i < dataFormat.length; ++i) {
        retour[i] = {};
        retour[i].date = dataFormat[i].date
            ? dataFormat[i].date
            : new Date().toISOString().slice(0, 10);

        for (const data of dataSelected) {
            switch (data) {
                case "hydratation":
                    if (dataFormat[i].hydratation.hydrates) {
                        for (const hydr of dataFormat[i].hydratation.hydrates) {
                            if (retour[i][data])
                                retour[i][data] +=
                                    (hydr.name ? hydr.name : "NO-NAME") +
                                    ": " +
                                    hydr.qtte +
                                    " " +
                                    hydr.unit +
                                    "; ";
                            else
                                retour[i][data] =
                                    (hydr.name ? hydr.name : "NO-NAME") +
                                    ": " +
                                    hydr.qtte +
                                    " " +
                                    hydr.unit +
                                    "; ";
                        }
                    } else {
                        retour[i][data] = "empty";
                    }
                    break;
                case "activities":
                    var activite = dataFormat[i].activities;
                    retour[i][data] = activite.heure + "h " + activite.minute + " min";
                    break;
                case "nourriture":
                    var nourriture = dataFormat[i].nourriture;
                    if (nourriture.globalConsumption === "0")
                        retour[i][data] = " NO DATA FOUND IN NOURRITURE";
                    else retour[i][data] = nourriture.globalConsumption;
                    break;
                case "sommeil":
                    var sommeil = dataFormat[i].sommeil;
                    retour[i][data] = sommeil.heure + "h " + sommeil.minute + " min";
                    break;
                case "toilettes":
                    var toilettes = dataFormat[i].toilettes;
                    retour[i][data] =
                        translate.getText("FECES_TITLE") + ": " + toilettes.feces + "; " + translate.getText("URINE_TITLE") + ": " + toilettes.urine;
                    break;
                case "alcool":
                    if (dataFormat[i].alcool.alcools) {
                        dataFormat[i].alcool.alcools.forEach((alc) => {
                            if (retour[i][data])
                                retour[i][data] +=
                                    (alc.name ? alc.name : "NO-NAME") +
                                    ": " +
                                    alc.qtte +
                                    " " +
                                    alc.unit +
                                    "; ";
                            else
                                retour[i][data] =
                                    (alc.name ? alc.name : "NO-NAME") +
                                    ": " +
                                    alc.qtte +
                                    " " +
                                    alc.unit +
                                    "; ";
                        });
                    } else {
                        retour[i][data] = "empty";
                    }
                    break;
                case "glycémie":
                    var glycemie = dataFormat[i].glycemie.dailyGlycemie;
                    retour[i][data] = glycemie;
                    break;
                case "poids":
                    var poids = dataFormat[i].poids.dailyPoids;
                    mapWeight.set(weight, dataFormat[i].poids.dailyPoids);
                    retour[i][data] = poids;
                    break;
                case "supplements":
                    var supplement = dataFormat[i].supplement;
                    if (!supplement)
                        retour[i][data] =
                            translate.getText("SUPP_NOT_YET_IMPLEMENTED") + "\n";
                    else retour[i][data] = supplement;
                    break;

                default:
                    break;
            }
        }
    }
    return retour;
}
*/


// PRIVATE FONCTIONS
//Return an array with all dates to fetch
function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

//TODO: ajouter documentation ?
function fetchWeights(weight, formatedDate) {
    let mapWeight = new Map();

        mapWeight.set("date", formatedDate);
        let weightUnit = localStorage.getItem("prefUnitePoids");
        mapWeight.set("weightUnit", weightUnit);

        if( weightUnit === "LBS"){
            mapWeight.set("weight", (weight * 2.2).toFixed(2));
        } else {
            mapWeight.set("weight", weight);
        }
        arrayWeights.push(mapWeight);
    return ;
}

//TODO: duration should be hh:mm  -- no duration unit
//TODO: ajouter documentation ?
function fetchActivities(activity, formatedDate) {
    let mapActivity = new Map();
        mapActivity.set("date", formatedDate);
        mapActivity.set("hour", activity.heure);
        mapActivity.set("minute", activity.minute);
        var duration = activity.heure + ":" + activity.minute;
        mapActivity.set("duration", duration);
        arrayActivities.push(mapActivity);
}

//TODO: ajouter documentation ?
function fetchSleeps(sommeil, formatedDate) {
    let mapSleep = new Map();
        mapSleep.set("date", formatedDate);
        mapSleep.set("startHour", sommeil.heureDebut);
        mapSleep.set("endHour", sommeil.heureFin);
        //TODO duree shoud be hh:mm
        mapSleep.set("duration", sommeil.duree);
        mapSleep.set("wakeUpQt", sommeil.nbReveils);
        mapSleep.set("wakeUpState", sommeil.etatReveil);
        arraySleeps.push(mapSleep);
    //retour[i][data] = sommeil.heure + "h " + sommeil.minute + " min";
}



// PUBLIC FONCTIONS
//ToUse: arrayActivities[0].get('key');
//Possible keys: date, hour, minute, duration
export function getActivities() {
  return arrayActivities;
}
//TODO: total + average
export function getAggregateActivities() {
  return arrayActivities;
}

//ToUse: arrayWeights[0].get('key');
//Possible keys: weightUnit, weight
export function getWeights() {
  return arrayWeights;
}
//TODO: initial Weight + gain/perte
export function getAggregateWeights() {
  return arrayWeights;
}

//ToUse: arraySleeps[0].get('key');
//Possible keys: date, hour, minute, duration, wakeUpQt, wakeUpState
export function getSleeps() {
  return arraySleeps;
}
//TODO: averageDuree + averageStartHour, averageEndHour, averageWakeUpQt
export function getAggregateSleeps() {
  return arraySleeps;
}