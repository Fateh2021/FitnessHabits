import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import Poids from '../pages/Dashboard/ItemsList/Poids';

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

test('renders without crashing', async() => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
});

/*
test('Verifier si le mot LBS existe', async() => {
    renderWithRouter(<App /> , { route: '/ConfigurationPoids' });
    const mot = screen.getByText('LBS');
    expect(mot).toBeDefined();
});

test('Traduction du mot Initial Poids en anglais', async() => {
    localStorage.setItem('userLanguage', 'en');
    renderWithRouter(<App />, { route: '/ConfigurationPoids' });
    const mot = screen.getByText(/Init/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Initial Poids en espagnol', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter(<App />, { route: '/ConfigurationPoids' });
    const mot = screen.getByText(/Peso inicial/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Initial Poids en francais', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter(<App />, { route: '/ConfigurationPoids' });
    const mot = screen.getByText(/Poids initial/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Poids en anglais page dashboard', async() => {
    localStorage.setItem('userLanguage', 'en');
    //render(<Poids poids="dailyPoids: 50"/>);
    renderWithRouter(<App />, {route: '/dashboard'});
    const mot = screen.getByText(/Weight/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Poids en espagnol page dashboard', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter(<App />, { route: '/dashboard' });
    //render(<Poids poids="dailyPoids: 50"/>);
    const mot = screen.getByText(/Peso/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Poids en francais page dashboard', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter(<App />, { route: '/dashboard' });
    //render(<Poids poids="dailyPoids: 50"/>);
    const mot = screen.getByText(/Poids/i);
    expect(mot).toBeDefined();
});*/