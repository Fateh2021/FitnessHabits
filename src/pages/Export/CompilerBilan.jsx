import firebase from "firebase"

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
        let month = today.getMonth().toString().length === 1 ? '0' + today.getMonth() : today.getMonth();
        let formatedDate = today.getDate() + '-' + month + '-' + today.getFullYear();
        fetchData(localStorageData, formatedDate, dataSelected)
    } else {
        //Fetch all datas in BD for the current user and set the date from Firebase (like: 2044, 2046, 2022022
        // dataFormat = Array of all datas in the BD with date as mm-jj-aaaa
        // dataSelected = Checkbox selected by user
        dataFormat = await getDataFromFirebase(dataFormat);
        // TODO doesnt work anymore?
        // initialWeight = fetchInitialWeight(dataFormat);

        // With the new array(with the good date format), filter the datas with date selected by user in the datepicker
        dataFormat = filterDataByDate(dataFormat, d1, d2);

        // With the filtered datas, make a dictionnary for each parameters
        // so the front end can easily fetch datas with keys and show parameters selected by activity/date.
        for (const element of dataFormat) {
            let formatedDate = formatDate(element.date);
            fetchData(element, formatedDate, dataSelected);
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
                jour = data.key.slice(0, 2) + '-';
                mois = data.key.slice(2, 4) + '-';
                // if dayAndMonth has a length of 3, 2 options:
            } else if (dayAndMonth.length === 3) {
                // day 2 chars, month 1 char
                if ([...Array(32).keys()].includes(parseInt(dayAndMonth.slice(0, 2)))
                    && !([...Array(12).keys()].includes(parseInt(dayAndMonth.slice(1, 3))))) {
                    jour = data.key.slice(0, 2) + '-';
                    mois = '0' + data.key[2] + '-';
                    // day 1 char, month 1 char
                } else {
                    jour = '0' + data.key[0] + '-';
                    mois = data.key.slice(1, 3) + '-';
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
            return (item.getTime() === new Date(data.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()
            );
        });
    });
    return dataFormat;
}

// Return an array containing all the possible dates between startDate and stopDate
function getDates(startDate, stopDate) {
    let dateArray = [];
    let currentDate = startDate;
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
                let hydratations = data.hydratation.hydrates
                fetchDrinks("hydratation", hydratations, formatedDate);
                break;
            case "nourriture":
                let cereales = data.food.categories.grainFood;
                let legumes = data.food.categories.vegetables;
                let fruits = data.food.categories.fruit;
                let proteines = data.food.categories.proteinFood;
                let gras = data.food.categories.dairyProducts;
                fetchNourriture(cereales, formatedDate);
                fetchNourriture(legumes, formatedDate);
                fetchNourriture(fruits, formatedDate);
                fetchNourriture(proteines, formatedDate);
                fetchNourriture(gras, formatedDate);
                break;
            case "toilettes":
                let toilets = data.toilettes;
                fetchToilets(toilets, formatedDate);
                break;
            case "alcool":
                let alcools = data.alcool.alcools;
                fetchDrinks("alcool", alcools, formatedDate);
                break;
            case "glycémie":
                let glycemie = data.glycemie.dailyGlycemie;
                fetchGlycemia(glycemie, formatedDate);
                break;
            case "supplements":/* TODO
                    var supplement = dataFormat[i].supplement;
                    if (!supplement)
                        retour[i][data] =
                            translate.getText("SUPP_NOT_YET_IMPLEMENTED") + "\n";
                    else retour[i][data] = supplement;
                    */
                break;
            case "poids":
                let weight;
                weight = data.poids.dailyPoids;
                fetchWeights(weight, formatedDate);
                break;
            case "activities":
                if (data.activities) {
                    const activity = data.activities;
                    if (parseInt(activity.hour) + parseInt(activity.minute) !== 0) {
                        fetchActivities(activity, formatedDate);
                    }
                }
                break;
            case "sommeil":
                let sommeil = data.sommeil;
                fetchSleeps(sommeil, formatedDate);
                break;
            default:
                break;
        }
    }
}

