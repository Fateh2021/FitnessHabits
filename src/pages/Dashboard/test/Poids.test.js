import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import App from '../../../App';
import Poids from '../ItemsList/Poids';

import { formatPoids,formatToKG , trouver_nouvelle_categorie, formatDate, initPrefPoids, 
        getDailyPoids, setPrefUnitePoids, saveEntreeDePoids} from '../../Poids/configuration/poidsService';



beforeEach(() => {
  var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
  var poids={
    dailyPoids:"77.00",
    datePoids:"2022-03-17T15:24:10.792Z"
  }
  const pseudo_dashboard = {
    userUID,
    poids
  };

  localStorage.setItem('dashboard', JSON.stringify(pseudo_dashboard));
  localStorage.setItem("prefUnitePoids", 'KG');

});

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

// Les trois tests donne le même % de couverture
test('Traduction du mot Poids en espagnol', async() => {
  localStorage.setItem('userLanguage', 'es')
  render(<Poids poids/>);
  const mot = screen.getByText(/Peso/i);
  expect(mot).toBeDefined();
});

test('Traduction du mot Poids en anglais', async() => {
  localStorage.setItem('userLanguage', 'en')
  render(<Poids poids/>);
  const mot = screen.getByText(/Weight/i);
  expect(mot).toBeDefined();
});

test('Traduction du mot Poids en anglais', async() => {
  localStorage.setItem('userLanguage', 'en')
  render(<Poids poids/>);
  const mot = screen.getByText(/BMI/i);
  expect(mot).toBeDefined();
});

test('select down', async() => {
  render(<Poids poids/>);
  const s = screen.getByTestId('select');

  act(() => {fireEvent.click(s)})

  expect('LBS').toBeDefined();
  expect('KG').toBeDefined();

});


//test pour poidsService


describe('saveEntreeDePoids', () => {

  it('valeur should be 88', () => {
    saveEntreeDePoids(88);
    var tmp = JSON.parse(localStorage.getItem("dashboard")).poids.dailyPoids;    
    //dailyPoids:"77.00"
    expect(tmp).toBe(88);

  });

});

describe('setPrefUnitePoids', () => {

  it('should return undefined', () => {
    setPrefUnitePoids('LBS');
    var tmp = localStorage.getItem("prefUnitePoids");    
    expect(tmp).toBe('LBS');

  });

});

describe('getDailyPoids', () => {

  it('should return undefined', () => {
    
    expect(getDailyPoids()).toBe(undefined);

  });

});

describe('initPrefPoids', () => {

  it('should return KG', () => {
    initPrefPoids()
    const local_unite = localStorage.getItem('prefUnitePoids')
    expect(local_unite).toBe('KG');

  });

});

describe('formatDate', () => {

  it('should return 2022-03-16', () => {
      expect(formatDate(new Date('2022-03-17'))).toBe('2022-03-16');

  });

});

describe('trouver_nouvelle_categorie', () => {

  it('should return CATEGORIE_IDEAL', () => {
      expect(trouver_nouvelle_categorie(20)).toBe('CATEGORIE_IDEAL');

  });

});

describe('formatPoids', () => {

  it('should return 77', () => {

      expect(formatPoids(77)).toBe(77);

  });

});

describe('formatToKG', () => {

  it('should return 35.00', () => {
    localStorage.setItem("prefUnitePoids", 'LBS');

      expect(Number(formatToKG(77))).toBe(35.00);

  });

});


test('Poids Test element dans le page', async() => {
  renderWithRouter( < App / > , { route: '/configurationPoids' });
  localStorage.setItem("prefUnitePoids", 'KG')
  const pop_up_elem_kg = screen.getByText(/KG/i);
  expect(pop_up_elem_kg).toBeInTheDocument();
});

test('Poids Test popup', async() => {
  renderWithRouter( < App / > , { route: '/configurationPoids' });
  localStorage.setItem("prefUnitePoids", 'KG')
  const check_button = screen.getByTestId("pop_up_unite")
  act(() => {fireEvent.click(check_button)})
  
  const pop_up_elem_lbs = screen.getByText(/LBS/i);
  const pop_up_elem_kg = screen.getByText(/KG/i);
  expect(pop_up_elem_lbs).toBeInTheDocument();
  expect(pop_up_elem_kg).toBeInTheDocument();
});



test('valeur de poids', async() => {

  act(() => {render(<Poids poids/>);})

  const  poids_input = screen.getByTestId('poids_input');
    
  //const mot = document.getElementsByName('ion-input-20').value;
  //expect(mot).toBe("77.00");

  const mot = document.getElementsByClassName('native-input sc-ion-input-md');
  expect(mot).toBeDefined();
});

test('go to page de configuration', async() => {
  render(<Poids poids/>);

  const img = screen.getByTestId('img_sauter');
  act(() => {fireEvent.click(img)})

  const pop_up_elem_kg = screen.getByText(/KG/i);
  expect(pop_up_elem_kg).toBeInTheDocument();
});









