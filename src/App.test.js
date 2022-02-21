import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import {compilerBilan} from './pages/Settings/Export';
import {ExportToCsv} from "export-to-csv";
import {jsPDF} from "jspdf";
//import {saveItem} from './pages/Dashoard/ItemsList/Alccol';  //Test non fonctionnel avec cette ligne

import App from './App';
import { BrowserRouter } from 'react-router-dom';

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});


test('Check hydratation value', () => {
var attendu = 5;
 var something =  {"hydratation":{"dailyTarget":{"value":5,"unit":"","globalConsumption":0},"hydrates":["0"]},"alcool":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"alcools":[]},"nourriture":{"globalConsumption":0},"gras":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"grass":[]},"proteines":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"proteines":[]},"legumes":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"legumes":[]},"cereales":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"cereales":[]},"glycemie":{"dailyGlycemie":0},"poids":{"dailyPoids":0},"toilettes":{"feces":0,"urine":0},"sommeil":{"heure":0,"minute":0},"activities":{"heure":0,"minute":0}};
  expect(something.hydratation.dailyTarget.value).toEqual(attendu);
});

test('Check alcool value', () => {
  var attendu = 10;
 var something =  {"hydratation":{"dailyTarget":{"value":5,"unit":"","globalConsumption":0},"hydrates":[]},"alcool":{"dailyTarget":{"value":10,"unit":"","globalConsumption":0},"alcools":[]},"nourriture":{"globalConsumption":0},"gras":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"grass":[]},"proteines":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"proteines":[]},"legumes":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"legumes":[]},"cereales":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"cereales":[]},"glycemie":{"dailyGlycemie":0},"poids":{"dailyPoids":0},"toilettes":{"feces":0,"urine":0},"sommeil":{"heure":0,"minute":0},"activities":{"heure":0,"minute":0}};
  expect(something.alcool.dailyTarget.value).toEqual(attendu);
});

// // let's match some data against our object
// test('Add item in array', () => {
//   var something =  {id: uuid(), favoris: false, name:"Vin rouge", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0.8, unit: 'oz', consumption:0};

//   expect(saveItem(something.consumption).toEqual(0));
// });

// -------- EXPORT MODULE SECTION ----------//
test('ExportModule - Check if PDF format done correctly', async () => {
  var date1 = new Date("2021-02-01");
  var date2 = new Date("2021-03-29");
  let data = await compilerBilan(['activities'], date1, date2);
  expect(data).toBeInstanceOf(Array);
  expect(data.length).toBeGreaterThanOrEqual(0);
});

test('ExportModule - Check if CSV format done correctly', async () => {
  var date1 = new Date("2021-02-01");
  var date2 = new Date("2021-03-29");
  let data = await compilerBilan(['activities'], date1, date2);
  expect(data).toBeInstanceOf(Array);
  expect(data.length).toBeGreaterThanOrEqual(0);
});

test('ExportModule - Check if CSV export options set correctly', async () => {
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

test('ExportModule - Check if PDF export options set correctly', async () => {
  var string = "lorem ipsum";
  var doc = new jsPDF();
  doc.text(string,10,10);
  expect(doc).toBeDefined();
});


/* Tester la présence des composantes dans la page */
test('ExportModule - TestElementsPresence', async () => {
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

//import { shallow } from 'enzyme';
/*Test all attributes selected byDefault*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'});
  const checkboxes = screen.getAllByRole('checkbox', { checked: 'True' })
  expect(checkboxes.length).toEqual(9);
});


//Amorce
test('ExportModule - TestEnglishTranslation', () => {
  renderWithRouter(<App />, {route: '/Export'});
  //Amorce--> Get user language before !
  const nourriture = screen.getByTestId(/checkbox-food/i);
  expect(nourriture).toBeInTheDocument();
  expect(nourriture.textContent).toBe('Nourriture')
});


test('ExportModule - TestFrenchTranslation', () => {
  renderWithRouter(<App />, {route: '/Export'});
  //Amorce--> Get user language before !
  const nourriture = screen.getByTestId(/checkbox-food/i);
  expect(nourriture).toBeInTheDocument();
  expect(nourriture.textContent).toBe('Nourriture')
});

test('ExportModule - TestSpanishTranslation', () => {
  renderWithRouter(<App />, {route: '/Export'});
  //Amorce--> Get user language before !
  const nourriture = screen.getByTestId(/checkbox-food/i);
  expect(nourriture).toBeInTheDocument();
  expect(nourriture.textContent).toBe('Nourriture')
});






//TODOq
/*Test default dates on the page*/
test('ExportModule - TestDefaultDateBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/*Test if format selected changes, no change in attributes selected*/
test('ExportModule - TestNoChangeOnAttributes_whenSelectingReportFormat', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/*Test if dates cahnges, no change in attributes selected*/
test('ExportModule - TestNoChangeOnAttributes_whenSelectingDates', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});




/*Tester les messages d'erreurs -- aucune erreur*/
test('ExportModule - TestErrorMessage_NoErrorDisplayed', () => {
  renderWithRouter(<App />, {route: '/Export'});
  expect(screen.queryByRole('alert')).toBeNull();
});

/*Tester les messages d'erreurs -- avec erreur*/
test('ExportModule - TestErrorMessage_ErrorDisplayed', () => {
  renderWithRouter(<App />, {route: '/Export'});
  /* things to do here toget popup error*/
  //expect(screen.queryByRole('alert')).not.toBeNull();  //or
  //expect(screen.queryByText('error message todo')).toBeInTheDocument();
  //expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
});

/* Notes
  fireEvent.click(alcoolCheckbox);
  expect(alcoolCheckbox).toBeChecked();
  //expect(subscriptionService.subscribe).toHaveBeenCalledTimes(1)
  use await finallbyrole instead of get allbyrole with async function
  Runner seulemet un test: 
  test.only('', () => {});
  Skip un test: 
  test.skip('', () => {});

  const checkboxAlcool = screen.findByLabelText('ALCOOL_TITLE'); //ne fonctionne pas
  screen.getByDisplayValue('Nourriture'); //ne fonctionne pas
  expect(screen.getByRole('alert')).toBeInvalid(); //fonctionne pas
*/




















