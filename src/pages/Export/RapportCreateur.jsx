import {jsPDF} from "jspdf";
import "jspdf-autotable";
import {
    getWeights,
    getAggregateWeights,
    getActivities,
    getAggregateActivities,
    getSleeps,
    getAggregateSleeps,
    getMacrosTotalAndAveragePerDay,
    getNourriture,
    getHydratations,
    getToilets,
    getAverageToilets,
    getGlycemia,
    getAverageGlycemia,
    getAlcohol,
    formatDate,
    test_deleteActualFetchedSleeps,
    test_fetchSleeps
} from "./CompilerBilan";

import * as translate from '../../translate/Translator';
import mockData from './mockDatas.json';//to delete
import JSZip from "jszip";
import {saveAs} from 'file-saver';
import * as CSV from 'csv-string'


export async function creerPdf(dataSelected, d1, d2) {
    const doc = new jsPDF();
    // logo 
    doc.autoTable({
        body: [[' ']],
        alternateRowStyles: {fillColor: "#ffffff"},
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                doc.addImage('/assets/Logo2.png', 'png', 15, 4, 59, 15);
            }
        }
    });
    doc.text(createPeriod(d1, d2), 75, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
        body: [[' ']],
        tableWidth: 'wrap',
        startY: doc.lastAutoTable.finalY + 10,
        alternateRowStyles: {fillColor: "#ffffff"},
    });

    dataSelected.forEach((data) => {
        switch (data) {
            case "hydratation":
                doc.text(translate.getText("HYDR_TITLE"), 10, doc.lastAutoTable.finalY + 10);
                addHydratationTable(doc);
                addHydratationMacrosTable(doc);
                break;
            case "activities":
                doc.text(translate.getText("EXPORT_ACTIVITES_TITLE"), 10, doc.lastAutoTable.finalY + 10);
                addActivitiesTable(doc);
                addActivitiesAggregateTable(doc);
                break;
            case "nourriture":
                doc.text(translate.getText("NOURRITURE_TITLE"), 10, doc.lastAutoTable.finalY + 10);
                addNourritureTable(doc);
                addNourritureMacros(doc);
                break;
            case "sommeil":
                manageSleep(doc);
                break;
            case "toilettes":
                doc.text(translate.getText("TOILETS_TITLE"), 10, doc.lastAutoTable.finalY + 10);
                addToiletsTable(doc);
                addAverageToiletsTable(doc);
                break;
            case "alcool":
                doc.text(translate.getText("ALCOOL_TITLE"), 10, doc.lastAutoTable.finalY + 10);
                addAlcoolTable(doc);
                addAlcoolMacrosTable(doc);
                break;
            case "glycémie":
                doc.text(translate.getText("GLYC_TITLE"), 10, doc.lastAutoTable.finalY + 10);
                addGlycimiaTable(doc);
                addAverageGlycimiaTable(doc);
                break;
            case "poids":
                doc.text(translate.getText("POIDS_NOM_SECTION"), 10, doc.lastAutoTable.finalY + 10);
                addWeightTable(doc);
                addWeightAggregateTable(doc);
                break;
            case "supplements":
                // TODO when it will be implemented
                break;

            default:
                break;
        }
    });

    //Finaly save the document
    doc.save("FitnessHabits-data-" + createPeriod(d1, d2) + ".pdf");

}

function addWeightTable(document) {
    let headers = weightHeaders();
    let values = [];
    let poid = [];
    if (getWeights()) {
        poid = getWeights();

        poid.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('weight')}]);
        });

        addContentWithAutotable(document, headers, values, "#113d37", "#bbebe5");

    } else {
        insertHeaders(document, headers, "#113d37");
        insertNoDataFound(document);
    }
}

function addWeightAggregateTable(document) {
    let footerTable = weightAggrData();
    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}


function addActivitiesTable(document) {
    let headers = activitiesHeaders();
    let values = [];

    if (getActivities()) {
        let activities = getActivities();

        activities.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('duration')}]);
        });

        addContentWithAutotable(document, headers, values, "#0f5780", "#7cc8f6");

    } else {
        insertHeaders(document, headers, "#0f5780");
        insertNoDataFound(document);
    }
}

function addActivitiesAggregateTable(document) {
    let footerTable = activitiesAggrData();
    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}


