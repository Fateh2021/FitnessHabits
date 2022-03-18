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
    getAlcohol
} from "./CompilerBilan";

import * as translate from '../../translate/Translator';

export async function creerPdf(date, dataSelected) {
    const doc = new jsPDF();

    // logo
    doc.autoTable({
        body: [[' ']],
        alternateRowStyles: {fillColor: "#ffffff"},
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                var image = new Image();
                image.src = '/assets/Logo2.png';
                console.log(image);
                doc.addImage(image.src,'png',10,2,78,20);
            }
        }
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
                doc.text(translate.getText("SLEEP"), 10, doc.lastAutoTable.finalY + 10);
                addSleepTable(doc);
                addSleepAggregateTable(doc);
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
                // TODO
                break;

            default:
                break;
        }
    });

    //Finaly save the document
    doc.save("FitnessHabits-data-" + date + ".pdf");

}

function addWeightTable(document) {
    let poid = getWeights();
    let headers = [];
    let values = [];
    let unite = "";

    poid.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('weight')}]);
        unite = data.get('weightUnit');
    });

    //Entete du tableau
    var Date = translate.getText("DATE_TITLE")
    var poids = translate.getText("EXP_REPORT_WEIGHT") + " (" + unite + ")";
    headers.push(Date, poids);


    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
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
        values.push([{content: data.get('Date')}, {content: data.get('duration')}]);
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
        values.push([{content: data.get('Date')}, {content: data.get('startHour')}, {content: data.get('endHour')}, {content: data.get('duration')}]);
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
    var proteine = translate.getText("FOOD_MODULE", ["macro_nutriments", "proteins"]);
    var glucide = translate.getText("FOOD_MODULE", ["macro_nutriments", "glucides"]);
    var fibre = translate.getText("FOOD_MODULE", ["macro_nutriments", "fibre"]);
    var gras = translate.getText("FOOD_MODULE", ["macro_nutriments", "fats"]);
    headers.push(Date, name, consomation, quantite, unity, proteine, glucide, fibre, gras);

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
        columnStyles:{
            5 : {
                fillColor: "#a52a2a",
                textColor: "#ffffff"
            },
            6 : {
                fillColor: "#db4e3e",
                textColor: "#ffffff"
            },
            7 : {
                fillColor: "#589051",
                textColor: "#ffffff"
            },
            8 : {
                fillColor : "#c99b2e",
                textColor : "#ffffff"
            }
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

    var totFiberTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_FIB"]);
    var totalFiber = nourritureMacros.get("totalFiber");
    line_1.push(totFiberTitle, totalFiber);

    var totProteinTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_PROT"]);
    var totalProtein = nourritureMacros.get("totalProtein");
    line_2.push(totProteinTitle, totalProtein);

    var totFatTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_FAT"]);
    var totalFat = nourritureMacros.get("totalFat");
    line_3.push(totFatTitle, totalFat);

    var totGlucideTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_GLUC"]);
    var totalGlucide = nourritureMacros.get("totalGlucide");
    line_4.push(totGlucideTitle, totalGlucide);

    var avgFiberTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_FIB"]);
    var averageFiber = nourritureMacros.get("averageFiber");
    line_5.push(avgFiberTitle, averageFiber);

    var avgProteinTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_PROT"]);
    var averageProtein = nourritureMacros.get("averageProtein");
    line_6.push(avgProteinTitle, averageProtein);

    var avgFatTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_FAT"]);
    var averageFat = nourritureMacros.get("totalFat");
    line_7.push(avgFatTitle, averageFat);

    var avgGlucideTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_GLUC"]);
    var averageGlucide = nourritureMacros.get("totalGlucide");
    line_8.push(avgGlucideTitle, averageGlucide);

    footerTable.push(line_1, line_2, line_3, line_4, line_5, line_6, line_7, line_8);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });

}

