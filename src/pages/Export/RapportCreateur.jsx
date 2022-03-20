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
                doc.addImage('/assets/Logo2.png', 'png', 10, 2, 78, 20);
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
    let poid = [];
    let headers = [];
    let values = [];
    let unite = "";

    //Entete du tableau
    var Date = translate.getText("DATE_TITLE")
    unite = getAggregateWeights() ? " (" + getAggregateWeights().get('weightUnit') + ")" : unite;
    var poids = translate.getText("EXP_REPORT_WEIGHT") + unite;
    headers.push(Date, poids);

    if (getWeights()) {
        poid = getWeights();

        poid.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('weight')}]);
        });

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
                fillColor: "#bbebe5"
            },
        });
    } else {
        insertHeaders(document, headers, "#113d37");
        insertNoDataFound(document);
    }
}

function addWeightAggregateTable(document) {
    if (getAggregateWeights()) {
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];
        let footerTable = [];

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

        footerTable.push(line_2, line_3, line_4);

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}

function addActivitiesTable(document) {
    let headers = [];
    let values = [];
    var Date = translate.getText("DATE_TITLE")
    var duree = translate.getText("EXP_REPORT_DURATION") + " (h)";
    headers.push(Date, duree);

    if (getActivities()) {
        let activities = getActivities();


        activities.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('duration')}]);
        });

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
    } else {
        insertHeaders(document, headers, "#0f5780");
        insertNoDataFound(document);
    }
}

function addActivitiesAggregateTable(document) {
    if (getAggregateActivities()) {
        let aggregateActivities = getAggregateActivities();

        let line_1 = [];
        let line_2 = [];
        let footerTable = [];

        var durationTitle = translate.getText("EXP_REPORT_MACROS", ["TOTAL"]) + " (h)";
        var totalDuration = aggregateActivities.get("TotalDuration");
        line_1.push(durationTitle, totalDuration);

        var AverageDurationActTitle = translate.getText("EXP_REPORT_AVERAGE_DURATION_ACTIVITY") + " (h)";
        var averageDuration = aggregateActivities.get("AverageDuration");
        line_2.push(AverageDurationActTitle, averageDuration);

        footerTable.push(line_1, line_2);

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}


function addSleepTable(document) {
    let headers = [];
    let values = [];
    var Date = translate.getText("DATE_TITLE")
    var startHour = translate.getText("EXP_REPORT_START_HOUR_SLEEP");
    var endHour = translate.getText("EXP_REPORT_END_HOUR_SLEEP");
    var duration = translate.getText("EXP_REPORT_DURATION") + " (h)";
    var wakeUpQt = translate.getText("EXP_REPORT_WAKEUP_QT_SLEEP");
    var wakeUpState = translate.getText("EXP_REPORT_WAKEUP_STATE");
    headers.push(Date, startHour, endHour, duration, wakeUpQt, wakeUpState);

    if (getSleeps()) {
        let sleeps = getSleeps();
        sleeps.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('startHour')}, {content: data.get('endHour')}, {content: data.get('duration')}, {content: data.get('wakeUpQt')}, {content: data.get('wakeUpState')}]);
        });

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
    } else {
        insertHeaders(document, headers, "#152b3f");
        insertNoDataFound(document);
    }
}


function addSleepAggregateTable(document) {
    if (getAggregateSleeps()) {
        let aggregateSleeps = getAggregateSleeps();

        let line_1 = [];
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];
        let footerTable = [];

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

        footerTable.push(line_1, line_2, line_3, line_4);

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}


function addNourritureTable(document) {
    let headers = [];
    let values = [];
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

    if (getNourriture()) {
        let nourriture = getNourriture();

        nourriture.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Consommation')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
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
            },
        });
    } else {
        insertHeaders(document, headers, "#185742");
        insertNoDataFound(document);
    }
}


