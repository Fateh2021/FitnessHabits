import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import App from '../../../App';

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

test('Traduction du mot Initial Poids en anglais', () => {
  localStorage.setItem('userLanguage', 'en')
  renderWithRouter(<App />, { route: '/ConfigurationPoids' });
  const mot = screen.getByText(/Initial weight/i);
  expect(mot).toBeDefined();
});
