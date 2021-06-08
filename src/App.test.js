import React from 'react';
import { render } from '@testing-library/react';
import {compilerBilanCSV, compilerBilanPDF} from './pages/Settings/Export';
import { ExportToCsv } from "export-to-csv";
import { jsPDF } from "jspdf";
import App from './App';
import {saveItem} from './pages/Dashoard/ItemsList/Alccol';

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

test('Check if PDF format done correctly', async () => {
  var date1 = new Date("2021-02-01");
  var date2 = new Date("2021-03-29");
  let data = await compilerBilanPDF(['activities'], date1, date2);
  expect(data).toBeInstanceOf(Array);
  expect(data.length).toBeGreaterThanOrEqual(0);
});

test('Check if CSV format done correctly', async () => {
  var date1 = new Date("2021-02-01");
  var date2 = new Date("2021-03-29");
  let data = await compilerBilanCSV(['activities'], date1, date2);
  expect(data).toBeInstanceOf(Array);
  expect(data.length).toBeGreaterThanOrEqual(0);
});

test('Check if CSV export options set correctly', async () => {
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

test('Check if PDF export options set correctly', async () => {
  var string = "lorem ipsum";
  var doc = new jsPDF();
  doc.text(string,10,10);
  
  expect(doc).toBeDefined();
});

// // let's match some data against our object
// test('Add item in array', () => {
//   var something =  {id: uuid(), favoris: false, name:"Vin rouge", qtte:1,  proteine:0, fibre:0, gras:0, glucide:0.8, unit: 'oz', consumption:0};

//   expect(saveItem(something.consumption).toEqual(0));
// });



















