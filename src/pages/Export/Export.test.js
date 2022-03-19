import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import DatePicker from "react-datepicker";
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";

import App from '../../App';
import * as CompilerBilan from './CompilerBilan';
import Settings from "./Export";
import { ExportToCsv } from "export-to-csv";
import { jsPDF } from "jspdf";
import data from './example_test.json';
import { execPath } from 'process';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

test('renders without crashing', async() => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
});


//https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
/*test('ExportModule - Check if PDF format done correctly', async() => {
    var date1 = new Date("2021-02-01");
    var date2 = new Date("2021-03-29");
    let data = await compilerBilan(['activities'], date1, date2);
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThanOrEqual(0);
});

test('ExportModule - Check if CSV format done correctly', async() => {
    var date1 = new Date("2021-02-01");
    var date2 = new Date("2021-03-29");
    let data = await compilerBilan(['activities'], date1, date2);
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThanOrEqual(0);
});

test('ExportModule - Check if CSV export options set correctly', async() => {
    const options = {
        title: `FitnessHabits-data-${new Date()
      .toISOString()
      .slice(0, 10)}`,
        filename: `FitnessHabits-data-${new Date()
      .toISOString()
      .slice(0, 10)}`,
        useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);
    expect(csvExporter).toBeDefined();
});

test('ExportModule - Check if PDF export options set correctly', async() => {
    var string = "lorem ipsum";
    var doc = new jsPDF();
    doc.text(string, 10, 10);
    expect(doc).toBeDefined();
});
*/
/* Tester la présence des composantes dans la page */
test('ExportModule - TestElementsPresence_1', async() => {
    renderWithRouter( < App / > , { route : '/Export' });
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


test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
    renderWithRouter( < App / > , { route: '/Export' });
    const checkboxes = screen.getAllByRole('checkbox', { checked: 'True' })
    expect(checkboxes.length).toEqual(9);
});

