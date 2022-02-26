import { database } from 'firebase';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import BoissonAlcool from './BoissonAlcool';

const dict = require('../../../translate/Translation.json');

let container = null;

jest.mock("firebase/app", () => {
    const data = { name: "unnamed" };
    const snapshot = { val: () => data };
    return {
      initializeApp: jest.fn().mockReturnValue({
        database: jest.fn().mockReturnValue({
          ref: jest.fn().mockReturnThis(),
          once: jest.fn(() => Promise.resolve(snapshot))
        })
      })
    };
  });

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});
  
afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const setUp = (mock, testFunc) => {

    render(<BoissonAlcool
            alcool = { mock.alcool } 
            />, container);
    
    testFunc();
};


it('test change educ alcool setting', () => {
    const dummyAlcool = {
        alcool: 
        {
            notifications: [],
            dailyTarget:
            {
                globalConsumption: 0,
                unit: "",
                value: 0
            },
            limitConsom: {
                dailyTarget: 0,
                weeklyTarget: 0
            },
            alcools: [],
        }
    };
    const testFunc = () => {
        expect(dummyAlcool.alcool.limitConsom.dailyTarget).toBe(0);
        expect(dummyAlcool.alcool.limitConsom.weeklyTarget).toBe(0);
        const educAlcoolToggle = document.getElementById('educAlcoolToggle');

        educAlcoolToggle.checked = false;

        educAlcoolToggle.click();
        // educAlcoolToggle.dispatchEvent(new Event('change', { bubbles: true }));
        
        expect(dummyAlcool.alcool.limitConsom.dailyTarget).toBe(3);
        expect(dummyAlcool.alcool.limitConsom.weeklyTarget).toBe(15);
        
    };
    setUp(dummyAlcool, testFunc);
});