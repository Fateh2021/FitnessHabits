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
let arrayNourriture = [];
let arrayAlcohol = [];
let arrayToilets = [];
let arrayGlycemia = [];

let mapAggWeights = new Map();
let mapAggSleeps = new Map();
let mapAggActivities = new Map();
let initialWeight;
const userUID = localStorage.getItem("userUid");


export async function compilerBilan(dataSelected, d1, d2) {
    arrayWeights = [];
    arraySleeps = [];
    arrayActivities = [];
    arrayHydratations = [];
    arrayNourriture = [];
    arrayAlcohol = [];
    arrayToilets = [];
    arrayGlycemia = [];
    mapAggWeights = new Map();
    mapAggSleeps = new Map();
    mapAggActivities = new Map();
    d1.setHours(0, 0, 0, 0)
    //Array of all datas in the BD
    let dataFormat = [];

    // if offline, fetches from local storage of the user
    if (!window.navigator.onLine) {
        let localStorageData = JSON.parse(localStorage.getItem("dashboard"));
        let today = new Date();
        let month = today.getMonth().toString().length === 1 ? '0'+ today.getMonth() : today.getMonth();
        let formatedDate = today.getDate()+'-'+month+'-'+today.getFullYear();
        fetchData(localStorageData, formatedDate, dataSelected)
    } else {
        //Fetch all datas in BD for the current user and set the date from Firebase (like: 2044, 2046, 2022022
        // dataFormat = Array of all datas in the BD with date as mm-jj-aaaa
        // dataSelected = Checkbox selected by user
        dataFormat = await getDataFromFirebase(dataFormat);
        initialWeight = fetchInitialWeight(dataFormat);

        // With the new array(with the good date format), filter the datas with date selected by user in the datepicker
        dataFormat = filterDataByDate(dataFormat, d1, d2);

        // With the filtered datas, make a dictionnary for each parameters
        // so the front end can easily fetch datas with keys and show parameters selected by activity/date.
        for (let i = 0; i < dataFormat.length; ++i) {
            let formatedDate = dataFormat[i].date
            fetchData(dataFormat[i], formatedDate, dataSelected);
        }
    }
}

// PRIVATE FONCTIONS
//Return an array (dataFormat) with all the datas from the user
async function getDataFromFirebase(dataFormat) {
    let ref = firebase.database().ref("dashboard/" + userUID + "/");
    await ref.once("value", (snap) => {
        snap.forEach((data) => {
            let annee = data.key.slice(-4);
            let dayAndMonth = data.key.slice(0, -4);
            let mois;
            let jour;
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
            let date = jour + mois + annee;
            let obj = data.val();
            obj.date = date;
            dataFormat.push(obj);
        });
    });
    return dataFormat;
}

