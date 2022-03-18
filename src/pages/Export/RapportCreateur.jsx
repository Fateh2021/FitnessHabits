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
    getAverageGlycemia
} from "./CompilerBilan";

import * as translate from '../../translate/Translator';

export async function creerPdf(date) {
    const doc = new jsPDF();

    // Poids
    doc.text(translate.getText("POIDS_NOM_SECTION"), 10, 20);
    addWeightTable(doc);
    addWeightAggregateTable(doc);

    // Activité physiques
    doc.text(translate.getText("EXPORT_ACTIVITES_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    addActivitiesTable(doc);
    addActivitiesAggregateTable(doc);

    // Sommeil
    doc.text(translate.getText("SLEEP"), 10, doc.lastAutoTable.finalY + 10);
    addSleepTable(doc);
    addSleepAggregateTable(doc);

    doc.text(translate.getText("NOURRITURE_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    addNourritureTable(doc);
    addNourritureMacros(doc);

    doc.text(translate.getText("HYDR_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    addHydratationTable(doc);
    addHydratationMacrosTable(doc);

    doc.text(translate.getText("TOILETS_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    addToiletsTable(doc);
    addAverageToiletsTable(doc);

/*    doc.text(translate.getText("GLYC_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    addGlycimiaTable(doc);
    addAverageGlycimiaTable(doc);*/

    //Finaly save the document
    doc.save("FitnessHabits-data-" + date + ".pdf");

}

function addWeightTable(document) {
    let poid = getWeights();
    let headers = [];
    let values = [];
    let unite = "";

    poid.forEach((data) => {
        values.push([{content: data.get('date')}, {content: data.get('weight')}]);
        unite = data.get('weightUnit');
    });

    //Entete du tableau
    var Date = translate.getText("DATE_TITLE")
    var poids = translate.getText("EXP_REPORT_WEIGHT") + " (" + unite + ")";
    headers.push(Date, poids);


    document.autoTable({
        head: [headers],
        body: values,
        margin: {top: 25},
        headStyles: {
            fillColor: "#113d37"
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: "#75f6e7"
        },
    });
}

function addWeightAggregateTable(document) {
    let line_1 = [];
    let line_2 = [];
    let line_3 = [];
    let line_4 = [];
    let footerTable = [];

    var aggregateWeight = getAggregateWeights();
    //Title Aggregate - Les aggregate
    var aggUnitTitle = translate.getText("EXP_REPORT_UNIT");
    var prefUnitePoids = aggregateWeight.get("prefUnitePoids");
    line_1.push(aggUnitTitle, prefUnitePoids);

    var aggInitialWeight = translate.getText("EXP_REPORT_INITIAL_WEIGHT");
    var initialEeight = aggregateWeight.get("initalWeight");
    line_2.push(aggInitialWeight, initialEeight);

    var aggFinalWeight = translate.getText("EXP_REPORT_FINAL_WEIGHT");
    var finalWeight = aggregateWeight.get("finalWeight");
    line_3.push(aggFinalWeight, finalWeight);

    var aggDifference = translate.getText("EXP_REPORT_DIFF_WEIGHT");
    var difference = aggregateWeight.get("deltaWeight");
    line_4.push(aggDifference, difference);

    footerTable.push(line_1, line_2, line_3, line_4);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });
}

function addActivitiesTable(document) {
    let activities = getActivities();
    let headers = [];
    let values = [];

    activities.forEach((data) => {
        values.push([{content: data.get('date')}, {content: data.get('duration')}]);
    });


    var Date = translate.getText("DATE_TITLE")
    var poids = translate.getText("EXP_REPORT_DURATION");
    headers.push(Date, poids);

    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: "#0f5780"
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: "#7cc8f6"
        },
    });
}

function addActivitiesAggregateTable(document) {
    let aggregateActivities = getAggregateActivities();

    let line_1 = [];
    let line_2 = [];
    let footerTable = [];

    var durantionTitle = translate.getText("EXP_REPORT_DURATION");
    var totalDuration = aggregateActivities.get("TotalDuration");
    line_1.push(durantionTitle, totalDuration);

    var AverageDurationActTitle = translate.getText("EXP_REPORT_AVERAGE_DURATION_ACTIVITY");
    var averageDuration = aggregateActivities.get("AverageDuration");
    line_2.push(AverageDurationActTitle, averageDuration);

    footerTable.push(line_1, line_2);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });
}

function addSleepTable(document) {
    let sleeps = getSleeps();
    let headers = [];
    let values = [];

    sleeps.forEach((data) => {
        values.push([{content: data.get('date')}, {content: data.get('startHour')}, {content: data.get('endHour')}, {content: data.get('duration')}]);
    });


    var Date = translate.getText("DATE_TITLE")
    var startHour = translate.getText("EXP_REPORT_START_HOUR_SLEEP");
    var endHour = translate.getText("EXP_REPORT_END_HOUR_SLEEP");
    var duration = translate.getText("EXP_REPORT_DURATION");
    headers.push(Date, startHour, endHour, duration);


    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: "#152b3f"
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: "#4ca9ff"
        },
    });
}