test('ExportModule - TestEnglishTranslation', async() => {
    localStorage.setItem('userLanguage', 'en');
    renderWithRouter( < App / > , { route: '/Export' });

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

test('ExportModule - TestFrenchTranslation', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter( < App / > , { route: '/Export' });

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

test('ExportModule - TestSpanishTranslation', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter( < App / > , { route: '/Export' });

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

/*
Test default dates on the page: By default,  endDate is today's
date and the startDate is 3 months before
test('ExportModule - TestDefaultDateBehaviour', async() => {
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
/*Test if format selected changes, no change in attributes selected*/
test('ExportModule - TestNoChangeOnAttributes_whenSelectingReportFormat', async() => {
    renderWithRouter( < App / > , { route: '/Export' });
    //to be false
    const checkbox_food = screen.getByTestId("checkbox-food")
    const checkbox_sleep = screen.getByTestId("checkbox-sleep")
    const checkbox_weight = screen.getByTestId("checkbox-weight")

    //to be true
    const checkbox_toilet = screen.getByTestId("checkbox-toilet")
    const checkbox_alcool = screen.getByTestId("checkbox-alcool")
    const checkbox_glycemia = screen.getByTestId("checkbox-glycemia")

    const radio_pdf = screen.getByTestId("radio-pdf")

    act(() => {
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

//todo
/*Test if dates changes, no change in attributes selected*/
test('ExportModule - TestNoChangeOnAttributes_whenSelectingDates', async() => {
    renderWithRouter( < App / > , { route: '/Export' });
});

//todo
/*Tester les messages d'erreurs -- aucune erreur*/
test('ExportModule - TestErrorMessage_NoErrorDisplayed', async() => {
    renderWithRouter( < App / > , { route: '/Export' });
    expect(screen.queryByRole('alert')).toBeNull();
});

/*Tester les messages d'erreurs quand il n'y a aucune sélection -- avec erreur*/
test('ExportModule - TestErrorMessage_ErrorDisplayedWhenNoSelection', async() => {
    renderWithRouter( < App / > , { route: '/Export' });
    //to be false
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

    act(() => {
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

    /* things to do here toget popup error*/
    //expect(screen.queryByRole('alert')).not.toBeNull();  //or
    //expect(screen.queryByText('error message todo')).toBeInTheDocument();
    //expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
});


test('ExportModule - TestClickOnFoodCheckbox', async() => {
    renderWithRouter( < App / > , { route: '/Export' });
    const checkbox_food = screen.getByTestId("checkbox-food")
    act(() => {
        fireEvent.click(checkbox_food)
    });
    expect(checkbox_food.getAttribute("aria-checked")).toBe("false")
});


test('ExportModule - TestClickOnFoodCheckbox', async() => {
    renderWithRouter( < App / > , { route: '/Export' });
    const checkbox_food = screen.getByTestId("checkbox-food")
    act(() => {
        fireEvent.click(checkbox_food)
    });
    expect(checkbox_food.getAttribute("aria-checked")).toBe("false")
});

{/* ------Compiler Bilan----------- */}
test('ExportModule - TestFetchNourritureCereale', async() => {
    let data_cereales;
    data.map((element)=>{
        data_cereales=element.cereales.cereales
    })
    let arrayExpected=[]
    data_cereales.map((element)=>{
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
 
    expect(CompilerBilan.test_fetchNourriture(data_cereales,'18-03-2022')).toEqual(arrayExpected)
});

test('ExportModule - TestFetchNourritureCereale0Consumption', async() => {
    CompilerBilan.resetDataArrays()
    let data_cereales;
    data.map((element)=>{
        data_cereales=element.cereales.cereales;
    })
    data_cereales.map((element)=>{
        element.consumption=0;
    })
    
    expect(CompilerBilan.test_fetchNourriture(data_cereales,'18-03-2022')).toEqual([])
});

test('ExportModule - TestFetchNourritureCerealeNull', async() => {
    CompilerBilan.resetDataArrays()
    expect(CompilerBilan.test_fetchNourriture(null,'18-03-2022')).toEqual([])
});



test('ExportModule - TestFetchDrinksHydratation', async() => {
    let data_hydratation;
    data.map((element)=>{
        data_hydratation=element.hydratation.hydrates;
    })
    let arrayExpected=[]
    data_hydratation.map((element)=>{
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

test('ExportModule - TestFetchDrinksHydratation0Consumption', async() => {
    CompilerBilan.resetDataArrays()
    let data_hydratation;
    data.map((element)=>{
        data_hydratation=element.hydratation.hydrates
    })
    data_hydratation.map((element)=>{
        element.consumption=0;
    })
    
    expect(CompilerBilan.test_fetchDrinksHydratation("hydratation",data_hydratation,'18-03-2022')).toEqual([])
});

test('ExportModule - TestFetchDrinksAlcohol', async() => {
    let data_alcohol;
    data.map((element)=>{
        data_alcohol=element.alcool.alcools;
    })
    let arrayExpected=[]
    data_alcohol.map((element)=>{
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

test('ExportModule - TestFetchDrinksHydratation0Consumption', async() => {
    CompilerBilan.resetDataArrays()
    let data_alcohol;
    data.map((element)=>{
        data_alcohol=element.alcool.alcools
    })
    data_alcohol.map((element)=>{
        element.consumption=0;
    })
    
    expect(CompilerBilan.test_fetchDrinksAlcohol("alcool",data_alcohol,'18-03-2022')).toEqual([])
});

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




/* Notes
  fireEvent.click(alcoolCheckbox);
  expect(alcoolCheckbox).toBeChecked();
  expect(subscriptionService.subscribe).toHaveBeenCalledTimes(1)
  use await finallbyrole instead of get allbyrole with async function

  const checkboxAlcool = screen.findByLabelText('ALCOOL_TITLE'); //ne fonctionne pas
  screen.getByDisplayValue('Nourriture'); //ne fonctionne pas
  expect(screen.getByRole('alert')).toBeInvalid(); //ne fonctionne pas
  npm test -- --coverage
*/