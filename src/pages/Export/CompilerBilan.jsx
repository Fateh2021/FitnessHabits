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
    let dataFormat = [];

    //On get les datas au complet
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
                //On forme une date avec qqChose qui ressemble a 2044, 2046, 2022022
                //Devrait etre les 4 dernier pour l'année, -- donc on est bon mais les mois et jours pas vraiemtn géré pour les cas de mois 1 a 9 et dates 1 à 9
                //var date = data.key.toDate();
                const currentDate = new Date();

                var jour = data.key[0] + data.key[1] + "-";
                var mois = "0" + data.key[2] + "-";
                var annee = data.key[3] + data.key[4] + data.key[5] + data.key[6];
                var date = jour + mois + annee;
                //on pousse le tout dans un tableau avec la nouvelle date formée
                var obj = data.val();
                obj.date = date;
                dataFormat.push(obj);
            });
        });
    }

    // Avec le tableau formé avec des dates digestes (comparable avec les dates du datepicker), on filtres pour getter seulement les données selected in datepicker
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



    // On prend les données filtrés pour faire des dictionnaires. le front-end sera en mesure de faire des get dessus pour générer le rapprot
    for (let i = 0; i < dataFormat.length; ++i) {
        retour[i] = {};
        retour[i].date = dataFormat[i].date
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
                    let mapWeight = new Map();
                    mapWeight.set("date", retour[i].date);

                    let weightUnit = localStorage.getItem("prefUnitePoids");
                    mapWeight.set("weightUnit", weightUnit);
                    var weight = dataFormat[i].poids.dailyPoids;
                    if( weightUnit === "LBS"){
                        mapWeight.set("weight", (weight * 2.2).toFixed(2));
                    } else {
                        mapWeight.set("weight", weight);
                    }
                    arrayWeights.push(mapWeight);
                    break;
                case "activities":
                    let mapActivity = new Map();
                    var activite = dataFormat[i].activities;
                    mapActivity.set("date", retour[i].date);
                    mapActivity.set("hour", activite.heure);
                    mapActivity.set("minute", activite.minute);
                    var duration = (activite.heure * 60) + (activite.minute);
                    mapActivity.set("duration", duration);
                    mapActivity.set("durationUnit", "min");
                    //retour[i][data] = activite.heure + "h " + activite.minute + " min";
                    arrayActivities.push(mapActivity);
                    break;
                case "sommeil":
                    let mapSleep = new Map();
                    var sommeil = dataFormat[i].sommeil;
                    mapSleep.set("date", retour[i].date);
                    mapSleep.set("startHour", sommeil.heureDebut);
                    mapSleep.set("endHour", sommeil.heureFin);
                    mapSleep.set("duration", sommeil.duree);
                    mapSleep.set("wakeUpQt", sommeil.nbReveils);
                    mapSleep.set("wakeUpState", sommeil.etatReveil);
                    //retour[i][data] = sommeil.heure + "h " + sommeil.minute + " min";
                    arraySleeps.push(mapSleep);
                    break;
                default:
                    break;
            }
        }
    }
    return retour;
}

/*
    // On prend les données filtrés pour faire un affichage qui devrait être géré par le front-end.
    // Remplacer par i dans un for (de-à) lorsque les dates seront gerees
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


//Donne un array avec toutes les dates à fetcher
function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}


//ToUse: arrayActivities[0].get('key');
//Possible keys: date, hour, minute, duration, durationUnit
export function getActivities() {
  return arrayActivities;
}

//ToUse: arrayWeights[0].get('key');
//Possible keys: weightUnit, weight
export function getWeights() {
  return arrayWeights;
}

//ToUse: arraySleeps[0].get('key');
//Possible keys: date, hour, minute, duration, wakeUpQt, wakeUpState
export function getSleeps() {
  return arraySleeps;
}