function addHydratationTable(document) {
    let hydratation = getHydratations();
    let headers = [];
    let values = [];

    hydratation.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
    });


    var Date = translate.getText("DATE_TITLE");
    var name = translate.getText("SUPPL_NOM");
    var consomation = translate.getText("HYD_TEXT_COUNT");
    var quantite = translate.getText("EXP_REPORT_QT");
    var unity = translate.getText("EXP_REPORT_UNIT");
    var proteine = translate.getText("FOOD_MODULE", ["macro_nutriments", "proteins"]);
    var glucide = translate.getText("FOOD_MODULE", ["macro_nutriments", "glucides"]);
    var fibre = translate.getText("FOOD_MODULE", ["macro_nutriments", "fibre"]);
    var gras = translate.getText("FOOD_MODULE", ["macro_nutriments", "fats"]);
    headers.push(Date, name, consomation, quantite, unity, proteine, glucide, fibre, gras);

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
        columnStyles:{
            5 : {
                fillColor: "#a52a2a",
                textColor: "#ffffff"
            },
            6 : {
                fillColor: "#db4e3e",
                textColor: "#ffffff"
            },
            7 : {
                fillColor: "#589051",
                textColor: "#ffffff"
            },
            8 : {
                fillColor : "#c99b2e",
                textColor : "#ffffff"
            }
        }
    });
}

function addHydratationMacrosTable(document) {
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

    var totFiberTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_FIB"]);
    var totalFiber = hydratationMacros.get("totalFiber");
    line_1.push(totFiberTitle, totalFiber);

    var totProteinTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_PROT"]);
    var totalProtein = hydratationMacros.get("totalProtein");
    line_2.push(totProteinTitle, totalProtein);

    var totFatTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_FAT"]);
    var totalFat = hydratationMacros.get("totalFat");
    line_3.push(totFatTitle, totalFat);

    var totGlucideTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_GLUC"]);
    var totalGlucide = hydratationMacros.get("totalGlucide");
    line_4.push(totGlucideTitle, totalGlucide);

    var avgFiberTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_FIB"]);
    var averageFiber = hydratationMacros.get("averageFiber");
    line_5.push(avgFiberTitle, averageFiber);

    var avgProteinTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_PROT"]);
    var averageProtein = hydratationMacros.get("averageProtein");
    line_6.push(avgProteinTitle, averageProtein);

    var avgFatTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_FAT"]);
    var averageFat = hydratationMacros.get("totalFat");
    line_7.push(avgFatTitle, averageFat);

    var avgGlucideTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_GLUC"]);
    var averageGlucide = hydratationMacros.get("totalGlucide");
    line_8.push(avgGlucideTitle, averageGlucide);

    footerTable.push(line_1, line_2, line_3, line_4, line_5, line_6, line_7, line_8);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });
}

function addToiletsTable(document) {
    //TODO
    let toilets = getToilets();
    let headers = [];
    let values = [];

    toilets.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('Urine')}, {content: data.get('Transit')}]);
    });


    var Date = translate.getText("DATE_TITLE")
    var urine = translate.getText("URINE_TITLE");
    var transit = translate.getText("EXP_UR_TR");
    headers.push(Date, urine, transit);

    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: "#bba339"
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: "#ffea9a"
        },
    });
}

function addAverageToiletsTable(document) {
    //TODO
    let averageToilets = getAverageToilets();

    let line_1 = [];
    let line_2 = [];
    let line_3 = [];
    let line_4 = [];
    let footerTable = [];

    var totFecesTitle = translate.getText("EXP_TOT_FEC");
    var totalFeces = averageToilets.get("totalFeces");
    line_1.push(totFecesTitle, totalFeces);

    var totUrineTitle = translate.getText("EXP_TOT_UR");
    var totalUrine = averageToilets.get("totalUrine");
    line_2.push(totUrineTitle, totalUrine);

    var averageFecesPerDayTitle = translate.getText("EXP_AVG_FEC");
    var averageFecesPerDay = averageToilets.get("averageFecesPerDay");
    line_3.push(averageFecesPerDayTitle, averageFecesPerDay);

    var averageUrinePerDayTitle = translate.getText("EXP_AVG_UR");
    var averageUrinePerDay = averageToilets.get("averageUrinePerDay");
    line_4.push(averageUrinePerDayTitle, averageUrinePerDay);

    footerTable.push(line_1, line_2, line_3, line_4);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });
}

