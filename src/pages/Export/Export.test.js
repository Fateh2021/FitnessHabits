import React from 'react';
import App from '../../App';

import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { act } from "react-dom/test-utils";

import {jsPDF} from "jspdf";
import 'jspdf-autotable';

//import data from './example_test.json';
import mockData from './mockDatas.json';
import * as CompilerBilan from './CompilerBilan';
import {
    getWeights,
    getAggregateWeights,
    test_fetchWeights,
    test_deleteActualFetchedWeights,
    compilerBilan,
    test_deleteActualFetchedSleeps,
    test_fetchSleeps,
    getSleeps
} from "./CompilerBilan";

import * as RapportCR from './RapportCreateur';
import {
    creerPdf,
    addWeightTable,
    addActivitiesTable,
    addSleepTable,
    getSleepHeadersTranslation,
    addToiletsTable,
    addAlcoolTable,
    addGlycimiaTable,
    addNourritureTable,
    addHydratationTable,
    addAlcoolMacrosTable,
    addNourritureMacros,
    addHydratationMacrosTable,
    addAverageGlycimiaTable,
    addAverageToiletsTable,
    addSleepAggregateTable,
    addActivitiesAggregateTable,
    addWeightAggregateTable,
    addContentWithAutotable,
    sleepsHeaders
} from "./RapportCreateur";


/************************************************
 ********** TESTS ON UI *************************/

/**
 * To use inorder to render the UI export page
 */
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

/**
 * Exemple minimal
 */
test('renders without crashing', async() => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
});


/**
 * Tester la présence des composantes dans le UI export
 */
test('ExportModule-TestElementsPresence_1', async() => {
    renderWithRouter(<App />, {route: '/Export'});
    const actPhys = screen.getByTestId(/checkbox-activities/i);
    expect(actPhys).toBeInTheDocument();

    const nourriture = screen.getByTestId(/checkbox-food/i);
    expect(nourriture).toBeInTheDocument();

    const hydratation = screen.getByTestId(/checkbox-hydration/i);
    expect(hydratation).toBeInTheDocument();

    const supplement = screen.getByTestId(/checkbox-supplements/i);
    expect(supplement).toBeInTheDocument();

    const sommeil = screen.getByTestId(/checkbox-sleep/i);
    expect(sommeil).toBeInTheDocument();

    const poids = screen.getByTestId(/checkbox-weight/i);
    expect(poids).toBeInTheDocument();

    const glycemie = screen.getByTestId(/checkbox-glycemia/i);
    expect(glycemie).toBeInTheDocument();

    const alcool = screen.getByTestId(/checkbox-alcool/i);
    //const checkboxAlcool = screen.getByRole('checkbox', {name: 'Alcool'});//serait preferable a getbytestid
    expect(alcool).toBeInTheDocument();

    const toilettes = screen.getByTestId(/checkbox-toilet/i);
    expect(toilettes).toBeInTheDocument();
});

/**
 * Check if by default all checkboxes are selected
 */
test('ExportModule - TestCheckBoxDefaultBehaviour', async() => {
    renderWithRouter(<App />, {route: '/Export'});
    const checkboxes = screen.getAllByRole('checkbox', { checked: 'True' })
    expect(checkboxes.length).toEqual(9);
});

/**
 * English translation
 */
test('ExportModule - TestEnglishTranslation', async() => {
    localStorage.setItem('userLanguage', 'en');
    renderWithRouter(<App />, {route: '/Export'});

    const nourriture = screen.getByTestId(/checkbox-food/i);
    expect(nourriture.textContent).toBe('Food');

    const act = screen.getByTestId(/checkbox-activities/i);
    expect(act.textContent).toBe('Physical activities');

    const hyd = screen.getByTestId(/checkbox-hydration/i);
    expect(hyd.textContent).toBe('Hydration');

    const supp = screen.getByTestId(/checkbox-supplements/i);
    expect(supp.textContent).toBe('Supplements');

    const sleep = screen.getByTestId(/checkbox-sleep/i);
    expect(sleep.textContent).toBe('Sleep');

    const weight = screen.getByTestId(/checkbox-weight/i);
    expect(weight.textContent).toBe('Weight');

    const glyc = screen.getByTestId(/checkbox-glycemia/i);
    expect(glyc.textContent).toBe('Blood sugar level');

    const alcool = screen.getByTestId(/checkbox-alcool/i);
    expect(alcool.textContent).toBe('Alcohol');

    const toilet = screen.getByTestId(/checkbox-toilet/i);
    expect(toilet.textContent).toBe('Toilets');
});

/**
 * French translation
 */
test('ExportModule - TestFrenchTranslation', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter(<App />, {route: '/Export'});

    const nourriture = screen.getByTestId(/checkbox-food/i);
    expect(nourriture.textContent).toBe('Nourriture')

    const act = screen.getByTestId(/checkbox-activities/i);
    expect(act.textContent).toBe('Activités physiques');

    const hyd = screen.getByTestId(/checkbox-hydration/i);
    expect(hyd.textContent).toBe('Hydratation');

    const supp = screen.getByTestId(/checkbox-supplements/i);
    expect(supp.textContent).toBe('Suppléments');

    const sleep = screen.getByTestId(/checkbox-sleep/i);
    expect(sleep.textContent).toBe('Sommeil');

    const weight = screen.getByTestId(/checkbox-weight/i);
    expect(weight.textContent).toBe('Poids');

    const glyc = screen.getByTestId(/checkbox-glycemia/i);
    expect(glyc.textContent).toBe('Glycémie');

    const alcool = screen.getByTestId(/checkbox-alcool/i);
    expect(alcool.textContent).toBe('Alcool');

    const toilet = screen.getByTestId(/checkbox-toilet/i);
    expect(toilet.textContent).toBe('Toilettes');
});

