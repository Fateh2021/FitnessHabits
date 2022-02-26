import { database } from 'firebase';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import BoissonAlcool from './BoissonAlcool';

const dict = require('../../../translate/Translation.json');

let container = null;

jest.mock('firebase/app', () => {
    return {
        App: () => ({
            app: mockGetApp
        })
    }
})

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => mockGetAuth,
        signInWithEmailAndPassword: () => mockSignIn,
        createUserWithEmailAndPassword: () => mockSignUp
    }
})

const mockSignUp = jest.fn(() => {
    return Promise.resolve({
        user: {
            uid: "fakeuid",
        },
    });
})
const mockSignIn = jest.fn(() => Promise.resolve({
    user: {
        uid: "fakeUid"
    }
}))

const mockGetAuth = jest.fn()

const mockGetApp = jest.fn();

beforeEach(() => {

    jest.resetModules();

    jest.mock('firebase', () => {
        return jest.fn(() => {});
    });

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

    localStorage.setItem('dashboard', JSON.stringify(mock));

    render(<BoissonAlcool
            alcool = { mock.alcool } 
            />, container);
    
    testFunc();

    localStorage.removeItem('dashboard');
};


it('test save item', () => {
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
                weeklyTarget: 15
            },
            alcools: [],
        }
    };
    const testFunc = () => {
        expect(dummyAlcool.alcool.limitConsom.dailyTarget).toBe(0);
        expect(dummyAlcool.alcool.limitConsom.weeklyTarget).toBe(0);
        const educAlcoolToggle = document.getElementById('educAlcoolToggle');
        
        educAlcoolToggle.dispatchEvent(new MouseEvent('change'));
        
        expect(dummyAlcool.alcool.limitConsom.dailyTarget).toBe(3);
        expect(dummyAlcool.alcool.limitConsom.weeklyTarget).toBe(15);
        
    };
    setUp(dummyAlcool, testFunc);
});