import React, {Fragment} from 'react';
import firebase from "firebase";
import * as translate from '../../translate/Translator'
import {getLang} from "../../translate/Translator";

//import React, {Fragment} from 'react';
// import {Text, View, StyleSheet} from '@react-pdf/renderer';
let arrayWeights = [];
let arraySleeps = [];
let arrayActivities = [];
let arrayHydratations = [];
let arrayAlcohol = [];
let arrayToilets = [];
let arrayGlycemia = [];

let mapAggWeights = new Map();
let mapAggSleeps = new Map();
let mapAggActivities = new Map();
let initialWeight;


export async function compilerBilan(dataSelected, d1, d2) {
    arrayWeights = [];
    arraySleeps = [];
    arrayActivities = [];
    arrayHydratations = [];
    arrayAlcohol = [];
    arrayToilets = [];
    arrayGlycemia = [];
    mapAggWeights = new Map();
    mapAggSleeps = new Map();
    mapAggActivities = new Map();
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
                var annee = data.key.slice(-4);
                var dayAndMonth = data.key.slice(0, -4);
                var mois;
                var jour;
                // if there's only 2 char for the day and month, then day and month are 1 char each
                if (dayAndMonth.length === 2) {
                    jour = '0' + data.key[0] + '-';
                    mois = '0' + data.key[1] + '-';
                    // if dayAndMonth has length of 4, then day and month have 2 chars each
                } else if (dayAndMonth.length === 4) {
                    jour = data.key.slice(0,2) + '-';
                    mois = data.key.slice(2,4) + '-';
                    // if dayAndMonth has a length of 3, 2 options:
                } else if (dayAndMonth.length === 3) {
                    // day 2 chars, month 1 char
                    if ( dayAndMonth.slice(0, 2) in [...Array(32).keys()]
                        && !(dayAndMonth.slice(1, 3) in [...Array(12).keys()]) ) {
                        jour = data.key.slice(0,2) + '-';
                        mois = '0' + data.key[2] + '-';
                        // day 1 char, month 1 char
                    } else {
                        jour = '0' + data.key[0] + '-';
                        mois = data.key.slice(1,3) + '-';
                    }
                }
                var date = jour + mois + annee;
                var obj = data.val();
                obj.date = date;
                dataFormat.push(obj);
            });
        });
    }


    initialWeight = fetchInitialWeight(dataFormat);

    // With the new array(with the good date format), filter the datas with date selected by user in the datepicker
    // dataFormat = Array of all datas in the BD with date as mm-jj-aaaa
    // dataSelected = Checkbox selected by user

    let datePickerDates = getDates(d1, d2);
    dataFormat = dataFormat.filter((data) => {
        return !!datePickerDates.find((item) => {
            return (item.getTime() == new Date(data.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()
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
                    if (dataFormat[i].hydratation.hydrates) {
                        let hydratations = dataFormat[i].hydratation.hydrates
                        fetchDrinks("hydratation", hydratations, formatedDate);
                    }
                    break;

                case "nourriture":/*
                    var nourriture = dataFormat[i].nourriture;
                    if (nourriture.globalConsumption === "0")
                        retour[i][data] = " NO DATA FOUND IN NOURRITURE";
                    else retour[i][data] = nourriture.globalConsumption;*/
                    break;
                case "toilettes":
                    let toilets = dataFormat[i].toilettes;
                    fetchToilets(toilets, formatedDate);
                    break;
                case "alcool":
                    if (dataFormat[i].alcool.alcools) {
                        let alcools = dataFormat[i].alcool.alcools;
                        fetchDrinks("alcool", alcools, formatedDate);
                    }
                    break;
                    //case "glycémie":
                    var glycemie = dataFormat[i].glycemie.dailyGlycemie;
                    retour[i][data] = glycemie;
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
                        if (weight !== "0.00") {
                            fetchWeights(weight, formatedDate);
                        }
                    }
                    break;
                case "activities":
                    var activity;
                    if (dataFormat[i].activities) {
                        var activity = dataFormat[i].activities;
                        if (parseInt(activity.hour) + parseInt(activity.minute) != 0) {
                            fetchActivities(activity, formatedDate);
                        }
                    }

                    break;
                case "sommeil":
                    var sommeil;
                    if (dataFormat[i].sommeil) {
                        sommeil = dataFormat[i].sommeil;
                        fetchSleeps(sommeil, formatedDate);
                    }

                    break;
                default:
                    break;
            }
        }
    }
    console.log(arrayToilets);
    console.log(getAverageToilets());
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

// Function to fetch datas for hydratation and alcohol.
function fetchDrinks(typeOfDrink, drinks, formatedDate) {
    for (const drink of drinks) {
        if (drink.consumption === 0) {
            continue;
        }
        let mapHydratation = new Map();
        mapHydratation.set("date", formatedDate);
        mapHydratation.set("consumption", drink.name);
        mapHydratation.set("quantity", drink.consumption);
        mapHydratation.set("volume", drink.qtte);
        mapHydratation.set("unit", drink.unit);
        mapHydratation.set("protein", parseInt(drink.proteine) * drink.consumption);
        mapHydratation.set("glucide", parseInt(drink.glucide) * drink.consumption);
        mapHydratation.set("fiber", parseInt(drink.fibre) * drink.consumption);
        mapHydratation.set("fat", parseInt(drink.gras) * drink.consumption);

        if (typeOfDrink === "hydratation") {
            arrayHydratations.push(mapHydratation);
        } else {
            arrayAlcohol.push(mapHydratation);
        }
    }
}

function fetchToilets(toilets, formatedDate) {
    let mapToilets = new Map();

    mapToilets.set("date", formatedDate);
    mapToilets.set("urine", toilets.urine);
    mapToilets.set("feces", toilets.feces);

    arrayToilets.push(mapToilets);
}


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
}

function fetchInitialWeight(datas) {
    let mWeights = new Map();
    let weightUnit = localStorage.getItem("prefUnitePoids");
    const dates = [];

    datas.forEach((data) => {
        if (data) {
           let weight = data.poids.dailyPoids;
           let date = data.poids.datePoids.slice(0,10).replace("-", "/").replace("-", "/");

           if (weight != "0.00") {
               weightUnit === "LBS" ? mWeights.set(date, (weight * 2.2).toFixed(2)): mWeights.set(date, weight);
               dates.push(date);
           }
        }
    });

    const minDate = new Date(
        Math.min(
            ...dates.map(element => {
                return new Date(element);
            }),
        ),
    );

    return mWeights.get(minDate.toISOString().slice(0,10).replace("-", "/").replace("-", "/"));
}


function fetchActivities(activity, formatedDate) {
    let mapActivity = new Map();
    mapActivity.set("date", formatedDate);
    var minutes = parseInt(activity.heure*60) + parseInt(activity.minute);
    var duration = formatDuration(minutes);
    mapActivity.set("duration", duration);
    mapActivity.set("hours", duration.slice(0,2));
    mapActivity.set("minutes", duration.slice(3,5));
    arrayActivities.push(mapActivity);
}


//Keys: "date", "startHour", "endHour", "wakeUpQt", "wakeUpState"
function fetchSleeps(sleep, formatedDate) {
    let mapSleep = new Map();

    if(sleep.duree && sleep.duree != 0 ){
        mapSleep.set("date", formatedDate);
        mapSleep.set("startHour", sleep.heureDebut);
        mapSleep.set("endHour", sleep.heureFin);
        mapSleep.set("duration", formatDuration(sleep.duree));
        sleep.nbReveils < 0 ? mapSleep.set("wakeUpQt", 0) : mapSleep.set("wakeUpQt", sleep.nbReveils);
        mapSleep.set("wakeUpState", sleep.etatReveil);
        arraySleeps.push(mapSleep);
    }
}


// ---- FONCTIONS UTILS ----------------------------------------------------
//methode qui prend heures et minutes et sort: 00:00
function formatDuration(minutes) {
    minutes = Math.floor(minutes);
    var hours;
    var minutes;
    if (minutes >= 60) {
        hours = Math.floor(minutes/60);
        minutes = Math.floor(minutes%60);
        if (hours   < 10) {hours   = "0"+hours;}

    } else if (minutes < 60) {
        hours = "00";
    }

    if (minutes < 10) {minutes = "0"+minutes;}
    return hours + ":" + minutes;
}

//fonction qui prend 00:00 et transforme en minutes
function getDuration(time) {
    return ( parseInt(time.slice(0,2) * 60) + parseInt(time.slice(3,5)) )
}

// ---- PUBLIC FONCTIONS ----------------------------------------------------

// PUBLIC FONCTIONS

// keys : date, consumption, quantity, volume, unit, protein, glucide, fiber, fat
export function getHydratations() {
    return arrayHydratations;
}

// Function used to calculate the macros total and the average per day.
// Return a map with a total for each macro (protein, glucide, fiber, fat) as
// well as their average.
// category can be : "hydratation", "alcool", "nourriture"
// todo: find a way to get the interval days and not just the days chosen
// todo: add category food when the array will be made
export function getMacrosTotalAndAveragePerDay(category) {
    let totalFiber = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalGlucide = 0;
    var days;

    if (category === "hydratation") {
        arrayHydratations.forEach((data) => {
            totalFiber += data.get("fiber");
            totalProtein += data.get("protein");
            totalFat += data.get("fat");
            totalGlucide += data.get("fat");
        });
        days = arrayHydratations.length;
    } else { // for alcohol
        arrayAlcohol.forEach((data) => {
            totalFiber += data.get("fiber");
            totalProtein += data.get("protein");
            totalFat += data.get("fat");
            totalGlucide += data.get("fat");
        });
        days = arrayAlcohol.length;
    }
    let macrosMap = new Map();
    macrosMap.set("totalFiber", totalFiber);
    macrosMap.set("totalProtein", totalProtein);
    macrosMap.set("totalFat", totalFat);
    macrosMap.set("totalGlucide", totalGlucide);
    macrosMap.set("averageFiber", +(totalFiber/days).toFixed(2));
    macrosMap.set("averageProtein", +(totalProtein/days).toFixed(2));
    macrosMap.set("averageFat", +(totalFat/days).toFixed(2));
    macrosMap.set("averageGlucide", +(totalGlucide/days).toFixed(2));

    return macrosMap;
}

// keys : urine, feces
export function getToilets() {
    return arrayToilets;
}

// todo: changer days pour avoir les jours de l'intervalle seulement
export function getAverageToilets() {
    let totalUrine = 0;
    let totalFeces = 0;
    let days = arrayToilets.length;
    arrayToilets.forEach((data) => {
        totalUrine += data.get("urine");
        totalFeces += data.get("feces");
    });

    let mapToilets = new Map();
    mapToilets["totalUrine"] = totalUrine;
    mapToilets["totalFeces"] = totalFeces;
    mapToilets["averageUrinePerDay"] = totalUrine/days;
    mapToilets["averageFecesPerDay"] = totalFeces/days;

    return mapToilets;
}


//Possible keys: date, hour, minute, duration
export function getActivities() {
    return arrayActivities;
}

export function getAggregateActivities() {
    var totalDuration = 0;
    var totalDays = 0;

    getActivities().forEach((data) => {
        totalDuration = totalDuration + parseInt(data.get('minutes')) + parseInt(data.get('hours')*60);
        totalDays = totalDays + 1;
    });

    mapAggActivities.set("TotalDuration", formatDuration(totalDuration));
    mapAggActivities.set("AverageDuration", formatDuration(totalDuration/totalDays));
    return mapAggActivities;
}

//- WEIGHTS - //
//Possible keys: weightUnit, weight
export function getWeights() {
    return arrayWeights;
}

export function getAggregateWeights() {
    var finalWeight = getWeights()[getWeights().length -1].get("weight");
    mapAggWeights.set("initalWeight", initialWeight);
    mapAggWeights.set("finalWeight", finalWeight);
    mapAggWeights.set("deltaWeight", (finalWeight - initialWeight).toFixed(2));
    mapAggWeights.set("prefUnitePoids",localStorage.getItem("prefUnitePoids"));
    return mapAggWeights;
}

//- SLEEPs - //
//Possible keys: date, hour, minute, duration, wakeUpQt, wakeUpState
export function getSleeps() {
    return arraySleeps;
}

export function getAggregateSleeps() {
    var minTotalStartHours = 0;
    var minTotalEndHours = 0;
    var minTotalDuration = 0;
    var totalWakeUp = 0;

    var totalDaysStart = 0;
    var totalDaysEnd = 0;
    var totalDaysDuration = 0;
    var totalDaysWakeUp = 0;

    getSleeps().forEach((data) => {
            if (data.get("startHour")) {
               minTotalStartHours += getDuration(data.get("startHour"));
               totalDaysStart += 1;
            }

            if (data.get("endHour")) {
                minTotalEndHours += getDuration(data.get("endHour"));
                totalDaysEnd += 1
            }

            if (getDuration(data.get("duration")) != 0) {
                minTotalDuration +=  getDuration(data.get("duration"));
                totalDaysDuration += 1;
            }
            totalWakeUp += parseInt(data.get("wakeUpQt"));
            totalDaysWakeUp +=1;

    });

    mapAggSleeps.set("averageStartHour", formatDuration(minTotalStartHours/totalDaysStart));
    mapAggSleeps.set("averageEndHour", formatDuration(minTotalEndHours/totalDaysEnd));
    mapAggSleeps.set("averageDuree", formatDuration(minTotalDuration/totalDaysDuration));
    mapAggSleeps.set("averageWakeUpQt", (totalWakeUp/totalDaysWakeUp).toFixed(1));
    return mapAggSleeps;
}

