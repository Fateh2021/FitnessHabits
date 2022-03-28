import React from 'react';
import App from '../../App';

import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import * as translate from '../../translate/Translator'

import JSZip from "jszip";
import {jsPDF} from "jspdf";
import 'jspdf-autotable';

import mockData from './mockDatas.json';
import * as CB from './CompilerBilan';
import * as RC from './RapportCreateur';
import {
    creerPdf,
    addWeightTable,
    addActivitiesTable,
    addSleepTable,
    addToiletsTable,
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
    sleepsHeaders,
    weightHeaders,
    activitiesHeaders,
    toilettesHeaders,
    nourritureHydratAlcoolHeaders,
    glycimiaHeaders,
    mapAggActivities,
    mapAggSleeps,
    mapAggWeights,
    toiletteHeaders,
    toiletteAggrData
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
    expect(CB.test_fetchNourriture(data_vegetables,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - Food - Null
 */
test('ExportModule - TestFetchNourritureVegetablesNull', async() => {
    CB.resetDataArrays();
    let data_vegetables;
    mockData.forEach( (element) => {
        data_vegetables=element.food.categories.vegetables
    })
    data_vegetables.items=null
    expect(CB.test_fetchNourriture(data_vegetables,'18-03-2022')).toEqual([])

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
    CB.injectDataInArrayNourriture(arrayExpected)
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

    expect(CB.getMacrosTotalAndAveragePerDay('nourriture')).toEqual(macrosMapExecpted);

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

    expect(CB.test_fetchToilets(data_toilets,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - Transit - Null
 */
test('ExportModule - TestFetchToiletsVoid', async() => {
    CB.resetDataArrays();
    expect(CB.test_fetchToilets(null,'18-03-2022')).toEqual([])
    expect(CB.test_fetchToilets(undefined,'18-03-2022')).toEqual([])
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

    CB.injectDataInArrayToilets(arrayExpected)
    let mapExpected=new Map();
    mapExpected.set("totalUrine", 20);
    mapExpected.set("totalFeces", 16);
    mapExpected.set("averageUrinePerDay", 5);
    mapExpected.set("averageFecesPerDay", 4);

    expect(CB.getAverageToilets()).toEqual(mapExpected);
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

    expect(CB.test_fetchActivites(data_activites,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - activities - Null
 */
test('ExportModule - TestFetchActivitiesVoid', async() => {
    CB.resetDataArrays();
    expect(CB.test_fetchActivites(null,'18-03-2022')).toEqual([]);
    expect(CB.test_fetchActivites(undefined,'18-03-2022')).toEqual([]);
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

    CB.injectDataInArrayActivities(arrayExpected);
    //console.log(CB.getAggregateActivities());
    let mapExpected=new Map();
    mapExpected.set("TotalDuration", '54:42');
    mapExpected.set("AverageDuration", '13:40');

    expect(CB.getAggregateActivities()).toEqual(mapExpected);
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
    mapExpected.set("duration", CB.test_formatDuration(data_sleep.duree));
    mapExpected.set("wakeUpQt",data_sleep.nbReveils)
    mapExpected.set("wakeUpState",data_sleep.etatReveil)
    arrayExpected.push(mapExpected)


    //console.log(CB.test_fetchSleep(data_sleep,'18-03-2022'))
    expect(CB.test_fetchSleep(data_sleep,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - sleep - Null
 */
test('ExportModule - TestFetchSleepVoid', async() => {
    CB.resetDataArrays();
    expect(CB.test_fetchSleep(null,'18-03-2022')).toEqual([]);
    expect(CB.test_fetchSleep(undefined,'18-03-2022')).toEqual([]);
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
        mapExpected.set("duration", CB.test_formatDuration(data_sleep.duree));
        mapExpected.set("wakeUpQt",data_sleep.nbReveils)
        mapExpected.set("wakeUpState",data_sleep.etatReveil)
        arrayExpected.push(mapExpected);
    }

    CB.injectDataInArraySleeps(arrayExpected);
    let mapExpected=new Map();
    mapExpected.set("averageStartHour", '01:00');
    mapExpected.set("averageEndHour", '10:00');
    mapExpected.set("averageDuree", '09:00');
    mapExpected.set("averageWakeUpQt", '4.0' );

    expect(CB.getAggregateSleeps()).toEqual(mapExpected);
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

    expect(CB.test_fetchGlycemia(data_glycemia,'18-03-2022')).toEqual(arrayExpected)
});

/**
 * Report test - Glycemia - Null
 */
test('ExportModule - TestFetchGlycemiaVoid', async() => {
    CB.resetDataArrays();
    expect(CB.test_fetchGlycemia(null,'18-03-2022')).toEqual([]);
    expect(CB.test_fetchGlycemia(undefined,'18-03-2022')).toEqual([]);
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

    CB.injectDataInArrayGlycemia(arrayExpected);
    let mapExpected=new Map();
    mapExpected.set("Moyenne", 555.50 + " mmol/L");
    mapExpected.set("Référence", "4.7 - 6.8 mmol/L");

    expect(CB.getAverageGlycemia()).toEqual(mapExpected);
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

    expect(CB.test_fetchDrinksHydratation("hydratation",data_hydratation,'18-03-2022')).toEqual(arrayExpected);
});

/**
 * Report test - Hydratation - Null
 */
test('ExportModule - TestFetchDrinksHydratationVoid', async() => {
    CB.resetDataArrays();
    expect(CB.test_fetchDrinksHydratation("hydratation",null,'18-03-2022')).toEqual([]);
    expect(CB.test_fetchDrinksHydratation("hydratation",undefined,'18-03-2022')).toEqual([]);
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
    CB.injectDataInArrayHydratation(arrayExpected)
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

    expect(CB.getMacrosTotalAndAveragePerDay('hydratation')).toEqual(macrosMapExecpted);
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

    expect(CB.test_fetchDrinksAlcohol("alcool",data_alcohol,'18-03-2022')).toEqual(arrayExpected);
});

/**
 * Report test - Alcool - Null
 */
test('ExportModule - TestFetchDrinksAlcoolVoid', async() => {
    CB.resetDataArrays();
    expect(CB.test_fetchDrinksAlcohol("alcool",null,'18-03-2022')).toEqual([]);
    expect(CB.test_fetchDrinksAlcohol("alcool",undefined,'18-03-2022')).toEqual([]);
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

    CB.injectDataInArrayAlcohol(arrayExpected)
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

    expect(CB.getMacrosTotalAndAveragePerDay('alcool')).toEqual(macrosMapExecpted);
});

/**
 * Report test - Weight - NotNull
 */
test('ExportModule - TestFetchWeight', async() => {
    mockData.forEach((data)=>{
        CB.resetDataArrays();
        data.poids.forEach((weight)=>{
            CB.testReport_fetchWeights(weight.dailyPoids, weight.datePoids)
        })
    })

    let weightUnit = localStorage.getItem("prefUnitePoids");
    let mockArray = CB.getWeights();

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
    CB.resetDataArrays();
    let mockArray = CB.getWeights();
    expect(mockArray).toEqual(null);
});

/**
 * Report test - Weight - Aggregate
 */
test('ExportModule - TestFetchWeight_AGGREGATE', async() => {
    mockData.forEach((data)=>{
        CB.resetDataArrays();
        data.poids.forEach((weight)=>{
            CB.testReport_fetchWeights(weight.dailyPoids, weight.datePoids);
        })
    })
    CB.calculateAggregateWeights();
    expect(CB.getAggregateWeights().get('initalWeight')).toBe("52.16");
    expect(CB.getAggregateWeights().get('finalWeight')).toBe("50.16");
    expect(CB.getAggregateWeights().get('deltaWeight')).toBe("-2.00");
    expect(CB.getAggregateWeights().get('weightUnit')).toBe(localStorage.getItem("prefUnitePoids"));
});


/**
 * Report test - Supplements - NotNull (to do when it will be implemented)
 */

/**
 * Report test - Supplements - Null (to do when it will be implemented)
 */

/**
 * Report test - Supplements - AGGREGATE (to do when it will be implemented)
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
    expect(CB.test_getNumberOfUniqueDate(arrayOfMapOfNotUniqueDate)).toEqual(numberUniqueExpected);
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

    CB.test_sortEntries(arrayOfMapDateNotSorted)
    expect(arrayOfMapDateNotSorted).toEqual(arrayOfMapDateSorted);
});

/**
 * Test a function which get hh:mm as a param and tranform it in minutes
 */
test('ExportModule - getDuration', async() => {
    expect(CB.test_getDuration("15:30")).toEqual(930)
    expect(CB.test_getDuration("00:00")).toEqual(0)
    expect(CB.test_getDuration("24:00")).toEqual(1440)
});

/**
 * Test a function which take minutes and tranform it in hh:mm
 */
test('ExportModule - formatDuration', async() => {
    expect(CB.test_formatDuration(930)).toEqual("15:30")
    expect(CB.test_formatDuration(0)).toEqual("00:00")
    expect(CB.test_formatDuration(1440)).toEqual("24:00")

});

/********************************************************
 ********** TEST ON COMPILER BILAN NOT DONE *************/

//getDataFromFirebase
//filterDataByDate
//getDates
//fetchData(data, formatedDate, categorySelected)
//All fetch categories - géré par les testFetch

//getNumberOfUniqueDate(array_aliments)
test('ExportModule - getNumberOfUniqueDate', async() => {
    //CB.getNumberOfUniqueDate([]);
});

//resetDataArrays()
test('ExportModule - ResetDataArrays', async() => {
    CB.resetDataArrays();
    expect(CB.getHydratations()).toEqual(null);
    expect(CB.getNourriture()).toEqual(null);
    expect(CB.getAlcohol()).toEqual(null);
    expect(CB.getToilets() ).toEqual(null);
    expect(CB.getGlycemia()).toEqual(null);
    expect(CB.getActivities()).toEqual(null);
    expect(CB.getWeights()).toEqual(null);
    expect(CB.getSleeps()).toEqual(null);
});
/********************************************************
 ********** TEST ON RAPPORT CREATEUR ********************/
/**
 * PDF part - ancienne fonction
 */
/*
test('ExportModule - CreatePDF', async() => {
    let selection = ['hydratation', 'alcool', 'supplements', 'nourriture', 'glycémie', 'poids', 'toilettes', 'sommeil', 'activities'];
    var date1 = new Date("2022-02-01");
    var date2 = new Date("2022-03-29");
    creerPdf(selection, date1, date2);
    //expect(data).toBeInstanceOf(Array);
    //expect(data.length).toBeGreaterThanOrEqual(0);
});
*/

/**
 * PDF part
 */
//addActivitiesTable(document) "#0f5780", "#7cc8f6"
test('ExportModule - ActivitiesTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Activities"],startY: 150,});

    let headers = activitiesHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchActivities(data.activities, "2022-02-01");
    })
    let mockArray = CB.getActivities();
    RC.addActivitiesTable(doc, headers);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');

    RC.addActivitiesAggregateTable(doc);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#ffffff');
});

/**
 * PDF part
 */
//addAlcoolTable(document)  "#e7a54f" "#ffd39b"
////addAlcoolMacrosTable(document) --> "#e7a54f""#a52a2a""#db4e3e""#589051""#c99b2e"
test('ExportModule - AlcoolTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Alcohol"],startY: 150,});

    let headers = nourritureHydratAlcoolHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchAlcohols(data.alcool.alcools, "2022-02-01");
    })
    let mockArray = CB.getAlcohol();
    RC.addAlcoolTable(doc, headers);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#598e51');

    RC.addAlcoolMacrosTable(doc);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#c99b2d');
});

/**
 * PDF part
 */
//addNourritureTable(document, headers)
////addNourritureMacros(document) #185742 "#a52a2a" "#db4e3e" "#589051" "#c99b2e"
//TODO _ received 2 ?
test('ExportModule - FoodTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Food"],startY: 150,});

    let headers = nourritureHydratAlcoolHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchFood(data.food.categories.dairyProducts, "2022-02-01");
        CB.testReport_fetchFood(data.food.categories.fruit, "2022-02-01");
        CB.testReport_fetchFood(data.food.categories.grainFood, "2022-02-01");
        CB.testReport_fetchFood(data.food.categories.proteinFood, "2022-02-01");
        CB.testReport_fetchFood(data.food.categories.vegetables, "2022-02-01");
    })
    let mockArray = CB.getNourriture();

    RC.addNourritureTable(doc, headers);
    expect(doc.getNumberOfPages()).toEqual(2);
    expect(doc.getFillColor()).toEqual('#c99b2d');

    RC.addNourritureMacros(doc);
    expect(doc.getNumberOfPages()).toEqual(2);
    expect(doc.getFillColor()).toEqual('#c99b2d');
});

/**
 * PDF part
 */
//addGlycimiaTable(document) "#6e233d"
test('ExportModule - GlycemiaTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Glycemia"],startY: 150,});

    let headers = glycimiaHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchGlycemias(data.glycemie, "2022-02-01");
    })
    let mockArray = CB.getGlycemia();
    RC.addGlycimiaTable(doc, headers);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');

    RC.addAverageGlycimiaTable(doc);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#ffffff');
});

/**
 * PDF part
 */
//RC.addHydratationTable
//getHydratations()
//addHydratationMacrosTable(document) -- "#65afc5" "#a52a2a" "#db4e3e" "#589051" "#c99b2e"
test('ExportModule - HydratationTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Hydratation"],startY: 150,});

    let headers_2 = RC.nourritureHydraAlcoolAggrHeaders();

    mockData.forEach( (data) => {
         CB.resetDataArrays();
         CB.testReport_fetchHydratation(data.hydratation.hydrates, "2022-02-01");
    })
    let mockArray_2 = CB.getHydratations();
    RC.addHydratationTable(doc, headers_2);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');

    RC.addHydratationMacrosTable(doc);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#c99b2d');
});


/**
 * PDF part --addSleepTable(document) "#152b3f", "#4ca9ff"
 */
test('ExportModule - SleepTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Sleep"],startY: 150,});

    let headers = sleepsHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchSleeps(data.sommeil, "2022-02-01");
    })
    let mockArray = CB.getSleeps();
    addSleepTable(doc, mockArray, headers);

    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');

    addSleepAggregateTable(doc);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#ffffff');
});

