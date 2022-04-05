import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';

import App from '../../../../../App';
import { BrowserRouter } from 'react-router-dom';

import Hydratation from '../../Hydratation';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

//Translation testing Add Beverage Button
test('Traduction du mot Breuvage en anglais', async() => {
    localStorage.setItem('userLanguage', 'en');
    renderWithRouter(<App />, { route: '/dashboard' });
    const mot = screen.getByText('+ Beverage');
    expect(mot).toBeDefined();
});

test('Traduction du mot Breuvage en espagnol', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter(<App />, { route: '/dashboard' });
    const mot = screen.getByText('+ Bebida');
    expect(mot).toBeDefined();
});

test('Traduction du mot Breuvage en francais', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter(<App />, { route: '/dashboard' });
    const mot = screen.getByText('+ Breuvage');
    expect(mot).toBeDefined();
});
