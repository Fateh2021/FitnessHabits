import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import App from '../../../App';
import Poids from '../ItemsList/Poids';

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

// Les trois tests donne le même % de couverture
test('Traduction du mot Poids en espagnol', () => {
  localStorage.setItem('userLanguage', 'es')
  render(<Poids poids/>);
  const mot = screen.getByText(/Peso/i);
  expect(mot).toBeDefined();
});

test('Traduction du mot Poids en anglais', () => {
  localStorage.setItem('userLanguage', 'en')
  render(<Poids poids/>);
  const mot = screen.getByText(/Weight/i);
  expect(mot).toBeDefined();
});

test('Traduction du mot Poids en anglais', () => {
  localStorage.setItem('userLanguage', 'en')
  render(<Poids poids/>);
  const mot = screen.getByText(/BMI/i);
  expect(mot).toBeDefined();
});