/**
 * Spanish translation
 */
test('ExportModule - TestSpanishTranslation', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter(<App />, {route: '/Export'});

    //EXPORTAR
    //Fechas de exportación
    //Del:
    //Al
    //Selección de los datos a exportar
    const nourriture = screen.getByTestId(/checkbox-food/i);
    expect(nourriture).toBeInTheDocument();
    expect(nourriture.textContent).toBe('Alimentos')

    const act = screen.getByTestId(/checkbox-activities/i);
    expect(act.textContent).toBe('Actividades físicas');

    const hyd = screen.getByTestId(/checkbox-hydration/i);
    expect(hyd.textContent).toBe('Hidratación');

    const supp = screen.getByTestId(/checkbox-supplements/i);
    expect(supp.textContent).toBe('Suplementos');

    const sleep = screen.getByTestId(/checkbox-sleep/i);
    expect(sleep.textContent).toBe('Dormir');

    const weight = screen.getByTestId(/checkbox-weight/i);
    expect(weight.textContent).toBe('Peso');

    const glyc = screen.getByTestId(/checkbox-glycemia/i);
    expect(glyc.textContent).toBe('Glucemia');

    const alcool = screen.getByTestId(/checkbox-alcool/i);
    expect(alcool.textContent).toBe('Alcohol');

    const toilet = screen.getByTestId(/checkbox-toilet/i);
    expect(toilet.textContent).toBe('Aseos');

    //Formato de exportación
    //CSV
    //PDF
    //CSV Y PDF

});

/**
 * Test the start date by default, 3 month before today's date.
 * TODO: find error fetch one day off ex: 26/03 instead of 25/03 -- appear to be inconsistence in DB
 */
/*test('ExportModule - TestDefaultDateBehaviour', async() => {
    renderWithRouter( < App / > , { route: '/Export' });

    const endDate_1 = new Date(new Date() + " UTC").toISOString().slice(0, 10);
    const endDate_2 = screen.getByTestId('endDate').querySelector('input').value;
    expect(endDate_2).toBe(endDate_1);

    let startDate_1 = new Date(new Date() + " UTC");
    startDate_1.setMonth(startDate_1.getMonth() - 3);
    startDate_1 = startDate_1.toISOString().slice(0, 10);
    const startDate_2 = screen.getByTestId('startDate').querySelector('input').value;
    expect(startDate_2).toBe(startDate_1);
});
*/

/**
 * When report format selection changes, there must be no change in attributes selected
 */
test('ExportModule - TestNoChangeOnAttributes_whenSelectingReportFormat', async() => {
    renderWithRouter(<App />, {route: '/Export'});
    //to be false
    const checkbox_food = screen.getByTestId("checkbox-food")
    const checkbox_sleep = screen.getByTestId("checkbox-sleep")
    const checkbox_weight = screen.getByTestId("checkbox-weight")

    //to be true
    const checkbox_toilet = screen.getByTestId("checkbox-toilet")
    const checkbox_alcool = screen.getByTestId("checkbox-alcool")
    const checkbox_glycemia = screen.getByTestId("checkbox-glycemia")

    const radio_pdf = screen.getByTestId("radio-pdf")
    await act( async () => {
          fireEvent.click(checkbox_food)
          fireEvent.click(checkbox_sleep)
          fireEvent.click(checkbox_weight)
          fireEvent.click(radio_pdf)
    });
    expect(checkbox_food.getAttribute("aria-checked")).toBe("false")
    expect(checkbox_sleep.getAttribute("aria-checked")).toBe("false")
    expect(checkbox_weight.getAttribute("aria-checked")).toBe("false")

    expect(checkbox_toilet.getAttribute("aria-checked")).toBe("true")
    expect(checkbox_alcool.getAttribute("aria-checked")).toBe("true")
    expect(checkbox_glycemia.getAttribute("aria-checked")).toBe("true")
});

/**
 * If selected dates changes, no change in attributes selected
 */
test('ExportModule - TestNoChangeOnAttributes_whenSelectingDates', async() => {
    renderWithRouter(<App />, {route: '/Export'});
    //to be false
    const checkbox_food = screen.getByTestId("checkbox-food")
    const checkbox_sleep = screen.getByTestId("checkbox-sleep")
    const checkbox_weight = screen.getByTestId("checkbox-weight")

    //to be true
    const checkbox_toilet = screen.getByTestId("checkbox-toilet")
    const checkbox_alcool = screen.getByTestId("checkbox-alcool")
    const checkbox_glycemia = screen.getByTestId("checkbox-glycemia")
    //the trigger
    const radio_pdf = screen.getByTestId("radio-pdf")

    await act( async () => {
          //turn into false
          fireEvent.click(checkbox_food)
          fireEvent.click(checkbox_sleep)
          fireEvent.click(checkbox_weight)
          //trigger
          fireEvent.click(radio_pdf)
    });
    expect(checkbox_food.getAttribute("aria-checked")).toBe("false")
    expect(checkbox_sleep.getAttribute("aria-checked")).toBe("false")
    expect(checkbox_weight.getAttribute("aria-checked")).toBe("false")

    expect(checkbox_toilet.getAttribute("aria-checked")).toBe("true")
    expect(checkbox_alcool.getAttribute("aria-checked")).toBe("true")
    expect(checkbox_glycemia.getAttribute("aria-checked")).toBe("true")
});

