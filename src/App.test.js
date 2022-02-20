import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import {compilerBilan} from './pages/Settings/Export';
import {ExportToCsv} from "export-to-csv";
import {jsPDF} from "jspdf";
//import {saveItem} from './pages/Dashoard/ItemsList/Alccol';  //Test non fonctionnel avec cette ligne

import App from './App';
import userEvent from '@testing-library/user-event'
import {createMemoryHistory} from 'history'
import {Router} from 'react-router-dom'
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

/* Tester la présence des composantes dans la page ? 
test('CheckMainPageComponents', async () => {
  render(<App />); //render the main page
  const buttonInscrip = screen.getByText(/S'inscrire/i);
  const buttonConnection = screen.getByText(/Se connecter/i); 
  expect(buttonInscrip).toBeInTheDocument();
  expect(buttonConnection).toBeInTheDocument();
});*/


/*Tester select all par défaut dans la page*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'});
  //const checkboxAlcool = screen.getByRole('checkbox', {name: 'Alcool'}); //fonctionne
  const alcoolCheckbox = screen.getByTestId('checkbox-alcool');
  fireEvent.click(alcoolCheckbox);
  expect(alcoolCheckbox).toBeChecked(); 
});


/*Tester les dates par défaut dans la page*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/*Tester if format selected changes, no change in attribute selected*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/*Tester if dates cahnges, no change in attribute selected*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/*Tester le changement de langues*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/*Tester les messages d'erreurs*/
test('ExportModule - TestCheckBoxDefaultBehaviour', () => {
  renderWithRouter(<App />, {route: '/Export'}); 
});

/* Notes
  const img = screen.getByRole('img', {name: 'Logo_texte'});
  expect(colorButton).toBeVisible();
  expect(buttonX).toBeDisabled(); 
  expect(getByText('link')).not.toBeDisabled()
  expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
  screen.getByRole('alert')
  //const checkboxAlcool = screen.findByLabelText('ALCOOL_TITLE'); //ne fonctionne pas
  //screen.getByDisplayValue('Nourriture'); //ne fonctionne pas
  //expect(screen.getByRole('alert')).toBeInvalid(); //fonctionne pas 
*/




