function addSleepAggregateTable(document) {
    let aggregateSleeps = getAggregateSleeps();

    let line_1 = [];
    let line_2 = [];
    let line_3 = [];
    let line_4 = [];
    let footerTable = [];

    var avgStartHourSleepTitle = translate.getText("EXP_REPORT_AVG_START_HOUR_SLEEP");
    var averageStartHour = aggregateSleeps.get("averageStartHour");
    line_1.push(avgStartHourSleepTitle, averageStartHour);

    var aggInitialWeight = translate.getText("EXP_REPORT_AVG_END_HOUR_SLEEP");
    var averageEndHour = aggregateSleeps.get("averageEndHour");
    line_2.push(aggInitialWeight, averageEndHour);

    var averageDurationSleepTitle = translate.getText("EXP_REPORT_AVG_DURATION_SLEEP");
    var averageDuree = aggregateSleeps.get("averageDuree");
    line_3.push(averageDurationSleepTitle, averageDuree);

    var averageWakeupQtTitle = translate.getText("EXP_REPORT_AVG_WAKEUP_QT");
    var averageWakeUpQt = aggregateSleeps.get("averageWakeUpQt");
    line_4.push(averageWakeupQtTitle, averageWakeUpQt);

    footerTable.push(line_1, line_2, line_3, line_4);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });

}

function addNourritureTable(document) {
    let nourriture = getNourriture();
    let headers = [];
    let values = [];

    nourriture.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
    });


    var Date = translate.getText("DATE_TITLE")
    var name = translate.getText("SUPPL_NOM");
    var consomation = translate.getText("HYD_TEXT_COUNT");
    var quantite = translate.getText("EXP_REPORT_QT");
    var unity = translate.getText("EXP_REPORT_UNIT");
    var proteine = translate.getText("FOOD_MODULE",["macro_nutriments","proteins"]);
    var glucide = translate.getText("FOOD_MODULE",["macro_nutriments","glucides"]);
    var fibre = translate.getText("FOOD_MODULE",["macro_nutriments","fibre"]);
    var gras = translate.getText("FOOD_MODULE",["macro_nutriments","fats"]);
    headers.push(Date, name, consomation, quantite,unity,proteine,glucide,fibre,gras);

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
            fillColor: "#45ffc1"
        },
    });

}

function addNourritureMacros(document) {
    let nourritureMacros = getMacrosTotalAndAveragePerDay('nourriture');

    let line_1 = [];
    let line_2 = [];
    let line_3 = [];
    let line_4 = [];
    let line_5 = [];
    let line_6 = [];
    let line_7 = [];
    let line_8 = [];
    let footerTable = [];

    var totFiberTitle = translate.getText("EXP_REPORT_MACROS",["TOT_FIB"]);
    var totalFiber = nourritureMacros.get("totalFiber");
    line_1.push(totFiberTitle, totalFiber);

    var totProteinTitle = translate.getText("EXP_REPORT_MACROS",["TOT_PROT"]);
    var totalProtein = nourritureMacros.get("totalProtein");
    line_2.push(totProteinTitle, totalProtein);

    var totFatTitle = translate.getText("EXP_REPORT_MACROS",["TOT_FAT"]);
    var totalFat = nourritureMacros.get("totalFat");
    line_3.push(totFatTitle, totalFat);

    var totGlucideTitle = translate.getText("EXP_REPORT_MACROS",["TOT_GLUC"]);
    var totalGlucide = nourritureMacros.get("totalGlucide");
    line_4.push(totGlucideTitle, totalGlucide);

    var avgFiberTitle = translate.getText("EXP_REPORT_MACROS",["AVG_FIB"]);
    var averageFiber = nourritureMacros.get("averageFiber");
    line_5.push(avgFiberTitle, averageFiber);

    var avgProteinTitle = translate.getText("EXP_REPORT_MACROS",["AVG_PROT"]);
    var averageProtein = nourritureMacros.get("averageProtein");
    line_6.push(avgProteinTitle, averageProtein);

    var avgFatTitle = translate.getText("EXP_REPORT_MACROS",["AVG_FAT"]);
    var averageFat = nourritureMacros.get("totalFat");
    line_7.push(avgFatTitle, averageFat);

    var avgGlucideTitle = translate.getText("EXP_REPORT_MACROS",["AVG_GLUC"]);
    var averageGlucide = nourritureMacros.get("totalGlucide");
    line_8.push(avgGlucideTitle, averageGlucide);

    footerTable.push(line_1, line_2, line_3, line_4,line_5,line_6,line_7,line_8);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });

}