function manageSleep(doc) {
    //data is a json with all activities
    /*let headers_1 = sleepsHeaders();
    mockData.forEach( (data) => {
        test_deleteActualFetchedSleeps();
        test_fetchSleeps(data.sommeil, "2022-02-01");
    })
    let mockArray = getSleeps()
    addSleepTable(doc, mockArray, headers_1);*/

    doc.text(translate.getText("SLEEP"), 10, doc.lastAutoTable.finalY + 10);
    let headers = sleepsHeaders();
    if(getSleeps()) {
        addSleepTable(doc, getSleeps(), headers);
        addSleepAggregateTable(doc);
    } else {
        insertHeaders(document, headers, "#152b3f");
        insertNoDataFound(document);
    }
}

export function addSleepTable(document, sleeps, headers) {
    let values = [];
    sleeps.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('startHour')}, {content: data.get('endHour')}, {content: data.get('duration')}, {content: data.get('wakeUpQt')}, {content: data.get('wakeUpState')}]);
    });

    addContentWithAutotable(document, headers, values, "#152b3f", "#4ca9ff");
}

function addSleepAggregateTable(document) {
    let footerTable = sleepAggrData();

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}


function addNourritureTable(document) {
    let headers = nourritureHydratAlcoolHeadres();
    let values = [];

    if (getNourriture()) {
        let nourriture = getNourriture();

        nourriture.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
        });

        document.autoTable({
            head: [headers],
            body: values,
            startY: document.lastAutoTable.finalY + 15,
            headStyles: {
                fillColor: "#185742"
            },
            bodyStyles: {
                minCellHeight: 9,
                halign: "left",
                valign: "center",
                fontSize: 11,
                fillColor: "#b4ead8"
            },
            columnStyles: {
                4: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                5: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                6: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                7: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
        });
    } else {
        insertHeaders(document, headers, "#185742");
        insertNoDataFound(document);
    }
}


function addNourritureMacros(document) {


    let headers = nourritureHydraAlcoolAggrHeaders();
    let footerTable = nourritureAggrData();
    if (footerTable.length != 0) {
        document.autoTable({
            head: [headers],
            headStyles: {
                fillColor: "#185742"
            },
            columnStyles: {
                1: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                2: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                3: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                4: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
            body: footerTable,
            tableWidth: 'wrap'
        });
    }
}


function addHydratationTable(document) {
    let headers = nourritureHydratAlcoolHeadres();

    let values = [];

    if (getHydratations()) {
        let hydratation = getHydratations();


        hydratation.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
        });

        document.autoTable({
            head: [headers],
            body: values,
            startY: document.lastAutoTable.finalY + 15,
            headStyles: {
                fillColor: "#65afc5"
            },
            bodyStyles: {
                minCellHeight: 9,
                halign: "left",
                valign: "center",
                fontSize: 11,
                fillColor: "#beecff"
            },
            columnStyles: {
                5: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                6: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                7: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                8: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            }
        });
    } else {
        insertHeaders(document, headers, "#65afc5");
        insertNoDataFound(document);
    }
}


function addHydratationMacrosTable(document) {
    let headers = nourritureHydraAlcoolAggrHeaders();
    let footerTable = hydratationAggrData();
    if (footerTable.length != 0) {

        document.autoTable({
            head: [headers],
            headStyles: {
                fillColor: "#65afc5"
            },
            columnStyles: {
                1: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                2: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                3: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                4: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
            body: footerTable,
            tableWidth: 'wrap'
        });
    }
}


function addToiletsTable(document) {
    let headers = toiletteHeadres();
    let values = [];

    if (getToilets()) {
        let toilets = getToilets();

        toilets.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Urine')}, {content: data.get('Transit')}]);
        });

        addContentWithAutotable(document, headers, values, "#bba339", "#ffea9a");

    } else {
        insertHeaders(document, headers, "#bba339");
        insertNoDataFound(document);
    }
}


function addAverageToiletsTable(document) {
    let footerTable = toiletteAggrData();
    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}

function addAlcoolTable(document) {
    let headers = nourritureHydratAlcoolHeadres();
    let values = [];

    if (getAlcohol()) {
        let alcool = getAlcohol();

        alcool.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
        });

        document.autoTable({
            head: [headers],
            body: values,
            startY: document.lastAutoTable.finalY + 15,
            headStyles: {
                fillColor: "#e7a54f"
            },
            bodyStyles: {
                minCellHeight: 9,
                halign: "left",
                valign: "center",
                fontSize: 11,
                fillColor: "#ffd39b"
            },
            columnStyles: {
                5: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                6: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                7: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                8: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            }
        });
    } else {
        insertHeaders(document, headers, "#e7a54f");
        insertNoDataFound(document);
    }
}