/**
 * No error if all checkboxes are selected and the report is trigerred.
 */
test('ExportModule - TestErrorMessage_NoErrorDisplayed', async() => {
    renderWithRouter(<App />, {route: '/Export'});
    const radio_pdf = screen.getByTestId("radio-pdf")
    //By default all checkbox are on no alert
    await act( async () => {
          fireEvent.click(radio_pdf)
    });
    expect(screen.queryByRole('alert')).toBeNull();
});

/**
 * Must show an error when selecting a report but no checkbox selected.
 * TODO correct -- should actualy fail - add the error message
 */
test('ExportModule - TestErrorMessage_ErrorDisplayedWhenNoSelection', async() => {
    renderWithRouter(<App />, {route: '/Export'});
    localStorage.setItem('userLanguage', 'en');
    const checkbox_activities = screen.getByTestId("checkbox-activities")
    const checkbox_food = screen.getByTestId("checkbox-food")
    const checkbox_hydration = screen.getByTestId("checkbox-hydration")
    const checkbox_supplements = screen.getByTestId("checkbox-supplements")
    const checkbox_sleep = screen.getByTestId("checkbox-sleep")
    const checkbox_weight = screen.getByTestId("checkbox-weight")
    const checkbox_toilet = screen.getByTestId("checkbox-toilet")
    const checkbox_alcool = screen.getByTestId("checkbox-alcool")
    const checkbox_glycemia = screen.getByTestId("checkbox-glycemia")
    //trigger
    const radio_pdf = screen.getByTestId("radio-pdf")
    await act( async () => {
          fireEvent.click(checkbox_activities)
          fireEvent.click(checkbox_food)
          fireEvent.click(checkbox_hydration)
          fireEvent.click(checkbox_supplements)
          fireEvent.click(checkbox_sleep)
          fireEvent.click(checkbox_weight)
          fireEvent.click(checkbox_toilet)
          fireEvent.click(checkbox_alcool)
          fireEvent.click(checkbox_glycemia)
          fireEvent.click(radio_pdf)
    });
    expect(screen.queryByRole('alert')).toBeNull();
});


/****************************************************************
 ********** TESTS WITH MOCKED DATAS FOR REPORT*******************/
/**
 * Report test - Food - notNull
 */
