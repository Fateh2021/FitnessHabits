import React from 'react';
import firebase from "firebase";
import * as translate from '../../translate/Translator'
import { getLang } from "../../translate/Translator";

export async function compilerBilan(dataSelected, d1, d2) {
    d1.setHours(0, 0, 0, 0)
    const userUID = localStorage.getItem("userUid");
    let dataFormat = [];
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
    // Only uses dates in datepicker
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

    // Remplacer par i dans un for (de-à) lorsque les dates seront gere
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

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