// Function that fetches datas for hydratation and alcohol.
function fetchDrinks(typeOfDrink, drinks, formatedDate) {
    console.table(drinks);
    if (drinks) {
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
}


function fetchNourriture(foods, formatedDate) {
    if (foods.items) {
        for (const element of foods.items) {
            let mapResult = new Map();
            mapResult.set("Date", formatedDate);
            mapResult.set("Nom", element.name);
            mapResult.set("Quantité", element.qty);
            mapResult.set("Unité", element.unit);
            mapResult.set("Protéine", element.proteins);
            mapResult.set("Glucide", element.glucides);
            mapResult.set("Fibre", element.fibre);
            mapResult.set("Gras", element.fats);

            arrayNourriture.push(mapResult);
        }
    }
}


function fetchToilets(toilets, formatedDate) {
    if (toilets) {
        let mapToilets = new Map();

        mapToilets.set("Date", formatedDate);
        mapToilets.set("Urine", toilets.urine);
        mapToilets.set("Transit", toilets.feces);

        arrayToilets.push(mapToilets);
    }
}

function fetchGlycemia(glycemia, formatedDate) {
    if (glycemia) {
        let mapGlycemia = new Map();
        mapGlycemia.set("Date", formatedDate);
        mapGlycemia.set("Glycémie", parseInt(glycemia));

        arrayGlycemia.push(mapGlycemia);
    }
}


function fetchWeights(weight, formatedDate) {
    if (weight && weight !== "0.00") {
        let mapWeight = new Map();
        mapWeight.set("Date", formatedDate);
        let weightUnit = localStorage.getItem("prefUnitePoids");
        mapWeight.set("weightUnit", weightUnit);

        if (weightUnit === "LBS") {
            mapWeight.set("weight", (weight * 2.2).toFixed(2));
        } else {
            mapWeight.set("weight", weight);
        }
        arrayWeights.push(mapWeight);
    }
}

function fetchInitialWeight(datas) {
    let mWeights = new Map();
    let weightUnit = localStorage.getItem("prefUnitePoids");
    const dates = [];

    datas.forEach((data) => {
        if (data) {
            let weight = data.poids.dailyPoids;
            let date = data.poids.datePoids.slice(0, 10).replace("-", "/").replace("-", "/");

            if (weight !== "0.00") {
                weightUnit === "LBS" ? mWeights.set(date, (weight * 2.2).toFixed(2)) : mWeights.set(date, weight);
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

    return mWeights.get(minDate.toISOString().slice(0, 10).replace("-", "/").replace("-", "/"));
}


function fetchActivities(activity, formatedDate) {
    if(activity) {
        let mapActivity = new Map();
        let minutes = parseInt(activity.heure * 60) + parseInt(activity.minute);
        let duration = formatDuration(minutes);

        mapActivity.set("Date", formatedDate);
        mapActivity.set("duration", duration);
        mapActivity.set("hours", duration.slice(0, 2));
        mapActivity.set("minutes", duration.slice(3, 5));
        arrayActivities.push(mapActivity);
    }
}


//Keys: "date", "startHour", "endHour", "wakeUpQt", "wakeUpState"
function fetchSleeps(sleep, formatedDate) {
    if (sleep) {
        let mapSleep = new Map();
        if (sleep.duree && sleep.duree !== 0) {
            mapSleep.set("Date", formatedDate);
            mapSleep.set("startHour", sleep.heureDebut);
            mapSleep.set("endHour", sleep.heureFin);
            mapSleep.set("duration", formatDuration(sleep.duree));
            sleep.nbReveils < 0 ? mapSleep.set("wakeUpQt", 0) : mapSleep.set("wakeUpQt", sleep.nbReveils);
            mapSleep.set("wakeUpState", sleep.etatReveil);
            arraySleeps.push(mapSleep);
        }
    }
}


// ---- FONCTIONS UTILS ----------------------------------------------------
//methode qui prend heures et minutes et sort: 00:00
function formatDuration(min) {
    let minutes = Math.floor(min);
    let hours;
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = Math.floor(minutes % 60);
        if (hours < 10) {
            hours = "0" + hours;
        }

    } else if (minutes < 60) {
        hours = "00";
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

//fonction qui prend 00:00 et transforme en minutes
function getDuration(time) {
    return (parseInt(time.slice(0, 2) * 60) + parseInt(time.slice(3, 5)))
}

// ---- PUBLIC FONCTIONS ----------------------------------------------------

// PUBLIC FONCTIONS

// keys : date, consumption, quantity, volume, unit, protein, glucide, fiber, fat
export function getHydratations() {
    if (arrayHydratations.length !== 0) {
        sortEntries(arrayHydratations);
        return arrayHydratations;
    }
    return null;
}

export function getNourriture() {
    if (arrayNourriture.length !== 0) {
        sortEntries(arrayNourriture);
        return arrayNourriture;
    }
    return null;
}

export function getAlcohol() {
    if (arrayAlcohol.length !== 0) {
        sortEntries(arrayAlcohol);
        return arrayAlcohol;
    }
    return null;
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
    let macrosMap = new Map();
    let arrayMacros;
    switch (category) {
        case "hydratation":
            arrayMacros = arrayHydratations;
            break;
        case "nourriture":
            arrayMacros = arrayNourriture;
            break;
        case "alcool":
            arrayMacros = arrayAlcohol;
            break;
    }

    if (arrayMacros.length !== 0) {
        arrayMacros.forEach((data) => {
            totalFiber += data.get("Fibre");
            totalProtein += data.get("Protéine");
            totalFat += data.get("Gras");
            totalGlucide += data.get("Glucide");
        });
        days = getNumberOfUniqueDate(arrayMacros);
    } else { // empty array
        return null;
    }
    macrosMap.set("totalFiber", totalFiber);
    macrosMap.set("totalProtein", totalProtein);
    macrosMap.set("totalFat", totalFat);
    macrosMap.set("totalGlucide", totalGlucide);
    macrosMap.set("averageFiber", +(totalFiber / days).toFixed(2));
    macrosMap.set("averageProtein", +(totalProtein / days).toFixed(2));
    macrosMap.set("averageFat", +(totalFat / days).toFixed(2));
    macrosMap.set("averageGlucide", +(totalGlucide / days).toFixed(2));

    return macrosMap;
}

// keys : urine, feces
export function getToilets() {
    if (arrayToilets.length !== 0) {
        sortEntries(arrayToilets);
        return arrayToilets;
    }
    return null;
}

export function getAverageToilets() {
    let totalUrine = 0;
    let totalFeces = 0;
    let days = getNumberOfUniqueDate(arrayToilets);
    let mapToilets = new Map();

    if (arrayToilets.length !== 0) {
        arrayToilets.forEach((data) => {
            totalUrine += data.get("Urine");
            totalFeces += data.get("Transit");
        });
        mapToilets.set("totalUrine", totalUrine);
        mapToilets.set("totalFeces", totalFeces);
        mapToilets.set("averageUrinePerDay", (totalUrine / days).toFixed(2));
        mapToilets.set("averageFecesPerDay", (totalFeces / days).toFixed(2));

        return mapToilets;
    }
    return null;
}

// keys : Date, Glycemie
export function getGlycemia() {
    if (arrayGlycemia.length !== 0) {
        sortEntries(arrayGlycemia);
        return arrayGlycemia;
    }
    return null;
}

// return the average glycemia for the last few days
export function getAverageGlycemia() {
    let total = 0;
    let moyenne = 0;
    let days = getNumberOfUniqueDate(arrayGlycemia)
    let mapAverageGlycemia = new Map();

    if (arrayGlycemia.length !== 0) {
        arrayGlycemia.forEach((data) => {
            total += data.get("Glycémie");
        });
        moyenne = (total / days).toFixed(2);
        mapAverageGlycemia.set("Moyenne", moyenne + " mmol/L");
        mapAverageGlycemia.set("Référence", "4.7 - 6.8 mmol/L");

        return mapAverageGlycemia;
    }
    return null;
}

//Possible keys: date, hour, minute, duration
export function getActivities() {
    if (arrayActivities.length !== 0) {
        sortEntries(arrayActivities);
        return arrayActivities;
    } else {
        return null;
    }
}


export function getAggregateActivities() {
    let totalDuration = 0;
    let totalDays = 0;

    if (arrayActivities.length !== 0) {
        getActivities().forEach((data) => {
            totalDuration = totalDuration + parseInt(data.get('minutes')) + parseInt(data.get('hours') * 60);
            totalDays = totalDays + 1;
        });

        mapAggActivities.set("TotalDuration", formatDuration(totalDuration));
        mapAggActivities.set("AverageDuration", formatDuration(totalDuration / totalDays));

        return mapAggActivities;
    } else {
        return null;
    }
}

//- WEIGHTS - //
//Possible keys: weightUnit, weight
export function getWeights() {
    if (arrayWeights.length !== 0) {
        sortEntries(arrayWeights);
        return arrayWeights;
    } else {
        return null;
    }
}


export function getAggregateWeights() {
    if (arrayWeights.length !== 0) {
        let finalWeight = getWeights()[getWeights().length - 1].get("weight");

        let initialWeight_2 = getWeights()[0].get("weight");
        mapAggWeights.set("initalWeight", initialWeight_2);
        mapAggWeights.set("finalWeight", finalWeight);
        mapAggWeights.set("deltaWeight", (finalWeight - initialWeight_2).toFixed(2));
        mapAggWeights.set("weightUnit", localStorage.getItem("prefUnitePoids"));
        return mapAggWeights;
    } else {
        return null;
    }
}

//- SLEEPs - //
//Possible keys: date, hour, minute, duration, wakeUpQt, wakeUpState
export function getSleeps() {
    if (arraySleeps.length !== 0) {
        sortEntries(arraySleeps);
        return arraySleeps;
    } else {
        return null;
    }
}

export function getAggregateSleeps() {
    if (arraySleeps.length !== 0) {
        let minTotalStartHours = 0;
        let minTotalEndHours = 0;
        let minTotalDuration = 0;
        let totalWakeUp = 0;

        let totalDaysStart = 0;
        let totalDaysEnd = 0;
        let totalDaysDuration = 0;
        let totalDaysWakeUp = 0;

        getSleeps().forEach((data) => {
            if (data.get("startHour")) {
                minTotalStartHours += getDuration(data.get("startHour"));
                totalDaysStart += 1;
            }

            if (data.get("endHour")) {
                minTotalEndHours += getDuration(data.get("endHour"));
                totalDaysEnd += 1
            }

            if (getDuration(data.get("duration")) !== 0) {
                minTotalDuration += getDuration(data.get("duration"));
                totalDaysDuration += 1;
            }
            totalWakeUp += parseInt(data.get("wakeUpQt"));
            totalDaysWakeUp += 1;

        });

        mapAggSleeps.set("averageStartHour", formatDuration(minTotalStartHours / totalDaysStart));
        mapAggSleeps.set("averageEndHour", formatDuration(minTotalEndHours / totalDaysEnd));
        mapAggSleeps.set("averageDuree", formatDuration(minTotalDuration / totalDaysDuration));
        mapAggSleeps.set("averageWakeUpQt", (totalWakeUp / totalDaysWakeUp).toFixed(1));
        return mapAggSleeps;
    } else {
        return null;
    }
}


// sort the entries from the most recent date to the oldest one
// Note : the key containing the date value must be called Date
function sortEntries(arrayToSort) {
    arrayToSort.sort((a, b) => new Date(b.get("Date").replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
        - new Date(a.get("Date").replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")));
}


function getNumberOfUniqueDate(array_aliments) {
    let set_date = new Set();
    array_aliments.forEach((data) => {
        set_date.add(data.get('Date'))
    });
    return set_date.size;
}

// initial date format looks like dd-MM-yyyy (ex : 01-01-2022)
export function formatDate(date) {
    let formatedDate;
    let month;
    let lang = localStorage.getItem("userLanguage");
    const dateFormat = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).dateFormat : null;
    // if dateFormat if specified in user profile, consider it
    if (dateFormat) {
        switch (dateFormat) {
            case "LL-dd-yyyy":
                formatedDate = date.slice(3,5) + "-" + date.slice(0,2) + "-" + date.slice(-4);
                break;
            case "dd-LL-yyyy":
                formatedDate = date;
                break;
            case "yyyy-LL-dd":
                formatedDate = date.slice(-4) + "-" + date.slice(3,5) + "-" + date.slice(0,2);
                break;
            case "yyyy-LLL-dd":
                date = date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
                month = new Date(date).toLocaleString(lang, { month: 'short' });
                formatedDate = date.slice(-4) + "-" + month + "-" + date.slice(3,5);
                break;
            case "dd-LLL-yyyy":
                date = date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
                month = new Date(date).toLocaleString(lang, { month: 'short' });
                formatedDate = date.slice(3,5) + "-" + month + "-" + date.slice(-4);
                break;
            break;
        }
    // else, get date format of the user lang
    } else {
        date = date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
        switch (lang) {
            case "fr":
                formatedDate = new Date(date).toLocaleDateString('fr-FR');
                break;
            case "en":
                formatedDate = new Date(date).toLocaleDateString('en-EN');
                break;
            case "es":
                formatedDate = new Date(date).toLocaleDateString('es-ES');
                break;
            break;
        }
    }
    return formatedDate;
}

//----------TEST--------
export function test_fetchNourriture(array_nourriture, formatedDate) {
    fetchNourriture(array_nourriture, formatedDate);
    return arrayNourriture;
}


export function test_fetchToilets(toilets, formatedDate) {
    fetchToilets(toilets, formatedDate);
    return arrayToilets;
}
export function test_fetchActivites(activites, formatedDate) {
    fetchActivities(activites, formatedDate);
    return arrayActivities;
}
export function test_fetchSleep(sleeps, formatedDate) {
    fetchSleeps(sleeps, formatedDate);
    return arraySleeps;
}

export function test_fetchGlycemia(glycemia, formatedDate) {
    fetchGlycemia(glycemia,formatedDate)
    return arrayGlycemia;
}

export function test_fetchDrinksHydratation(typeOfDrink, drinks, formatedDate) {
    fetchDrinks(typeOfDrink, drinks, formatedDate);
    return arrayHydratations;
}

export function test_fetchDrinksAlcohol(typeOfDrink, drinks, formatedDate) {
    fetchDrinks(typeOfDrink, drinks, formatedDate);
    return arrayAlcohol;
}


export function resetDataArrays() {
    arrayNourriture = [];
    arrayHydratations = [];
    arrayAlcohol = [];
    arraySleeps=[];
    arrayToilets=[];
    arrayActivities=[];
    arrayGlycemia=[];
}

export function test_getNumberOfUniqueDate(array_aliments) {
    return getNumberOfUniqueDate(array_aliments);
}

export function test_sortEntries(arrayToSort) {
    sortEntries(arrayToSort);
}

export function test_formatDuration(min){
    return formatDuration(min);
}

export function test_getDuration(time){
    return getDuration(time);
}


