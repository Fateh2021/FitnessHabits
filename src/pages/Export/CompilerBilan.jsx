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
    arrayNourriture=[];
    arrayAlcohol = [];
    arrayToilets = [];
    arrayGlycemia = [];
    mapAggWeights = new Map();
    mapAggSleeps = new Map();
    mapAggActivities = new Map();
    d1.setHours(0, 0, 0, 0)
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

                case "nourriture":
                    //let nourriture = dataFormat[i].nourriture;
                    let cereales = dataFormat[i].cereales.cereales;
                    let legumes = dataFormat[i].legumes.legumes;
                    let proteines = dataFormat[i].proteines.proteines;
                    let gras = dataFormat[i].gras.grass;
                     
                     fetchNourriture(cereales,formatedDate);
                     fetchNourriture(legumes,formatedDate);
                     fetchNourriture(proteines,formatedDate);
                     fetchNourriture(gras,formatedDate);
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
                case "glycémie":
                    let glycemie = dataFormat[i].glycemie.dailyGlycemie;
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
    return retour;
}

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
        mapHydratation.set("Date", formatedDate);
        mapHydratation.set("Boisson", drink.name);
        mapHydratation.set("Quantité", drink.consumption);
        mapHydratation.set("Volume", drink.qtte);
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

// function fetchNourriture(nourriture,formatedDate){
//     // console.log("un nourriture",nourriture)
//     let mapNourriture = new Map();       
//     mapNourriture.set("date",formatedDate);
//     mapNourriture.set("consumption",nourriture)
//     arrayNourriture.push(mapNourriture)
// }

function fetchNourriture(array_nourriture,array_result,formatedDate){

    if(array_nourriture!=null){

        for (const element of array_nourriture) {
                if (element.consumption === 0) {
                    continue;
                }
                let mapResult = new Map();
                mapResult.set("date", formatedDate);
                mapResult.set("name", element.name);
                mapResult.set("consumption", element.consumption);
                mapResult.set("quantity", element.qtte);
                mapResult.set("unit", element.unit);
                mapResult.set("protein", element.proteine);
                mapResult.set("glucide", element.glucide);
                mapResult.set("fibre", element.fibre);
                mapResult.set("gras", element.gras);

                arrayNourriture.push(mapResult);
                // console.log("arrayCereales",arrayCereales)
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
    mapGlycemia["Date"] = formatedDate;
    mapGlycemia["Glycémie"] = parseInt(glycemia);

    arrayGlycemia.push(mapGlycemia);
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

// keys : Date, Glycemie
export function getGlycemia() {
    return arrayGlycemia;
}

// return the average glycemia for the last few days
export function getAverageGlycemia() {
    let total = 0;
    arrayGlycemia.forEach((data) => {
        total += data["Glycemie"];
    });
    let mapAverageGlycemia = new Map();
    mapAverageGlycemia["Moyenne"] = (total/arrayGlycemia.length).toFixed(2) + " mmol/L";
    mapAverageGlycemia["Référence"] = "4.7 - 6.8 mmol/L";

    return mapAverageGlycemia;
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



function convertToDateObject(formated_date){
    let date_split =formated_date.split('-');
    return new Date(date_split[2], date_split[1] - 1, date_split[0])

}


export function getAggregateNourriture(){
    
    let totalFibres=0;
    let totalGlucide=0;
    let totalGras=0;
    let totalProtein=0;
    let totalConsumption=0;

    arrayNourriture.forEach(objet => {
        
        objet.set('protein',(objet.get('consumption') * objet.get('protein')));
        objet.set('glucide',(objet.get('consumption') * objet.get('glucide')));
        objet.set('gras',(objet.get('consumption') * objet.get('gras')));
        objet.set('fibre',(objet.get('consumption') * objet.get('fibre')));
        
        objet.set('date',convertToDateObject(objet.get('date')));
        
        totalFibres+=objet.get('fibre');
        totalGlucide+=objet.get('glucide');
        totalGras+=objet.get('gras');
        totalProtein+=objet.get('protein');
        totalConsumption+=objet.get('consumption');

    });

    arrayNourriture.sort((a, b) => a.get('date') - b.get('date'));    
    let intervalle= arrayNourriture[arrayNourriture.length-1].get('date') - arrayNourriture[0].get('date');
    //86400000 nombre de milisecondes en 1 journee
    let day_interval=Math.floor(intervalle/86400000);


    let mapTotaux = new Map();
    mapTotaux.set("date", 'N/A');
    mapTotaux.set("name", 'Total');
    mapTotaux.set("consumption", totalConsumption);
    mapTotaux.set("quantity", 'N/A');
    mapTotaux.set("unit", 'N/A');
    mapTotaux.set("protein", totalProtein);
    mapTotaux.set("glucide",totalGlucide);
    mapTotaux.set("fibre",totalFibres);
    mapTotaux.set("gras", totalGras);

    let mapMoyenne = new Map();
    mapMoyenne.set("date", 'N/A');
    mapMoyenne.set("name", 'Total');
    mapMoyenne.set("consumption", (totalConsumption/day_interval).toFixed(2));
    mapMoyenne.set("quantity", 'N/A');
    mapMoyenne.set("unit", 'N/A');
    mapMoyenne.set("protein", (totalProtein/day_interval).toFixed(2));
    mapMoyenne.set("glucide",(totalGlucide/day_interval).toFixed(2));
    mapMoyenne.set("fibre",(totalFibres/day_interval).toFixed(2));
    mapMoyenne.set("gras", (totalGras/day_interval).toFixed(2));


    arrayNourriture.push(mapTotaux,mapMoyenne);
    console.log(arrayNourriture);
    return arrayNourriture;


}