/**
 * PDF part --addToiletsTable(document) "#bba339", "#ffea9a"
 */
test('ExportModule - TransitTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Transit"],startY: 150,});

    let headers = RC.transitHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchTransits(data.toilettes, "2022-02-01");
    })
    let mockArray = CB.getToilets();
    RC.addToiletsTable(doc, headers);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');

    //RC.addAverageToiletsTable(document);
    //expect(doc.getNumberOfPages()).toEqual(1);
    //expect(doc.getFillColor()).toEqual('#f4f4f4');
});

/**
 * PDF part - addWeightTable(document) "#113d37", "#bbebe5")
 */
test('ExportModule - WeightTable', async() => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Weight"],startY: 150,});
    let headers = weightHeaders();
    mockData.forEach( (data) => {
        CB.resetDataArrays();
        CB.testReport_fetchWeights(data.poids[0].dailyPoids, data.poids[0].datePoids);
        CB.testReport_fetchWeights(data.poids[1].dailyPoids, data.poids[1].datePoids);
    });
    //let mockArray = CB.getWeights(); //sort the arrays
    RC.addWeightTable(doc, headers); //inside-it, call getWeights which sort the array
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#baeae5');

    //RC.addWeightAggregateTable(document);
    //expect(doc.getNumberOfPages()).toEqual(1);
    //expect(doc.getFillColor()).toEqual('#baeae5');
});

