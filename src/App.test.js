import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import App from './App';
import Dashboard from './pages/Dashboard/Dashboard';




test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});


test('Check hydratation value', () => {
  const data = 'hydratation';
var attendu = "5 ml ";
 var something =  {"hydratation":{"dailyTarget":{"value":5,"unit":"","globalConsumption":0},"hydrates":["0"]},"alcool":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"alcools":[]},"nourriture":{"globalConsumption":0},"gras":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"grass":[]},"proteines":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"proteines":[]},"legumes":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"legumes":[]},"cereales":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"cereales":[]},"glycemie":{"dailyGlycemie":0},"poids":{"dailyPoids":0},"toilettes":{"feces":0,"urine":0},"sommeil":{"heure":0,"minute":0},"activities":{"heure":0,"minute":0}};
  expect(something.hydratation.dailyTarget.value).toEqual(attendu);
});

test('Check alcool value', () => {
  const data = 'alcool';
  var attendu = 10;
 var something =  {"hydratation":{"dailyTarget":{"value":5,"unit":"","globalConsumption":0},"hydrates":[]},"alcool":{"dailyTarget":{"value":10,"unit":"","globalConsumption":0},"alcools":[]},"nourriture":{"globalConsumption":0},"gras":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"grass":[]},"proteines":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"proteines":[]},"legumes":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"legumes":[]},"cereales":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"cereales":[]},"glycemie":{"dailyGlycemie":0},"poids":{"dailyPoids":0},"toilettes":{"feces":0,"urine":0},"sommeil":{"heure":0,"minute":0},"activities":{"heure":0,"minute":0}};
  expect(something.alcool.dailyTarget.value).toEqual(attendu);
});

test('Check if all checkbox unchecked', () => {
  const data = '';
  var attendu = undefined;
 var something =  {"hydratation":{"dailyTarget":{"value":5,"unit":"","globalConsumption":0},"hydrates":[]},"alcool":{"dailyTarget":{"value":10,"unit":"","globalConsumption":0},"alcools":[]},"nourriture":{"globalConsumption":0},"gras":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"grass":[]},"proteines":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"proteines":[]},"legumes":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"legumes":[]},"cereales":{"dailyTarget":{"value":0,"unit":"","globalConsumption":0},"cereales":[]},"glycemie":{"dailyGlycemie":0},"poids":{"dailyPoids":0},"toilettes":{"feces":0,"urine":0},"sommeil":{"heure":0,"minute":0},"activities":{"heure":0,"minute":0}};
  expect(attendu).toBeUndefined();

  //var bd = {"activities":{"heure":"3","minute":"55"},"alcool":{"dailyTarget":{"globalConsumption":1,"unit":"","value":0},"alcools":[{"id":"5e81a1d-8-76a2-3dfc-045261e36e1b","favoris":false,"name":"Champagne","qtte":"2","proteine":0,"glucide":0,"fibre":0,"gras":0,"unit":"unite","consumption":0},{"id":"cf177e-f51b-bbb6-4482-3433c13181f7","favoris":false,"name":"COKE","qtte":"1000","proteine":0,"glucide":0,"fibre":0,"gras":0,"unit":"ml","consumption":0},{"id":"ff531c-0801-1c25-02c7-efa1058ce8d","favoris":false,"name":"VIN BLANC","qtte":"25","proteine":0,"glucide":"1","fibre":0,"gras":0,"unit":"ml","consumption":1}]},"cereales":{"dailyTarget":{"globalConsumption":0,"unit":"","value":0}},"glycemie":{"dailyGlycemie":"26"},"gras":{"dailyTarget":{"globalConsumption":0,"unit":"","value":0}},"hydratation":{"dailyTarget":{"unit":"","value":0,"globalConsumption":0},"hydrates":[{"id":"1dcbde3-1f37-cd7-b1bf-78a3e4412d0","favoris":false,"name":"Tea","qtte":"1","proteine":0,"glucide":0,"fibre":0,"gras":0,"unit":"tasse","consumption":0},{"id":"53babdf-afb4-a576-f732-f1a81ee522f2","favoris":false,"name":"Pepsi","qtte":"2","proteine":0,"glucide":0,"fibre":0,"gras":0,"unit":"ml","consumption":0},{"id":"62ced76-7308-d123-f02-87b0e01624d5","favoris":false,"name":"Coke","qtte":"2","proteine":0,"glucide":0,"fibre":0,"gras":0,"unit":"tasse","consumption":0}]},"legumes":{"dailyTarget":{"globalConsumption":0,"unit":"","value":0}},"nourriture":{"globalConsumption":0},"poids":{"dailyPoids":"200"},"proteines":{"dailyTarget":{"globalConsumption":0,"unit":"","value":0}},"sommeil":{"heure":"7","minute":"0"},"toilettes":{"feces":3,"urine":2}};
});





