function addAlcoolMacrosTable(document) {
    let headers = nourritureHydraAlcoolAggrHeaders();
    let footerTable = alcoolAggrData();
    if (footerTable.length != 0) {

        document.autoTable({
            head: [headers],
            headStyles: {
                fillColor: "#e7a54f"
            },
            columnStyles: {
                1: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                2: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                3: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                4: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
            body: footerTable,
            tableWidth: 'wrap'
        });
    }
}

//TODO : fonctions supléments (not implemented yet)


function addGlycimiaTable(document) {
    let headers = glycimiaHeaders();
    if (getGlycemia()) {
        let glycimia = getGlycemia();
        let values = [];

        glycimia.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Glycémie')}]);
        });

        addContentWithAutotable(document, headers, values, "#6e233d", "#ff9bbd");

    } else {
        insertHeaders(document, headers, "#6e233d");
        insertNoDataFound(document);
    }
}


function addAverageGlycimiaTable(document) {
    let footerTable = glycimiaAggrData();
    if (footerTable.length != 0) {

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}

export function addContentWithAutotable(document, headers, values, headerColor, bodyColor) {
    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: headerColor
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: bodyColor
        },
    });
}

export function insertNoDataFound(document) {
    document.autoTable({
        body: [[translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE")]],
        startY: document.lastAutoTable.finalY,
        bodyStyles: {
            halign: "center",
            fontSize: 10
        },
    });
}

export function insertHeaders(document, headers, headerColor) {
    document.autoTable({
        head: [headers],
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: headerColor
        },
    });
}


/**
 * format two dates as a period.
 * @param d1 the first date.
 * @param d2 the seconde date.
 * @returns {string} the period.
 */
function createPeriod(d1, d2) {
    let temp_d1 = d1.toISOString().slice(0, 10);
    let temp_d2 = d2.toISOString().slice(0, 10);
    d1 = temp_d1.slice(-2) + '-' + temp_d1.slice(5, 7) + '-' + temp_d1.slice(0, 4);
    d2 = temp_d2.slice(-2) + '-' + temp_d2.slice(5, 7) + '-' + temp_d2.slice(0, 4);

    let date = translate.getText("DE") + " " + formatDate(d1) + " " + translate.getText("A")
        + " " + formatDate(d2);
    return date;
}

function weightHeaders() {
    let unite = "";
    var Date = translate.getText("DATE_TITLE")
    unite = getAggregateWeights() ? " (" + getAggregateWeights().get('weightUnit') + ")" : unite;
    var poids = translate.getText("EXP_REPORT_WEIGHT") + unite;
    return [Date, poids];
}

function weightAggrData() {
    let weightAggrTable = [];
    if (getAggregateWeights()) {
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];

        var aggregateWeight = getAggregateWeights();

        var aggInitialWeight = translate.getText("EXP_REPORT_INITIAL_WEIGHT");
        var initialEeight = aggregateWeight.get("initalWeight");
        line_2.push(aggInitialWeight, initialEeight);

        var aggFinalWeight = translate.getText("EXP_REPORT_FINAL_WEIGHT");
        var finalWeight = aggregateWeight.get("finalWeight");
        line_3.push(aggFinalWeight, finalWeight);

        var aggDifference = translate.getText("EXP_REPORT_DIFF_WEIGHT");
        var difference = aggregateWeight.get("deltaWeight");
        line_4.push(aggDifference, difference);

        weightAggrTable.push(line_2, line_3, line_4);
    }
    return weightAggrTable;
}

function activitiesHeaders() {
    var Date = translate.getText("DATE_TITLE");
    var duree = translate.getText("EXP_REPORT_DURATION") + " (h)";
    return [Date, duree];
}

function activitiesAggrData() {
    let activitiesAggrTable = []
    if (getAggregateActivities()) {
        let aggregateActivities = getAggregateActivities();

        let line_1 = [];
        let line_2 = [];

        var durationTitle = translate.getText("EXP_REPORT_MACROS", ["TOTAL"]) + " (h)";
        var totalDuration = aggregateActivities.get("TotalDuration");
        line_1.push(durationTitle, totalDuration);

        var AverageDurationActTitle = translate.getText("EXP_REPORT_AVERAGE_DURATION_ACTIVITY") + " (h)";
        var averageDuration = aggregateActivities.get("AverageDuration");
        line_2.push(AverageDurationActTitle, averageDuration);

        activitiesAggrTable.push(line_1, line_2);
    }
    return activitiesAggrTable;
}