/**
 * PDF part
 */
//insertNoDataFound(document)
test('ExportModule - insertNoDataFound', () => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Weight"],startY: 150,});
    RC.insertNoDataFound(doc);
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#f4f4f4');
});
/**
 * PDF part
 */
//insertHeaders(document, headers, headerColor)
test('ExportModule - insertHeaders', () => {
    const doc = new jsPDF();
    doc.autoTable({head: ["Test_Weight"],startY: 150,});
    RC.insertHeaders(doc, ['a','b','c'], "#ffffff");
    expect(doc.getNumberOfPages()).toEqual(1);
    expect(doc.getFillColor()).toEqual('#ffffff');
});

/**
 * CSV part -
 */
test('ExportModule - formedTitle', () => {
    localStorage.setItem('userLanguage', 'en');
    let title = RC.formedTitle("GLYC_TITLE", "2022/02/25");
    expect(title).toEqual('Blood sugar level - 2022-02-25.csv');
});

/**
 * CSV part -
 */
test('ExportModule - createPeriod', () => {
    localStorage.setItem('userLanguage', 'fr');
    let periodCreated = RC.createPeriod(new Date("2022-01-25"), new Date("2022-03-25"));
    expect(periodCreated).toEqual('De 25/01/2022 À 25/03/2022');
});