function addNourritureMacros(document) {
    if (getMacrosTotalAndAveragePerDay('nourriture')) {
        let nourritureMacros = getMacrosTotalAndAveragePerDay('nourriture');

        let headers = [];
        let line_1 = [];
        let line_2 = [];
        let footerTable = [];

        headers.push(" ", translate.getText("FOOD_MODULE", ['macro_nutriments', 'proteins']),
            translate.getText("FOOD_MODULE", ['macro_nutriments', 'glucides']),
            translate.getText("FOOD_MODULE", ['macro_nutriments', 'fibre']),
            translate.getText("FOOD_MODULE", ['macro_nutriments', 'fats']));

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

        footerTable.push(line_1, line_2);

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
    let headers = [];
    let values = [];

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
    let headers = [];
    let line_1 = [];
    let line_2 = [];
    let footerTable = [];

    headers.push(" ", translate.getText("FOOD_MODULE", ['macro_nutriments', 'proteins']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'glucides']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'fibre']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'fats']));

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

        footerTable.push(line_1, line_2);

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
    let headers = [];
    let values = [];
    var Date = translate.getText("DATE_TITLE")
    var urine = translate.getText("URINE_TITLE");
    var transit = translate.getText("EXP_UR_TR");
    headers.push(Date, urine, transit);

    if (getToilets()) {
        let toilets = getToilets();


        toilets.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Urine')}, {content: data.get('Transit')}]);
        });

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
    } else {
        insertHeaders(document, headers, "#bba339");
        insertNoDataFound(document);
    }
}


function addAverageToiletsTable(document) {
    if (getAverageToilets()) {
        let averageToilets = getAverageToilets();

        let line_1 = [];
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];
        let footerTable = [];

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

        footerTable.push(line_1, line_2, line_3, line_4);

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}

function addAlcoolTable(document) {
    let headers = [];
    let values = [];
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
    let headers = [];
    headers.push(" ", translate.getText("FOOD_MODULE", ['macro_nutriments', 'proteins']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'glucides']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'fibre']),
        translate.getText("FOOD_MODULE", ['macro_nutriments', 'fats']));

    if (getMacrosTotalAndAveragePerDay('alcool')) {
        let alcoolMacros = getMacrosTotalAndAveragePerDay('alcool');

        let line_1 = [];
        let line_2 = [];
        let footerTable = [];


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

        footerTable.push(line_1, line_2);

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

//TODO : fonctions supléments


function addGlycimiaTable(document) {
    let headers = [];
    var Date = translate.getText("DATE_TITLE")
    var glycemie = translate.getText("GLYC_TITLE") + " (mmol/L)";
    headers.push(Date, glycemie);

    if (getGlycemia()) {
        let glycimia = getGlycemia();
        let values = [];

        glycimia.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Glycémie')}]);
        });

        document.autoTable({
            head: [headers],
            body: values,
            startY: document.lastAutoTable.finalY + 15,
            headStyles: {
                fillColor: "#6e233d"
            },
            bodyStyles: {
                minCellHeight: 9,
                halign: "left",
                valign: "center",
                fontSize: 11,
                fillColor: "#ff9bbd"
            },
        });

    } else {
        insertHeaders(document, headers, "#6e233d");
        insertNoDataFound(document);
    }
}


function addAverageGlycimiaTable(document) {
    if (getAverageGlycemia()) {
        let averageGlycemia = getAverageGlycemia();
        let line_1 = [];
        let line_2 = [];
        let footerTable = [];

        var moyenneTitle = translate.getText("EXP_REPORT_DURATION");
        var moyenne = averageGlycemia.get("Moyenne");
        line_1.push(moyenneTitle, moyenne);

        var referenceActTitle = translate.getText("EXP_REF_GLY");
        var reference = averageGlycemia.get("Référence");
        line_2.push(referenceActTitle, reference);

        footerTable.push(line_1, line_2);

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}


function insertNoDataFound(document) {
    document.autoTable({
        body: [[translate.getText("EXP_REPORT_NO_DATA")]],
        startY: document.lastAutoTable.finalY,
        bodyStyles: {
            halign: "center",
            fontSize: 10
        },
    });
}

function insertHeaders(document, headers, headerColor) {
    document.autoTable({
        head: [headers],
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: headerColor
        },
    });
}