export function sleepsHeaders() {
    var Date = translate.getText("DATE_TITLE");
    var startHour = translate.getText("EXP_REPORT_START_HOUR_SLEEP");
    var endHour = translate.getText("EXP_REPORT_END_HOUR_SLEEP");
    var duration = translate.getText("EXP_REPORT_DURATION") + " (h)";
    var wakeUpQt = translate.getText("EXP_REPORT_WAKEUP_QT_SLEEP");
    var wakeUpState = translate.getText("EXP_REPORT_WAKEUP_STATE");
    return [Date, startHour, endHour, duration, wakeUpQt, wakeUpState];
}

function sleepAggrData() {
    let sleepAggrTable = [];
    if (getAggregateSleeps()) {
        let aggregateSleeps = getAggregateSleeps();

        let line_1 = [];
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];


        var avgStartHourSleepTitle = translate.getText("EXP_REPORT_AVG_START_HOUR_SLEEP");
        var averageStartHour = aggregateSleeps.get("averageStartHour");
        line_1.push(avgStartHourSleepTitle, averageStartHour);

        var aggInitialHour = translate.getText("EXP_REPORT_AVG_END_HOUR_SLEEP");
        var averageEndHour = aggregateSleeps.get("averageEndHour");
        line_2.push(aggInitialHour, averageEndHour);

        var averageDurationSleepTitle = translate.getText("EXP_REPORT_AVG_DURATION_SLEEP");
        var averageDuree = aggregateSleeps.get("averageDuree");
        line_3.push(averageDurationSleepTitle, averageDuree);

        var averageWakeupQtTitle = translate.getText("EXP_REPORT_AVG_WAKEUP_QT");
        var averageWakeUpQt = aggregateSleeps.get("averageWakeUpQt");
        line_4.push(averageWakeupQtTitle, averageWakeUpQt);

        sleepAggrTable.push(line_1, line_2, line_3, line_4);

    }
    return sleepAggrTable;
}

function nourritureHydratAlcoolHeadres() {
    var Date = translate.getText("DATE_TITLE")
    var name = translate.getText("SUPPL_NOM");
    var quantite = translate.getText("EXP_REPORT_QT");
    var unity = translate.getText("EXP_REPORT_UNIT");
    var proteine = translate.getText("FOOD_MODULE", ["macro_nutriments", "proteins"]);
    var glucide = translate.getText("FOOD_MODULE", ["macro_nutriments", "glucides"]);
    var fibre = translate.getText("FOOD_MODULE", ["macro_nutriments", "fibre"]);
    var gras = translate.getText("FOOD_MODULE", ["macro_nutriments", "fats"]);
    return [Date, name, quantite, unity, proteine, glucide, fibre, gras];
}

function nourritureHydraAlcoolAggrHeaders() {
    let headers = [];
    headers.push(" ", translate.getText("FOOD_MODULE", ['macro_nutriments', 'proteins']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'glucides']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'fibre']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'fats']));
    return headers;
}

