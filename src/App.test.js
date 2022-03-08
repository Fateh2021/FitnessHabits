import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";

import DatePicker from "react-datepicker";

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
    
}

test('renders without crashing', async() => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
});
/*
test('Check hydratation value', async() => {
    var attendu = 5;
    var something = { "hydratation": { "dailyTarget": { "value": 5, "unit": "", "globalConsumption": 0 }, "hydrates": ["0"] }, "alcool": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "alcools": [] }, "nourriture": { "globalConsumption": 0 }, "gras": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "grass": [] }, "proteines": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "proteines": [] }, "legumes": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "legumes": [] }, "cereales": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "cereales": [] }, "glycemie": { "dailyGlycemie": 0 }, "poids": { "dailyPoids": 0 }, "toilettes": { "feces": 0, "urine": 0 }, "sommeil": { "heure": 0, "minute": 0 }, "activities": { "heure": 0, "minute": 0 } };
    expect(something.hydratation.dailyTarget.value).toEqual(attendu);
});

test('Check alcool value', async() => {
    var attendu = 10;
    var something = { "hydratation": { "dailyTarget": { "value": 5, "unit": "", "globalConsumption": 0 }, "hydrates": [] }, "alcool": { "dailyTarget": { "value": 10, "unit": "", "globalConsumption": 0 }, "alcools": [] }, "nourriture": { "globalConsumption": 0 }, "gras": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "grass": [] }, "proteines": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "proteines": [] }, "legumes": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "legumes": [] }, "cereales": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "cereales": [] }, "glycemie": { "dailyGlycemie": 0 }, "poids": { "dailyPoids": 0 }, "toilettes": { "feces": 0, "urine": 0 }, "sommeil": { "heure": 0, "minute": 0 }, "activities": { "heure": 0, "minute": 0 } };
    expect(something.alcool.dailyTarget.value).toEqual(attendu);
});