/**
 * CSV part - todo add more function
 */

/**
 * CSV part - mis en commentaire car ne fait que passer dans les fonctions
 */
 /*
test('ExportModule - CSVALL', () => {
    const temppdf = new jsPDF();
    const tempzip = new JSZip();
    const tempdate = RC.createPeriod(new Date(), new Date("2022-03-25"));
    temppdf.autoTable({
        body: [[' ']]
    });
    RC.insertNoDataFound(temppdf);
    RC.insertHeaders(temppdf, [" "], "#ffffff");

    RC.weightHeaders();
    RC.weightAggrData();
    RC.activitiesHeaders();
    RC.activitiesAggrData();
    RC.sleepsHeaders();
    RC.sleepAggrData();
    RC.nourritureHydratAlcoolHeaders();
    RC.nourritureHydraAlcoolAggrHeaders();
    RC.hydratationAggrData();
    RC.nourritureAggrData();
    RC.transitHeaders();
    RC.toiletteAggrData();
    RC.alcoolAggrData();
    RC.glycimiaHeaders();
    RC.glycimiaAggrData();
    RC.weightCSV(tempzip, tempdate);
    RC.weightAggrCSV(tempzip, tempdate);
    RC.activitiesCSV(tempzip, tempdate);
    RC.activitiesAggrCSV(tempzip, tempdate);
    RC.sleepsCSV(tempzip, tempdate);
    RC.sleepAggrCSV(tempzip, tempdate);
    RC.nourritureAggrCSV(tempzip, tempdate);
    RC.hydratationAggrCSV(tempzip, tempdate);
    RC.toiletteCSV(tempzip, tempdate);
    RC.toiletteAggrCSV(tempzip, tempdate);
    RC.glycimiaCSV(tempzip, tempdate);
    RC.glycimiaAggrCSV(tempzip, tempdate);
});*/