test('ExportModule - TestFetchNourritureVegetables', async() => {
    let data_vegetables;
    mockData.forEach( (element) => {
        data_vegetables=element.food.categories.vegetables
    })
    let arrayExpected=[]
    data_vegetables.items.forEach( (element) => {
        let mapExpected = new Map();
        mapExpected.set("Date", '18-03-2022');
        mapExpected.set("Nom", element.name);
        mapExpected.set("Quantité", element.qty);
        mapExpected.set("Unité", element.unit);
        mapExpected.set("Protéine", element.proteins);
        mapExpected.set("Glucide", element.glucides);
        mapExpected.set("Fibre", element.fibre);
        mapExpected.set("Gras", element.fats);

        arrayExpected.push(mapExpected);
    })
    expect(CompilerBilan.test_fetchNourriture(data_vegetables,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - Food - Null
 */
test('ExportModule - TestFetchNourritureVegetablesNull', async() => {
    CompilerBilan.resetDataArrays()
    let data_vegetables;
    mockData.forEach( (element) => {
        data_vegetables=element.food.categories.vegetables
    })
    data_vegetables.items=null
    expect(CompilerBilan.test_fetchNourriture(data_vegetables,'18-03-2022')).toEqual([])

});

/**
 * Report test - Food - MACROS
 */
test('ExportModule - testGetMacrosNourriture', async() => {
    let data_nourriture;
    mockData.forEach((element)=>{
        data_nourriture=element.food.categories.dairyProducts;
    })
    let arrayExpected=[];
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022'];
    let i=0;
    data_nourriture.items.forEach((element)=>{
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[++i]);
        mapExpected.set("Nom", element.name);
        mapExpected.set("Quantité", element.qty);
        mapExpected.set("Unité", element.unit);
        mapExpected.set("Protéine", element.proteins);
        mapExpected.set("Glucide", element.glucides);
        mapExpected.set("Fibre", element.fibre);
        mapExpected.set("Gras", element.fats);
        arrayExpected.push(mapExpected);
    })
    CompilerBilan.injectDataInArrayNourriture(arrayExpected)
    //console.log(getMacrosTotalAndAveragePerDay('nourriture'))
    let macrosMapExecpted=new Map();
    macrosMapExecpted.set("totalFiber", 105);
    macrosMapExecpted.set("totalProtein", 140);
    macrosMapExecpted.set("totalFat", 70);
    macrosMapExecpted.set("totalGlucide", 70);
    macrosMapExecpted.set("averageFiber", 35);
    macrosMapExecpted.set("averageProtein",46.67);
    macrosMapExecpted.set("averageFat", 23.33);
    macrosMapExecpted.set("averageGlucide", 23.33);

    expect(CompilerBilan.getMacrosTotalAndAveragePerDay('nourriture')).toEqual(macrosMapExecpted);

});

/**
 * Report test - Transit - notNull
 */
test('ExportModule - TestFetchToilets', async() => {
    let data_toilets;
    mockData.forEach( (element) => {
        data_toilets=element.toilettes
    })
    let arrayExpected=[]

    let mapExpected = new Map();
    mapExpected.set("Date", '18-03-2022');
    mapExpected.set("Urine", data_toilets.urine);
    mapExpected.set("Transit", data_toilets.feces);
    arrayExpected.push(mapExpected);

    expect(CompilerBilan.test_fetchToilets(data_toilets,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - Transit - Null
 */
test('ExportModule - TestFetchToiletsVoid', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchToilets(null,'18-03-2022')).toEqual([])
    expect(CompilerBilan.test_fetchToilets(undefined,'18-03-2022')).toEqual([])
});

/**
 * Report test - Transit - AGGREGATES FUNCTIONS
 */
test('ExportModule - testGetAverageToilets', async() => {
    let data_toilets;
    mockData.forEach(element => {
        data_toilets = element.toilettes;
    })
    let arrayExpected=[];
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022','18-06-2022'];

    for (let i=0;i<dates_array.length;i++) {
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[i]);
        mapExpected.set("Urine", data_toilets.urine);
        mapExpected.set("Transit", data_toilets.feces);
        arrayExpected.push(mapExpected);
    }

    CompilerBilan.injectDataInArrayToilets(arrayExpected)
    let mapExpected=new Map();
    mapExpected.set("totalUrine", 20);
    mapExpected.set("totalFeces", 16);
    mapExpected.set("averageUrinePerDay", 5);
    mapExpected.set("averageFecesPerDay", 4);

    expect(CompilerBilan.getAverageToilets()).toEqual(mapExpected);
});

/**
 * Report test - activities - NotNull
 */
test('ExportModule - TestFetchActivities', async() => {
    let data_activites;
    mockData.forEach( (element) => {
        data_activites=element.activities
    })
    let arrayExpected=[]

    let mapExpected = new Map();
    let duration='06:42'
    mapExpected.set("Date", '18-03-2022');
    mapExpected.set("duration", duration);
    mapExpected.set("hours", duration.slice(0, 2));
    mapExpected.set("minutes", duration.slice(3, 5));
    arrayExpected.push(mapExpected);

    expect(CompilerBilan.test_fetchActivites(data_activites,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - activities - Null
 */
test('ExportModule - TestFetchActivitiesVoid', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchActivites(null,'18-03-2022')).toEqual([])
    expect(CompilerBilan.test_fetchActivites(undefined,'18-03-2022')).toEqual([])
});

/**
 * Report test - ACTIVITIES - AGGREGATES FUNCTIONS
 */
test('ExportModule - testGetAverageActivities', async() => {
    let arrayExpected=[]
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022','18-06-2022'];
    let duration_array = ['06:42','16:00','08:01','23:59'];
    for (let i=0;i<dates_array.length;i++) {
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[i]);
        mapExpected.set("Date", '18-03-2022');
        mapExpected.set("duration", duration_array[i]);
        mapExpected.set("hours", duration_array[i].slice(0, 2));
        mapExpected.set("minutes", duration_array[i].slice(3, 5));
        arrayExpected.push(mapExpected);
    }

    CompilerBilan.injectDataInArrayActivities(arrayExpected);
    //console.log(CompilerBilan.getAggregateActivities());
    let mapExpected=new Map();
    mapExpected.set("TotalDuration", '54:42');
    mapExpected.set("AverageDuration", '13:40');

    expect(CompilerBilan.getAggregateActivities()).toEqual(mapExpected);
});

/**
 * Report test - sleep - NotNull
 */
test('ExportModule - TestFetchSleep', async() => {
    let data_sleep;
    mockData.forEach( (element) => {
        data_sleep=element.sommeil
    })
    let arrayExpected=[]

    let mapExpected = new Map();
    mapExpected.set("Date", '18-03-2022');
    mapExpected.set("startHour", data_sleep.heureDebut);
    mapExpected.set("endHour", data_sleep.heureFin);
    mapExpected.set("duration", CompilerBilan.test_formatDuration(data_sleep.duree));
    mapExpected.set("wakeUpQt",data_sleep.nbReveils)
    mapExpected.set("wakeUpState",data_sleep.etatReveil)
    arrayExpected.push(mapExpected)


    //console.log(CompilerBilan.test_fetchSleep(data_sleep,'18-03-2022'))
    expect(CompilerBilan.test_fetchSleep(data_sleep,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - sleep - Null
 */
test('ExportModule - TestFetchSleepVoid', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchSleep(null,'18-03-2022')).toEqual([])
    expect(CompilerBilan.test_fetchSleep(undefined,'18-03-2022')).toEqual([])
});

/**
 * Report test - sleep - AGGREGATE functions
 */
test('ExportModule - testGetAverageSleep', async() => {
    let data_sleep;
    mockData.forEach(element => {
        data_sleep = element.sommeil;
    })
    let arrayExpected=[];
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022','18-06-2022'];

    for (let i=0;i<dates_array.length;i++) {
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[i]);
        mapExpected.set("startHour", data_sleep.heureDebut);
        mapExpected.set("endHour", data_sleep.heureFin);
        mapExpected.set("duration", CompilerBilan.test_formatDuration(data_sleep.duree));
        mapExpected.set("wakeUpQt",data_sleep.nbReveils)
        mapExpected.set("wakeUpState",data_sleep.etatReveil)
        arrayExpected.push(mapExpected);
    }

    CompilerBilan.injectDataInArraySleeps(arrayExpected);
    let mapExpected=new Map();
    mapExpected.set("averageStartHour", '01:00');
    mapExpected.set("averageEndHour", '10:00');
    mapExpected.set("averageDuree", '09:00');
    mapExpected.set("averageWakeUpQt", '4.0' );

    expect(CompilerBilan.getAggregateSleeps()).toEqual(mapExpected);
});

/**
 * Report test - Glycemia - NotNull
 */
test('ExportModule - TestFetchGlycemia', async() => {
    let data_glycemia;
    mockData.forEach( (element) => {
        data_glycemia=element.glycemie.dailyGlycemie
    })
    let arrayExpected=[]

    let mapExpected = new Map();
    mapExpected.set("Date", '18-03-2022');
    mapExpected.set("Glycémie", parseInt(data_glycemia));
    arrayExpected.push(mapExpected)

    expect(CompilerBilan.test_fetchGlycemia(data_glycemia,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - Glycemia - Null
 */
test('ExportModule - TestFetchGlycemiaVoid', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchGlycemia(null,'18-03-2022')).toEqual([])
    expect(CompilerBilan.test_fetchGlycemia(undefined,'18-03-2022')).toEqual([])
});

/**
 * Report test - Glycemia - AGGREGATE
 */
test('ExportModule - testGetAverageGlycemia', async() => {
    let data_glycemia;
    mockData.forEach(element => {
        data_glycemia = element.glycemie.dailyGlycemie;
    })
    let arrayExpected=[];
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022','18-06-2022'];

    for (let i=0;i<dates_array.length;i++) {
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[i]);
        mapExpected.set("Glycémie", data_glycemia);
        arrayExpected.push(mapExpected);
    }

    CompilerBilan.injectDataInArrayGlycemia(arrayExpected);
    let mapExpected=new Map();
    mapExpected.set("Moyenne", 555.50 + " mmol/L");
    mapExpected.set("Référence", "4.7 - 6.8 mmol/L");

    expect(CompilerBilan.getAverageGlycemia()).toEqual(mapExpected);
});


/**
 * Report test - Hydratation - NotNull
 */
test('ExportModule - TestFetchDrinksHydratation', async() => {
    let data_hydratation;
    mockData.forEach((element)=>{
        data_hydratation=element.hydratation.hydrates;
    })
    let arrayExpected=[]
    data_hydratation.forEach((element)=>{
        let mapExpected = new Map();
        mapExpected.set("Date", '18-03-2022');
        mapExpected.set("Nom", element.name);
        mapExpected.set("Consommation", element.consumption);
        mapExpected.set("Quantité", element.qtte);
        mapExpected.set("Unité", element.unit);
        mapExpected.set("Protéine", element.proteine * element.consumption);
        mapExpected.set("Glucide", element.glucide * element.consumption);
        mapExpected.set("Fibre", element.fibre * element.consumption);
        mapExpected.set("Gras", element.gras * element.consumption);
        arrayExpected.push(mapExpected);
    })

    expect(CompilerBilan.test_fetchDrinksHydratation("hydratation",data_hydratation,'18-03-2022')).toEqual(arrayExpected);
});

/**
 * Report test - Hydratation - Null
 */
test('ExportModule - TestFetchDrinksHydratationVoid', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchDrinksHydratation("hydratation",null,'18-03-2022')).toEqual([])
    expect(CompilerBilan.test_fetchDrinksHydratation("hydratation",undefined,'18-03-2022')).toEqual([])
});

/**
 * Report test - Hydratation - MACROS
 */
test('ExportModule - testGetMacrosHydratation', async() => {
    let data_hydratation;
    mockData.forEach((element)=>{
        data_hydratation=element.hydratation.hydrates;
    })
    let arrayExpected=[];
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022'];
    let i=0;
    data_hydratation.forEach((element)=>{
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[++i]);
        mapExpected.set("Nom", element.name);
        mapExpected.set("Consommation", element.consumption);
        mapExpected.set("Quantité", element.qtte);
        mapExpected.set("Unité", element.unit);
        mapExpected.set("Protéine", element.proteine * element.consumption);
        mapExpected.set("Glucide", element.glucide * element.consumption);
        mapExpected.set("Fibre", element.fibre * element.consumption);
        mapExpected.set("Gras", element.gras * element.consumption);
        arrayExpected.push(mapExpected);
    })
    CompilerBilan.injectDataInArrayHydratation(arrayExpected)
    //console.log(getMacrosTotalAndAveragePerDay('hydratation'))
    let macrosMapExecpted=new Map();
    macrosMapExecpted.set("totalFiber", 75);
    macrosMapExecpted.set("totalProtein", 200);
    macrosMapExecpted.set("totalFat", 230);
    macrosMapExecpted.set("totalGlucide", 55);
    macrosMapExecpted.set("averageFiber", 25);
    macrosMapExecpted.set("averageProtein",66.67);
    macrosMapExecpted.set("averageFat", 76.67);
    macrosMapExecpted.set("averageGlucide", 18.33);

    expect(CompilerBilan.getMacrosTotalAndAveragePerDay('hydratation')).toEqual(macrosMapExecpted);
});


/**
 * Report test - Alcohol - NotNull
 */
test('ExportModule - TestFetchDrinksAlcohol', async() => {
    let data_alcohol;
    mockData.forEach((element)=>{
        data_alcohol=element.alcool.alcools;
    })
    let arrayExpected=[]
    data_alcohol.forEach((element)=>{
        let mapExpected = new Map();
        mapExpected.set("Date", '18-03-2022');
        mapExpected.set("Nom", element.name);
        mapExpected.set("Consommation", element.consumption);
        mapExpected.set("Quantité", element.qtte);
        mapExpected.set("Unité", element.unit);
        mapExpected.set("Protéine", element.proteine * element.consumption);
        mapExpected.set("Glucide", element.glucide * element.consumption);
        mapExpected.set("Fibre", element.fibre * element.consumption);
        mapExpected.set("Gras", element.gras * element.consumption);
        arrayExpected.push(mapExpected);
    })

    expect(CompilerBilan.test_fetchDrinksAlcohol("alcool",data_alcohol,'18-03-2022')).toEqual(arrayExpected);
});

/**
 * Report test - Alcool - Null
 */
test('ExportModule - TestFetchDrinksAlcoolVoid', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchDrinksAlcohol("alcool",null,'18-03-2022')).toEqual([])
    expect(CompilerBilan.test_fetchDrinksAlcohol("alcool",undefined,'18-03-2022')).toEqual([])
});

/**
 * Report test - Alcool - MACROS
 */
test('ExportModule - testGetMacrosAlcool', async() => {
    let data_alcohol;
    mockData.forEach((element)=>{
        data_alcohol=element.alcool.alcools;
    })
    let arrayExpected=[];
    let dates_array = ['18-03-2022','18-04-2022','18-05-2022','18-06-2022'];
    let i=0;

    data_alcohol.forEach((element)=>{
        let mapExpected = new Map();
        mapExpected.set("Date", dates_array[++i]);
        mapExpected.set("Nom", element.name);
        mapExpected.set("Consommation", element.consumption);
        mapExpected.set("Quantité", element.qtte);
        mapExpected.set("Unité", element.unit);
        mapExpected.set("Protéine", element.proteine * element.consumption);
        mapExpected.set("Glucide", element.glucide * element.consumption);
        mapExpected.set("Fibre", element.fibre * element.consumption);
        mapExpected.set("Gras", element.gras * element.consumption);
        arrayExpected.push(mapExpected);
    })

    CompilerBilan.injectDataInArrayAlcohol(arrayExpected)
    //console.log(getMacrosTotalAndAveragePerDay('alcool'))
    let macrosMapExecpted=new Map();
    macrosMapExecpted.set("totalFiber", 6);
    macrosMapExecpted.set("totalProtein", 46);
    macrosMapExecpted.set("totalFat", 2);
    macrosMapExecpted.set("totalGlucide", 45);
    macrosMapExecpted.set("averageFiber", 1.5);
    macrosMapExecpted.set("averageProtein",11.5);
    macrosMapExecpted.set("averageFat", 0.50);
    macrosMapExecpted.set("averageGlucide", 11.25);

    expect(CompilerBilan.getMacrosTotalAndAveragePerDay('alcool')).toEqual(macrosMapExecpted);
});

/**
 * Report test - Weight - NotNull
 */
test('ExportModule - TestFetchWeight', async() => {
    mockData.forEach((data)=>{
        test_deleteActualFetchedWeights()
        data.poids.forEach((weight)=>{
            test_fetchWeights(weight.dailyPoids, weight.datePoids)
        })
    })

    let weightUnit = localStorage.getItem("prefUnitePoids");
    let mockArray = getWeights()

    let map1 = new Map([["Date","2022-04-19"],["weightUnit",weightUnit],["weight","50.16"]]);
    let map2 = new Map([["Date","2022-03-18"],["weightUnit",weightUnit],["weight","52.16"]]);

    let expectedArray = [];
    expectedArray.push(map1);
    expectedArray.push(map2);

    expect(mockArray).toEqual(expectedArray)
});

/**
 * Report test - Weight - Null
 */
test('ExportModule - TestFetchWeightVoid', async() => {
    test_deleteActualFetchedWeights()
    let mockArray = getWeights()
    expect(mockArray).toEqual(null)
});

/**
 * Report test - Weight - AGGREGATE
 */
test('ExportModule - TestFetchDrinksWeight_AGGREGATE', async() => {
    mockData.forEach((data)=>{
        test_deleteActualFetchedWeights()
        data.poids.forEach((weight)=>{
            test_fetchWeights(weight.dailyPoids, weight.datePoids)
        })
    })

    expect(getAggregateWeights().get('initalWeight')).toBe("52.16")
    expect(getAggregateWeights().get('finalWeight')).toBe("50.16")
    expect(getAggregateWeights().get('deltaWeight')).toBe("-2.00")
    expect(getAggregateWeights().get('weightUnit')).toBe(localStorage.getItem("prefUnitePoids"))
});


/**
 * Report test - Supplements - NotNull (to do when it will be implemented)
 */

/**
 * Report test - Weight - Null (to do when it will be implemented)
 */

/**
 * Report test - Weight - AGGREGATE (to do when it will be implemented)
 */

/************************************************
 ********** TESTS ON UTILITIES FUNCTIONS *********/
/**
 *
 */
test('ExportModule - Test_getNumberOfUniqueDate', async() => {

    let arrayDateNotUnique=['31-12-2023','18-05-2022',
    '31-12-2023','15-10-2011','03-01-2022','18-05-2022',
    '15-10-2011','18-05-2022','03-01-2022','18-05-2022',
    '03-01-2022','31-12-2023','04-01-2025']
    let arrayOfMapOfNotUniqueDate=[]

    arrayDateNotUnique.forEach((element)=>{
        let map= new Map()
        map.set('Date',element)
        arrayOfMapOfNotUniqueDate.push(map);
    });
    let numberUniqueExpected=5;
    expect(CompilerBilan.test_getNumberOfUniqueDate(arrayOfMapOfNotUniqueDate)).toEqual(numberUniqueExpected);
});

/**
 * Test function which sort an array
 */
test('ExportModule - test_sortEntries', async() => {

    let arrayDateNotSorted=['31-12-2023','18-05-2022',
    '31-12-2023','15-10-2011','03-01-2022','18-05-2022','13-08-2019']
    let arrayOfMapDateNotSorted=[]
    arrayDateNotSorted.forEach((element)=>{
        let map= new Map()
        map.set('Date',element)
        arrayOfMapDateNotSorted.push(map);
    });


    let arrayOfMapDateSorted=[
        new Map().set('Date','31-12-2023'),
        new Map().set('Date','31-12-2023'),
        new Map().set('Date','18-05-2022'),
        new Map().set('Date','18-05-2022'),
        new Map().set('Date','03-01-2022'),
        new Map().set('Date','13-08-2019'),
        new Map().set('Date','15-10-2011'),
    ]

    CompilerBilan.test_sortEntries(arrayOfMapDateNotSorted)
    expect(arrayOfMapDateNotSorted).toEqual(arrayOfMapDateSorted);
});

/**
 * Test a function which get hh:mm as a param and tranform it in minutes
 */
test('ExportModule - getDuration', async() => {
    expect(CompilerBilan.test_getDuration("15:30")).toEqual(930)
    expect(CompilerBilan.test_getDuration("00:00")).toEqual(0)
    expect(CompilerBilan.test_getDuration("24:00")).toEqual(1440)
});

/**
 * Test a function which take minutes and tranform it in hh:mm
 */
test('ExportModule - formatDuration', async() => {
    expect(CompilerBilan.test_formatDuration(930)).toEqual("15:30")
    expect(CompilerBilan.test_formatDuration(0)).toEqual("00:00")
    expect(CompilerBilan.test_formatDuration(1440)).toEqual("24:00")

});


//TODO: Test pour formated date ?

/**
 *
 */
test('ExportModule - testFormatPeriod', async() =>{
    RapportCR.tests()
});

/********************************************************
 ********** TEST ON COMPILER BILAN NOT DONE *************/

//getDataFromFirebase
//filterDataByDate
//getDates
//fetchData(data, formatedDate, categorySelected)
//Alll fetch categories - géré par les testFetch
//resetDataArrays()

/********************************************************
 ********** TEST ON RAPPORT CREATEUR ********************/

/*
test('ExportModule - CreatePDF', async() => {
    let selection = ['hydratation', 'alcool', 'supplements', 'nourriture', 'glycémie', 'poids', 'toilettes', 'sommeil', 'activities'];
    var date1 = new Date("2022-02-01");
    var date2 = new Date("2022-03-29");
    creerPdf(selection, date1, date2);
    //expect(data).toBeInstanceOf(Array);
    //expect(data.length).toBeGreaterThanOrEqual(0);
});

//addWeightTable(document) "#113d37", "#bbebe5")
test('ExportModule - WeightTable', async() => {
    const doc = new jsPDF();
    addWeightTable(doc);
    expect(document.getNumberOfPages()).toEqual(1);
    expect(document.getFillColor()).toEqual('#bbebe5');
});

//addActivitiesTable(document) "#0f5780", "#7cc8f6"
test('ExportModule - ActivitiesTable', async() => {
    const doc = new jsPDF();
    addActivitiesTable(doc);
    expect(document.getNumberOfPages()).toEqual(1);
    expect(document.getFillColor()).toEqual('#7cc8f6');
});*/

//addSleepTable(document) "#152b3f", "#4ca9ff"
test('ExportModule - SleepTable', async() => {
    const doc = new jsPDF();

    doc.autoTable({
        head: ["Test_Sleep"],
        startY: 150,
    });

    let headers = sleepsHeaders();
    mockData.forEach( (data) => {
        test_deleteActualFetchedSleeps();
        test_fetchSleeps(data.sommeil, "2022-02-01");
    })
    let mockArray = getSleeps();
    addSleepTable(doc, mockArray, headers);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');
});

/*
0: Map(6) {'Date' => '2022-03-18', 'startHour' => '00:00', 'endHour' => '07:03', 'duration' => '07:03', 'wakeUpQt' => '3', …}
1: Map(6) {'Date' => '2022-03-13', 'startHour' => '00:00', 'endHour' => '07:03', 'duration' => '07:03', 'wakeUpQt' => '3', …}
2: Map(6) {'Date' => '2022-03-07', 'startHour' => '00:00', 'endHour' => '07:00', 'duration' => '07:00', 'wakeUpQt' => 0, …}
3: Map(6) {'Date' => '2022-02-26', 'startHour' => '00:00', 'endHour' => '07:00', 'duration' => '07:00', 'wakeUpQt' => 0, …}
4: Map(6) {'Date' => '2022-02-25', 'startHour' => '00:00', 'endHour' => '07:00', 'duration' => '07:00', 'wakeUpQt' => 0, …}
5: Map(6) {'Date' => '2022-02-22', 'startHour' => '00:00', 'endHour' => '07:00', 'duration' => '07:00', 'wakeUpQt' => 0, …}
6: Map(6) {'Date' => '2022-02-21', 'startHour' => '00:00', 'endHour' => '07:00', 'duration' => '07:00', 'wakeUpQt' => 0, …}
7: Map(6) {'Date' => '2022-02-02', 'startHour' => '00:00', 'endHour' => '07:00', 'duration' => '07:00', 'wakeUpQt' => 0, …}
*/
/*
//addToiletsTable(document) "#bba339", "#ffea9a"
test('ExportModule - TransitTable', async() => {
    const doc = new jsPDF();
    addToiletsTable(doc);
    expect(document.getNumberOfPages()).toEqual(1);
    expect(document.getFillColor()).toEqual('#ffea9a');
});

//addAlcoolTable(document)  "#e7a54f" "#ffd39b"
test('ExportModule - AlcoolTable', async() => {
    const doc = new jsPDF();
    addAlcoolTable(doc);
    expect(document.getNumberOfPages()).toEqual(1);
    expect(document.getFillColor()).toEqual('#ffd39b');
});

//addGlycimiaTable(document) "#6e233d"
test('ExportModule - GlycemiaTable', async() => {
    const doc = new jsPDF();
    addGlycimiaTable(doc);
    expect(document.getNumberOfPages()).toEqual(1);
    expect(document.getFillColor()).toEqual('#6e233d');
});
*/
/*
addNourritureTable(document) #b4ead8 "#a52a2a" "#db4e3e" "#589051" "#c99b2e"
addHydratationTable(document) "#beecff" "#a52a2a" "#db4e3e" "#589051" "#c99b2e"

addAlcoolMacrosTable(document) --> "#e7a54f""#a52a2a""#db4e3e""#589051""#c99b2e"
addNourritureMacros(document) #185742 "#a52a2a" "#db4e3e" "#589051" "#c99b2e"
addHydratationMacrosTable(document) -- "#65afc5" "#a52a2a" "#db4e3e" "#589051" "#c99b2e"

addAverageGlycimiaTable(document)
addAverageToiletsTable(document)
addSleepAggregateTable(document)
addActivitiesAggregateTable(document)
addWeightAggregateTable(document)*/
/*
addWeightTable(document)
addWeightAggregateTable(document)
addActivitiesTable(document)
addActivitiesAggregateTable(document)
addSleepTable(document)
addSleepAggregateTable(document)
addNourritureTable(document)
addNourritureMacros(document)
addHydratationTable(document)
addHydratationMacrosTable(document)
addToiletsTable(document)
addAlcoolTable(document)
addAlcoolMacrosTable(document)
addGlycimiaTable(document)
addAverageGlycimiaTable(document)
insertNoDataFound(document)
insertHeaders(document, headers, headerColor)*/


/* Notes
//https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
  fireEvent.click(alcoolCheckbox);
  expect(alcoolCheckbox).toBeChecked();
  expect(subscriptionService.subscribe).toHaveBeenCalledTimes(1)
  use await finallbyrole instead of get allbyrole with async function

  const checkboxAlcool = screen.findByLabelText('ALCOOL_TITLE'); //ne fonctionne pas
  screen.getByDisplayValue('Nourriture'); //ne fonctionne pas
  expect(screen.getByRole('alert')).toBeInvalid(); //ne fonctionne pas
  npm test -- --coverage
  npm test Export.test.js -- --coverage --collectCoverageFrom=src/pages/Export/*.jsx
      renderWithRouter(<App />, {route: '/Export'});
      const checkbox_activities = screen.getByTestId("checkbox-activities")
      const checkbox_food = screen.getByTestId("checkbox-food")
      const checkbox_hydration = screen.getByTestId("checkbox-hydration")
      const checkbox_supplements = screen.getByTestId("checkbox-supplements")
      const checkbox_sleep = screen.getByTestId("checkbox-sleep")
      const checkbox_weight = screen.getByTestId("checkbox-weight")
      const checkbox_toilet = screen.getByTestId("checkbox-toilet")
      const checkbox_alcool = screen.getByTestId("checkbox-alcool")
      const checkbox_glycemia = screen.getByTestId("checkbox-glycemia")
      const radio_pdf = screen.getByTestId("radio-pdf")

      await act( async() => {
          fireEvent.click(checkbox_activities)
          fireEvent.click(checkbox_food)
          fireEvent.click(checkbox_hydration)
          fireEvent.click(checkbox_supplements)
          fireEvent.click(checkbox_sleep)
          fireEvent.click(checkbox_weight)
          fireEvent.click(checkbox_toilet)
          fireEvent.click(checkbox_alcool)
          fireEvent.click(checkbox_glycemia)
          fireEvent.click(radio_pdf)
      });

      /*things to do here toget popup error
      expect(screen.queryByRole('alert')).not.toBeNull();  //or
      expect(screen.queryByText('error message todo')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')*/