function hydratationAggrData() {

    let line_1 = [];
    let line_2 = [];
    let dataTable = [];
    if (getMacrosTotalAndAveragePerDay('hydratation')) {
        let hydratationMacros = getMacrosTotalAndAveragePerDay('hydratation');

        var totalFiber = hydratationMacros.get("totalFiber");
        var averageFiber = hydratationMacros.get("averageFiber");

        var totalProtein = hydratationMacros.get("totalProtein");
        var averageProtein = hydratationMacros.get("averageProtein");

        var totalFat = hydratationMacros.get("totalFat");
        var averageFat = hydratationMacros.get("averageFat");

        var totalGlucide = hydratationMacros.get("totalGlucide");
        var averageGlucide = hydratationMacros.get("averageGlucide");

        line_1.push(translate.getText("EXP_REPORT_MACROS", ["TOTAL"]), totalProtein, totalGlucide, totalFiber, totalFat);
        line_2.push(translate.getText("EXP_REPORT_MACROS", ["AVG"]), averageProtein, averageGlucide, averageFiber, averageFat);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}

function nourritureAggrData() {
    let dataTable = [];
    if (getMacrosTotalAndAveragePerDay('nourriture')) {
        let nourritureMacros = getMacrosTotalAndAveragePerDay('nourriture');
        let line_1 = [];
        let line_2 = [];

        var totalFiber = nourritureMacros.get("totalFiber");
        var averageFiber = nourritureMacros.get("averageFiber");

        var totalProtein = nourritureMacros.get("totalProtein");
        var averageProtein = nourritureMacros.get("averageProtein");

        var totalFat = nourritureMacros.get("totalFat");
        var averageFat = nourritureMacros.get("averageFat");

        var totalGlucide = nourritureMacros.get("totalGlucide");
        var averageGlucide = nourritureMacros.get("averageGlucide");

        line_1.push(translate.getText("EXP_REPORT_MACROS", ["TOTAL"]), totalProtein, totalGlucide, totalFiber, totalFat);
        line_2.push(translate.getText("EXP_REPORT_MACROS", ["AVG"]), averageProtein, averageGlucide, averageFiber, averageFat);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}

function toiletteHeadres() {
    var Date = translate.getText("DATE_TITLE")
    var urine = translate.getText("URINE_TITLE");
    var transit = translate.getText("EXP_UR_TR");
    return [Date, urine, transit];
}

function toiletteAggrData() {
    let dataTable = [];
    if (getAverageToilets()) {
        let averageToilets = getAverageToilets();

        let line_1 = [];
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];

        var totFecesTitle = translate.getText("EXP_UR_TR");
        var totalFeces = averageToilets.get("totalFeces");
        line_1.push(totFecesTitle, totalFeces);

        var totUrineTitle = translate.getText("EXP_TOT_UR");
        var totalUrine = averageToilets.get("totalUrine");
        line_2.push(totUrineTitle, totalUrine);

        var averageFecesPerDayTitle = translate.getText("EXP_AVG_TRA");
        var averageFecesPerDay = averageToilets.get("averageFecesPerDay");
        line_3.push(averageFecesPerDayTitle, averageFecesPerDay);

        var averageUrinePerDayTitle = translate.getText("EXP_AVG_UR");
        var averageUrinePerDay = averageToilets.get("averageUrinePerDay");
        line_4.push(averageUrinePerDayTitle, averageUrinePerDay);

        dataTable.push(line_1, line_2, line_3, line_4);
    }
    return dataTable;
}

function alcoolAggrData() {
    let dataTable = [];
    if (getMacrosTotalAndAveragePerDay('alcool')) {
        let alcoolMacros = getMacrosTotalAndAveragePerDay('alcool');
        let line_1 = [];
        let line_2 = [];
        var totalFiber = alcoolMacros.get("totalFiber");
        var averageFiber = alcoolMacros.get("averageFiber");

        var totalProtein = alcoolMacros.get("totalProtein");
        var averageProtein = alcoolMacros.get("averageProtein");

        var totalFat = alcoolMacros.get("totalFat");
        var averageFat = alcoolMacros.get("averageFat");

        var totalGlucide = alcoolMacros.get("totalGlucide");
        var averageGlucide = alcoolMacros.get("averageGlucide");

        line_1.push(translate.getText("EXP_REPORT_MACROS", ["TOTAL"]), totalProtein, totalGlucide, totalFiber, totalFat);
        line_2.push(translate.getText("EXP_REPORT_MACROS", ["AVG"]), averageProtein, averageGlucide, averageFiber, averageFat);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}

function glycimiaHeaders() {
    var Date = translate.getText("DATE_TITLE");
    var glycemie = translate.getText("GLYC_TITLE") + " (mmol/L)";
    return [Date, glycemie];
}

function glycimiaAggrData() {
    let dataTable = [];
    if (getAverageGlycemia()) {
        let averageGlycemia = getAverageGlycemia();
        let line_1 = [];
        let line_2 = [];

        var moyenneTitle = translate.getText("EXP_REPORT_DURATION");
        var moyenne = averageGlycemia.get("Moyenne");
        line_1.push(moyenneTitle, moyenne);

        var referenceActTitle = translate.getText("EXP_REF_GLY");
        var reference = averageGlycemia.get("Référence");
        line_2.push(referenceActTitle, reference);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}

/**
 * PARTIE CSV
 */
export function creerCSV(dataSelected, d1, d2) {
    var zip = new JSZip();
    var date = createPeriod(d1, d2);

    dataSelected.forEach((data) => {
        switch (data) {
            case "hydratation":
                hydratationCSV(zip, date);
                hydratationAggrCSV(zip, date);
                break;
            case "activities":
                activitiesCSV(zip, date);
                activitiesAggrCSV(zip, date);
                break;
            case "nourriture":
                nourritureCSV(zip, date);
                nourritureAggrCSV(zip, date);
                break;
            case "sommeil":
                sleepsCSV(zip, date);
                sleepAggrCSV(zip, date);
                break;
            case "toilettes":
                toiletteCSV(zip, date);
                toiletteAggrCSV(zip, date);
                break;
            case "alcool":
                alcoolCSV(zip, date);
                alcoolAggrCSV(zip, date);
                break;
            case "glycémie":
                glycimiaCSV(zip, date);
                glycimiaAggrCSV(zip, date);
                break;
            case "poids":
                weightCSV(zip, date);
                weightAggrCSV(zip, date);
                break;
            case "supplements":
                // TODO
                break;
            default:
                break;
        }
    });
    zip.generateAsync({type: "blob"}).then(function (content) {

        saveAs(content, 'FitnessHabits-data-' + createPeriod(d1, d2) + ".zip");
    });
}

function weightCSV(zip, date) {
    if (getWeights()) {
        let poid = getWeights();
        let values = [];
        let headers = weightHeaders();
        let poidData = headers[0] + ", " + headers[1];

        poid.forEach((data) => {
            poidData += "\n" + data.get('Date') + ", " + data.get('weight');
        });
        zip.file(translate.getText("EXP_REPORT_WEIGHT") + " - " + date.replaceAll('/', '-') + ".csv", poidData, {binary: true});
    } else {
        zip.file(translate.getText("EXP_REPORT_WEIGHT") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function weightAggrCSV(zip, date) {
    if (weightAggrData().length != 0) {
        let data = CSV.stringify(weightAggrData());
        zip.file(translate.getText("EXP_REPORT_WEIGHT") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function activitiesCSV(zip, date) {
    if (getActivities()) {
        let activities = getActivities();
        let headers = activitiesHeaders();
        let values = [];
        values.push(headers);

        activities.forEach((data) => {
            values.push([data.get('Date'), data.get('duration')]);
        });
        zip.file(translate.getText("EXPORT_ACTIVITES_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("EXPORT_ACTIVITES_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function activitiesAggrCSV(zip, date) {
    if (activitiesAggrData().length != 0) {
        let data = CSV.stringify(activitiesAggrData());
        zip.file(translate.getText("EXPORT_ACTIVITES_TITLE") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function sleepsCSV(zip, date) {
    if (getSleeps()) {
        let sleeps = getSleeps();
        let headers = sleepsHeaders();
        let values = [];
        values.push(headers);
        sleeps.forEach((data) => {
            values.push([data.get('Date'), data.get('startHour'), data.get('endHour'), data.get('duration'), data.get('wakeUpQt'), data.get('wakeUpState')]);
        });
        zip.file(translate.getText("SLEEP") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("SLEEP") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function sleepAggrCSV(zip, date) {
    if (sleepAggrData().length != 0) {
        let data = CSV.stringify(sleepAggrData());
        zip.file(translate.getText("SLEEP") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function nourritureCSV(zip, date) {
    if (getNourriture()) {
        let nourriture = getNourriture();
        let headers = nourritureHydratAlcoolHeadres();
        let values = [];
        values.push(headers);
        nourriture.forEach((data) => {
            values.push([data.get('Date'), data.get('Nom'), data.get('Consommation'), data.get('Quantité'), data.get('Unité'), data.get('Protéine'), data.get('Glucide'), data.get('Fibre'), data.get('Gras')]);
        });
        zip.file(translate.getText("NOURRITURE_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("NOURRITURE_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function nourritureAggrCSV(zip, date) {
    if (nourritureAggrData().length != 0) {
        let data = CSV.stringify([nourritureHydraAlcoolAggrHeaders(), nourritureAggrData()]);
        zip.file(translate.getText("NOURRITURE_TITLE") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function hydratationCSV(zip, date) {
    if (getHydratations()) {
        let hydratation = getHydratations();
        let headers = nourritureHydratAlcoolHeadres();
        let values = [];
        values.push(headers);

        hydratation.forEach((data) => {
            values.push([data.get('Date'), data.get('Nom'), data.get('Consommation'), data.get('Quantité'), data.get('Unité'), data.get('Protéine'), data.get('Glucide'), data.get('Fibre'), data.get('Gras')]);
        });
        zip.file(translate.getText("HYDR_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("HYDR_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function hydratationAggrCSV(zip, date) {
    if (hydratationAggrData().length != 0) {
        let data = CSV.stringify([nourritureHydraAlcoolAggrHeaders(), hydratationAggrData()]);
        zip.file(translate.getText("HYDR_TITLE") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function toiletteCSV(zip, date) {
    if (getToilets()) {
        let toilets = getToilets();
        let headers = toiletteHeadres();
        let values = [];
        values.push(headers);

        toilets.forEach((data) => {
            values.push([data.get('Date'), data.get('Urine'), data.get('Transit')]);
        });
        zip.file(translate.getText("TOILETS_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("TOILETS_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function toiletteAggrCSV(zip, date) {
    if (toiletteAggrData().length != 0) {
        let data = CSV.stringify(toiletteAggrData());
        zip.file(translate.getText("TOILETS_TITLE") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function alcoolCSV(zip, date) {
    if (getAlcohol()) {
        let alcool = getAlcohol();
        let headers = nourritureHydratAlcoolHeadres();
        let values = [];
        values.push(headers);
        alcool.forEach((data) => {
            values.push([data.get('Date'), data.get('Nom'), data.get('Consommation'), data.get('Quantité'), data.get('Unité'), data.get('Protéine'), data.get('Glucide'), data.get('Fibre'), data.get('Gras')]);
        });
        zip.file(translate.getText("ALCOOL_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("ALCOOL_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function alcoolAggrCSV(zip, date) {
    if (alcoolAggrData().length != 0) {
        let data = CSV.stringify([nourritureHydraAlcoolAggrHeaders(), alcoolAggrData()]);
        zip.file(translate.getText("ALCOOL_TITLE") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

function glycimiaCSV(zip, date) {
    if (getGlycemia()) {
        let glycimia = getGlycemia();
        let headers = glycimiaHeaders();
        let values = [];
        values.push(headers);

        glycimia.forEach((data) => {
            values.push([data.get('Date'), data.get('Glycémie')]);
        });
        zip.file(translate.getText("GLYC_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", CSV.stringify(values), {binary: true});
    } else {
        zip.file(translate.getText("GLYC_TITLE") + " - " + date.replaceAll('/', '-') + ".csv", translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

function glycimiaAggrCSV(zip, date) {
    if (glycimiaAggrData().length != 0) {
        let data = CSV.stringify(glycimiaAggrData());
        zip.file(translate.getText("GLYC_TITLE") + "_ag - " + date.replaceAll('/', '-') + ".csv", data, {binary: true});
    }
}

// pour les tests
export function tests() {
    const temppdf = new jsPDF();
    const tempzip = new JSZip();
    const tempdate = createPeriod(new Date(), new Date("2022-03-25"));
    temppdf.autoTable({
        body: [[' ']]
    });
    insertNoDataFound(temppdf);
    insertHeaders(temppdf, [" "], "#ffffff");

    weightHeaders();
    weightAggrData();
    activitiesHeaders();
    activitiesAggrData();
    sleepsHeaders();
    sleepAggrData();
    nourritureHydratAlcoolHeadres();
    nourritureHydraAlcoolAggrHeaders();
    hydratationAggrData();
    nourritureAggrData();
    toiletteHeadres();
    toiletteAggrData();
    alcoolAggrData();
    glycimiaHeaders();
    glycimiaAggrData();
    weightCSV(tempzip, tempdate);
    weightAggrCSV(tempzip, tempdate);
    activitiesCSV(tempzip, tempdate);
    activitiesAggrCSV(tempzip, tempdate);
    sleepsCSV(tempzip, tempdate);
    sleepAggrCSV(tempzip, tempdate);
    nourritureAggrCSV(tempzip, tempdate);
    hydratationAggrCSV(tempzip, tempdate);
    toiletteCSV(tempzip, tempdate);
    toiletteAggrCSV(tempzip, tempdate);
    glycimiaCSV(tempzip, tempdate);
    glycimiaAggrCSV(tempzip, tempdate);
}