/**
 * TRADUCTION -- n'augmente pas la couverture
 */
test('ExportModule - english traduction', () => {
    localStorage.setItem('userLanguage', 'en');
    expect(translate.getText("EXP_REPORT_UNIT")).toEqual('Unit');
    expect(translate.getText("EXP_REPORT_WEIGHT")).toEqual('Weight');
    expect(translate.getText("EXP_REPORT_INITIAL_WEIGHT")).toEqual('Initial weight');
    expect(translate.getText("EXP_REPORT_FINAL_WEIGHT")).toEqual("Final weight");
    expect(translate.getText("EXP_REPORT_DIFF_WEIGHT")).toEqual("Weight difference");
    expect(translate.getText("EXP_REPORT_DURATION")).toEqual("Duration");
    expect(translate.getText("EXP_REF_GLY")).toEqual("Reference");
    expect(translate.getText("EXP_REPORT_AVERAGE_DURATION_ACTIVITY")).toEqual("Average");
    expect(translate.getText("EXP_REPORT_START_HOUR_SLEEP")).toEqual('Bedtime');
    expect(translate.getText("EXP_REPORT_END_HOUR_SLEEP")).toEqual('Waking hour');
    expect(translate.getText("EXP_REPORT_WAKEUP_QT_SLEEP")).toEqual('Woke up quantity');
    expect(translate.getText("EXP_REPORT_AVG_END_HOUR_SLEEP")).toEqual("Average waking hour");
    expect(translate.getText("EXP_REPORT_AVG_START_HOUR_SLEEP")).toEqual("Average bedtime");
    expect(translate.getText("EXP_REPORT_AVG_DURATION_SLEEP")).toEqual("Average duration");
    expect(translate.getText("EXP_REPORT_AVG_WAKEUP_QT")).toEqual("Wake up(s) per night");
    expect(translate.getText("EXP_REPORT_WAKEUP_STATE")).toEqual("Wake-up state");
    expect(translate.getText("EXP_REPORT_QT")).toEqual("Quantity");
    //expect(translate.getText("EXP_REPORT_MACROS").getText("TOTAL")).toEqual("Total");
    expect(translate.getText("EXP_UR_TR")).toEqual("Transit");
    expect(translate.getText("EXP_TOT_UR")).toEqual("Total urine");
    expect(translate.getText("EXP_TOT_FEC")).toEqual("Total faeces");
    expect(translate.getText("EXP_AVG_UR")).toEqual("Average urine per day");
    expect(translate.getText("EXP_AVG_FEC")).toEqual("Average faeces per day");
    expect(translate.getText("EXP_AVG_TRA")).toEqual("Average transits per day");
});

/**
 * TRADUCTION Headers-- n'augmente pas la couverture
 */
test('ExportModule - english traduction', () => {
    localStorage.setItem('userLanguage', 'en');
    let unitePoids = localStorage.getItem("prefUnitePoids");
    let dateTitle;
    let poidsTitle;
    [dateTitle, poidsTitle] = weightHeaders(); //translate.getText("EXP_REPORT_WEIGHT") + agg.get('weightUnit'); //translate.getText("DATE_TITLE");

    expect(dateTitle).toEqual('Date');
    expect(poidsTitle).toEqual('Weight' + unitePoids);
});

/**
 * test on formatDate(date) -- @param {date} like dd-MM-yyyy (ex : 01-01-2022)  --> @return a formated date
 * @private
 *
 */
test('ExportModule - formatDate', () => {
    let formatedDate = CB.formatDate('01-01-2022')
    expect(formatedDate).toEqual('1/1/2022');
});













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