// Filter the array of data by date between date debut and date fin
function filterDataByDate(dataFormat, d1, d2) {
    let datePickerDates = getDates(d1, d2);
    dataFormat = dataFormat.filter((data) => {
        return !!datePickerDates.find((item) => {
            return (item.getTime() == new Date(data.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()
            );
        });
    });
    return dataFormat;
}

// Return an array containing all the possible dates between startDate and stopDate
function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

// fetches all the data for the selected categories
function fetchData(data, formatedDate, categorySelected) {
    for (const category of categorySelected) {
        switch (category) {
            case "hydratation":
                if (data.hydratation.hydrates) {
                    let hydratations = data.hydratation.hydrates
                    fetchDrinks("hydratation", hydratations, formatedDate);
                }
                break;
            case "nourriture":
                let cereales = data.cereales.cereales;
                let legumes = data.legumes.legumes;
                let proteines = data.proteines.proteines;
                let gras = data.gras.grass;
                fetchNourriture(cereales,formatedDate);
                fetchNourriture(legumes,formatedDate);
                fetchNourriture(proteines,formatedDate);
                fetchNourriture(gras,formatedDate);
                break;
            case "toilettes":
                let toilets = data.toilettes;
                fetchToilets(toilets, formatedDate);
                break;
            case "alcool":
                if (data.alcool.alcools) {
                    let alcools = data.alcool.alcools;
                    fetchDrinks("alcool", alcools, formatedDate);
                }
                break;
            case "glycémie":
                let glycemie = data.glycemie.dailyGlycemie;
                fetchGlycemia(glycemie, formatedDate);
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
                if (data.poids.dailyPoids) {
                    weight = data.poids.dailyPoids;
                    if (weight !== "0.00") {
                        fetchWeights(weight, formatedDate);
                    }
                }
                break;
            case "activities":
                var activity;
                if (data.activities) {
                    var activity = data.activities;
                    if (parseInt(activity.hour) + parseInt(activity.minute) != 0) {
                        fetchActivities(activity, formatedDate);
                    }
                }
                break;
            case "sommeil":
                var sommeil;
                if (data.sommeil) {
                    sommeil = data.sommeil;
                    fetchSleeps(sommeil, formatedDate);
                }
                break;
            default:
                break;
        }
    }
}

// Function that fetches datas for hydratation and alcohol.
function fetchDrinks(typeOfDrink, drinks, formatedDate) {
    for (const drink of drinks) {
        if (drink.consumption === 0) {
            continue;
        }
        let mapHydratation = new Map();
        mapHydratation.set("Date", formatedDate);
        mapHydratation.set("Nom", drink.name);
        mapHydratation.set("Consommation", drink.consumption);
        mapHydratation.set("Quantité", drink.qtte);
        mapHydratation.set("Unité", drink.unit);
        mapHydratation.set("Protéine", parseInt(drink.proteine) * drink.consumption);
        mapHydratation.set("Glucide", parseInt(drink.glucide) * drink.consumption);
        mapHydratation.set("Fibre", parseInt(drink.fibre) * drink.consumption);
        mapHydratation.set("Gras", parseInt(drink.gras) * drink.consumption);

        if (typeOfDrink === "hydratation") {
            arrayHydratations.push(mapHydratation);
        } else {
            arrayAlcohol.push(mapHydratation);
        }
    }
}


function fetchNourriture(array_nourriture,formatedDate){

    if(array_nourriture!=null){

        for (const element of array_nourriture) {
                if (element.consumption === 0) {
                    continue;
                }
                let mapResult = new Map();
                mapResult.set("Date", formatedDate);
                mapResult.set("Nom", element.name);
                mapResult.set("Consommation", element.consumption);
                mapResult.set("Quantité", element.qtte);
                mapResult.set("Unité", element.unit);
                mapResult.set("Protéine", element.proteine * element.consumption);
                mapResult.set("Glucide", element.glucide * element.consumption);
                mapResult.set("Fibre", element.fibre * element.consumption);
                mapResult.set("Gras", element.gras * element.consumption);

                arrayNourriture.push(mapResult);

        }
    }   
}


function fetchToilets(toilets, formatedDate) {
    let mapToilets = new Map();

    mapToilets.set("Date", formatedDate);
    mapToilets.set("Urine", toilets.urine);
    mapToilets.set("Transit", toilets.feces);

    arrayToilets.push(mapToilets);
}

function fetchGlycemia(glycemia, formatedDate) {
    let mapGlycemia = new Map();
    mapGlycemia.set("Date", formatedDate);
    mapGlycemia.set("Glycémie", parseInt(glycemia));

    arrayGlycemia.push(mapGlycemia);
}


function fetchWeights(weight, formatedDate) {
    let mapWeight = new Map();
    mapWeight.set("Date", formatedDate);
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
    mapActivity.set("Date", formatedDate);
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
        mapSleep.set("Date", formatedDate);
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
    sortEntries(arrayHydratations);
    return arrayHydratations;
}

export function getNourriture(){
    sortEntries(arrayNourriture);
    return arrayNourriture;
}

export function getAlcohol() {
    sortEntries(arrayAlcohol);
    return arrayAlcohol;
}

// Function used to calculate the macros total and the average per day.
// Return a map with a total for each macro (protein, glucide, fiber, fat) as
// well as their average.
// category can be : "hydratation", "alcool", "nourriture"
export function getMacrosTotalAndAveragePerDay(category) {
    let totalFiber = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalGlucide = 0;
    let days;

    if (category === "hydratation") {
        arrayHydratations.forEach((data) => {
            totalFiber += data.get("Fibre");
            totalProtein += data.get("Protéine");
            totalFat += data.get("Gras");
            totalGlucide += data.get("Glucide");
        });
        days = getNumberOfUniqueDate(arrayHydratations)
    } else if (category === "nourriture") {
        arrayNourriture.forEach((data) => {
            totalFiber += data.get("Fibre");
            totalProtein += data.get("Protéine");
            totalFat += data.get("Gras");
            totalGlucide += data.get("Glucide");
        });
        days = getNumberOfUniqueDate(arrayNourriture)
    } else { // for alcohol
        arrayAlcohol.forEach((data) => {
            totalFiber += data.get("Fibre");
            totalProtein += data.get("Protéine");
            totalFat += data.get("Gras");
            totalGlucide += data.get("Glucide");
        });
        days = getNumberOfUniqueDate(arrayAlcohol)
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
    sortEntries(arrayToilets);
    return arrayToilets;
}

export function getAverageToilets() {
    let totalUrine = 0;
    let totalFeces = 0;
    let days = getNumberOfUniqueDate(arrayToilets);
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

// keys : Date, Glycemie
export function getGlycemia() {
    sortEntries(arrayGlycemia);
    return arrayGlycemia;
}

// return the average glycemia for the last few days
export function getAverageGlycemia() {
    let total = 0;
    let days = getNumberOfUniqueDate(arrayGlycemia)
    arrayGlycemia.forEach((data) => {
        total += data["Glycemie"];
    });
    let mapAverageGlycemia = new Map();
    mapAverageGlycemia["Moyenne"] = (total/days).toFixed(2) + " mmol/L";
    mapAverageGlycemia["Référence"] = "4.7 - 6.8 mmol/L";

    return mapAverageGlycemia;
}

//Possible keys: date, hour, minute, duration
export function getActivities() {
    sortEntries(arrayActivities);
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
    sortEntries(arrayWeights);
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
    sortEntries(arraySleeps);
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


// sort the entries from the most recent date to the oldest one
// Note : the key containing the date value must be called Date
function sortEntries(arrayToSort) {
    arrayToSort.sort((a,b) => new Date(b.get("Date").replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
        - new Date(a.get("Date").replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")));
}


function getNumberOfUniqueDate(array_aliments){
    let set_date = new Set();
    array_aliments.forEach((data)=>{
        set_date.add(data.get('Date'))
    });
    return set_date.size;
}