function addHydratationTable(document){
 let hydratation = getHydratations();
    let headers = [];
    let values = [];

    hydratation.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
    });


    var Date = translate.getText("DATE_TITLE")
    var name = translate.getText("SUPPL_NOM");
    var consomation = translate.getText("HYD_TEXT_COUNT");
    var quantite = translate.getText("EXP_REPORT_QT");
    var unity = translate.getText("EXP_REPORT_UNIT");
    var proteine = translate.getText("FOOD_MODULE",["macro_nutriments","proteins"]);
    var glucide = translate.getText("FOOD_MODULE",["macro_nutriments","glucides"]);
    var fibre = translate.getText("FOOD_MODULE",["macro_nutriments","fibre"]);
    var gras = translate.getText("FOOD_MODULE",["macro_nutriments","fats"]);
    headers.push(Date, name, consomation, quantite,unity,proteine,glucide,fibre,gras);

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
    });
}

function addHydratationMacrosTable(document){
    let hydratationMacros = getMacrosTotalAndAveragePerDay("hydratation");
    let line_1 = [];
    let line_2 = [];
    let line_3 = [];
    let line_4 = [];
    let line_5 = [];
    let line_6 = [];
    let line_7 = [];
    let line_8 = [];
    let footerTable = [];

    var totFiberTitle = translate.getText("EXP_REPORT_MACROS",["TOT_FIB"]);
    var totalFiber = hydratationMacros.get("totalFiber");
    line_1.push(totFiberTitle, totalFiber);

    var totProteinTitle = translate.getText("EXP_REPORT_MACROS",["TOT_PROT"]);
    var totalProtein = hydratationMacros.get("totalProtein");
    line_2.push(totProteinTitle, totalProtein);

    var totFatTitle = translate.getText("EXP_REPORT_MACROS",["TOT_FAT"]);
    var totalFat = hydratationMacros.get("totalFat");
    line_3.push(totFatTitle, totalFat);

    var totGlucideTitle = translate.getText("EXP_REPORT_MACROS",["TOT_GLUC"]);
    var totalGlucide = hydratationMacros.get("totalGlucide");
    line_4.push(totGlucideTitle, totalGlucide);

    var avgFiberTitle = translate.getText("EXP_REPORT_MACROS",["AVG_FIB"]);
    var averageFiber = hydratationMacros.get("averageFiber");
    line_5.push(avgFiberTitle, averageFiber);

    var avgProteinTitle = translate.getText("EXP_REPORT_MACROS",["AVG_PROT"]);
    var averageProtein = hydratationMacros.get("averageProtein");
    line_6.push(avgProteinTitle, averageProtein);

    var avgFatTitle = translate.getText("EXP_REPORT_MACROS",["AVG_FAT"]);
    var averageFat = hydratationMacros.get("totalFat");
    line_7.push(avgFatTitle, averageFat);

    var avgGlucideTitle = translate.getText("EXP_REPORT_MACROS",["AVG_GLUC"]);
    var averageGlucide = hydratationMacros.get("totalGlucide");
    line_8.push(avgGlucideTitle, averageGlucide);

    footerTable.push(line_1, line_2, line_3, line_4,line_5,line_6,line_7,line_8);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });
}

function addToiletsTable(document){
    //TODO
    let toilets = getToilets();

    console.log(toilets);
}

function addAverageToiletsTable(document){
    //TODO
    let averageToilets = getAverageToilets();

    console.log(averageToilets);
}

/*
function addGlycimiaTable(document){
    //TODO
    let glycimia = getGlycemia();

    console.log(glycimia)
}

function addAverageGlycimiaTable(document){
    //TODO
    let averageGlycimia = getAverageGlycemia();

    console.log(averageGlycimia);
}*/