//TODO : fonctions alcool
function addAlcoolTable(document){
    let alcool = getAlcohol();
    let headers = [];
    let values = [];

    alcool.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
    });


    var Date = translate.getText("DATE_TITLE")
    var name = translate.getText("SUPPL_NOM");
    var consomation = translate.getText("HYD_TEXT_COUNT");
    var quantite = translate.getText("EXP_REPORT_QT");
    var unity = translate.getText("EXP_REPORT_UNIT");
    var proteine = translate.getText("FOOD_MODULE", ["macro_nutriments", "proteins"]);
    var glucide = translate.getText("FOOD_MODULE", ["macro_nutriments", "glucides"]);
    var fibre = translate.getText("FOOD_MODULE", ["macro_nutriments", "fibre"]);
    var gras = translate.getText("FOOD_MODULE", ["macro_nutriments", "fats"]);
    headers.push(Date, name, consomation, quantite, unity, proteine, glucide, fibre, gras);

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
        columnStyles:{
            5 : {
                fillColor: "#a52a2a",
                textColor: "#ffffff"
            },
            6 : {
                fillColor: "#db4e3e",
                textColor: "#ffffff"
            },
            7 : {
                fillColor: "#589051",
                textColor: "#ffffff"
            },
            8 : {
                fillColor : "#c99b2e",
                textColor : "#ffffff"
            }
        }
    });
}

function addAlcoolMacrosTable(document){
    let alcoolMacros = getMacrosTotalAndAveragePerDay("alcool")
    let line_1 = [];
    let line_2 = [];
    let line_3 = [];
    let line_4 = [];
    let line_5 = [];
    let line_6 = [];
    let line_7 = [];
    let line_8 = [];
    let footerTable = [];

    var totFiberTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_FIB"]);
    var totalFiber = alcoolMacros.get("totalFiber");
    line_1.push(totFiberTitle, totalFiber);

    var totProteinTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_PROT"]);
    var totalProtein = alcoolMacros.get("totalProtein");
    line_2.push(totProteinTitle, totalProtein);

    var totFatTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_FAT"]);
    var totalFat = alcoolMacros.get("totalFat");
    line_3.push(totFatTitle, totalFat);

    var totGlucideTitle = translate.getText("EXP_REPORT_MACROS", ["TOT_GLUC"]);
    var totalGlucide = alcoolMacros.get("totalGlucide");
    line_4.push(totGlucideTitle, totalGlucide);

    var avgFiberTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_FIB"]);
    var averageFiber = alcoolMacros.get("averageFiber");
    line_5.push(avgFiberTitle, averageFiber);

    var avgProteinTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_PROT"]);
    var averageProtein = alcoolMacros.get("averageProtein");
    line_6.push(avgProteinTitle, averageProtein);

    var avgFatTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_FAT"]);
    var averageFat = alcoolMacros.get("totalFat");
    line_7.push(avgFatTitle, averageFat);

    var avgGlucideTitle = translate.getText("EXP_REPORT_MACROS", ["AVG_GLUC"]);
    var averageGlucide = alcoolMacros.get("totalGlucide");
    line_8.push(avgGlucideTitle, averageGlucide);

    footerTable.push(line_1, line_2, line_3, line_4, line_5, line_6, line_7, line_8);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap'
    });
}

//TODO : fonctions supléments

function addGlycimiaTable(document){
    //TODO
    //let glycimia = getGlycemia();

    //console.log(glycimia)
}

function addAverageGlycimiaTable(document){
    let averageGlycimia = getAverageGlycemia();
    let line_1 = [];
    let line_2 = [];
    let footerTable = [];

    var moyenneTitle = translate.getText("EXP_REPORT_DURATION");
    var moyenne = averageGlycimia["Moyenne"];
    line_1.push(moyenneTitle, moyenne);

    var referenceActTitle = translate.getText("EXP_REF_GLY");
    var reference = averageGlycimia["Référence"];
    line_2.push(referenceActTitle, reference);

    footerTable.push(line_1, line_2);

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        startY: document.lastAutoTable.finalY + 20, // temporaire. à enlever quand Glycémie fonctionne.
    });
}
