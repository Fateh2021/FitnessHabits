import React from 'react';
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import BoissonAlcool from './BoissonAlcool';
import firebase from 'firebase';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.

configure({adapter: new Adapter()});


firebase.database = jest.fn(() => {
    return {
        ref: jest.fn(() => {
            return {
                update: jest.fn(),
            }
        }),
    };
});

const dummyAlcool = {
    alcool: {
        notifications: {
            active: false,
        },
        dailyTarget:
        {
            value: 0
        },
        limitConsom: {
            dailyTarget: 0,
            weeklyTarget: 0,
            educAlcool: false,
            sobrietyDays: 4,
            notificationMessage: "Good job"
        },
        alcools: [
            {
                id: 0,
                favoris: false,
                name: '',
                qtte: 0,
                proteine: 0,
                glucide: 0,
                fibre: 0,
                gras: 0,
                unit: '',
                consumption: 0,
            }
        ],
    }
};

describe('BoissonAlcool Test', () => {

    test('change educ alcool setting', () => {

        // Render a checkbox with label in the document
        const checkbox = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } />);

        localStorage.setItem('userUid', '435f4rcev42');
        localStorage.setItem('settings', JSON.stringify(dummyAlcool));

        const mockEvent = { detail: { checked: true } };
        
        const sets = JSON.parse(localStorage.getItem('settings'));
        
        expect(sets.alcool.limitConsom.educAlcool).toEqual(false);

        checkbox.find('#educAlcoolToggle').simulate('ionChange', mockEvent);
        
        const newSets = JSON.parse(localStorage.getItem('settings'));

        expect(newSets.alcool.limitConsom.educAlcool).toEqual(true);
    });

    test('change notification setting', () => {

        // Render a checkbox with label in the document
        const checkbox = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } />);

        localStorage.setItem('userUid', '435f4rcev42');
        localStorage.setItem('settings', JSON.stringify(dummyAlcool));

        const mockEvent = { detail: { checked: true } };
        
        const sets = JSON.parse(localStorage.getItem('settings'));
        
        expect(sets.alcool.notifications.active).toEqual(false);

        checkbox.find('#notificationToggle').simulate('ionChange', mockEvent);
        
        const newSets = JSON.parse(localStorage.getItem('settings'));

        expect(newSets.alcool.notifications.active).toEqual(true);
    });

    test('change daily target', () => {

        // Render a checkbox with label in the document
        const checkbox = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } />);

        localStorage.setItem('userUid', '435f4rcev42');
        localStorage.setItem('settings', JSON.stringify(dummyAlcool));

        const mockEvent = { target: { value: 5, name: 'value' } };
        
        const sets = JSON.parse(localStorage.getItem('settings'));
        
        expect(sets.alcool.dailyTarget.value).toEqual(0);

        checkbox.find('#cibleQtte').simulate('ionChange', mockEvent);
        
        const newSets = JSON.parse(localStorage.getItem('settings'));

        expect(newSets.alcool.dailyTarget.value).toEqual(5);
    });

    test('change limit consom daily target', () => {

        // Render a checkbox with label in the document
        const checkbox = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } />);

        localStorage.setItem('userUid', '435f4rcev42');
        localStorage.setItem('settings', JSON.stringify(dummyAlcool));

        const mockEvent = { target: { value: 5, name: 'dailyTarget' } };
        
        const sets = JSON.parse(localStorage.getItem('settings'));
        
        expect(sets.alcool.limitConsom.dailyTarget).toEqual(0);

        checkbox.find('#dailyTargetToggle').simulate('ionChange', mockEvent);
        
        const newSets = JSON.parse(localStorage.getItem('settings'));

        expect(newSets.alcool.limitConsom.dailyTarget).toEqual(5);
    });

    test('change limit consom weeklt target', () => {

        // Render a checkbox with label in the document
        const checkbox = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } />);

        localStorage.setItem('userUid', '435f4rcev42');
        localStorage.setItem('settings', JSON.stringify(dummyAlcool));

        const mockEvent = { target: { value: 5, name: 'weeklyTarget' } };
        
        const sets = JSON.parse(localStorage.getItem('settings'));
        
        expect(sets.alcool.limitConsom.weeklyTarget).toEqual(0);

        checkbox.find('#weeklyTargetToggle').simulate('ionChange', mockEvent);
        
        const newSets = JSON.parse(localStorage.getItem('settings'));

        expect(newSets.alcool.limitConsom.weeklyTarget).toEqual(5);
    });

    test.skip('change define gender', () => {
        // Render a checkbox with label in the document
        const checkbox = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } />);

        localStorage.setItem('userUid', '435f4rcev42');
        localStorage.setItem('settings', JSON.stringify(dummyAlcool));

        const sets = JSON.parse(localStorage.getItem('settings'));
        expect(sets.alcool.limitConsom.weeklyTarget).toEqual(0);
    });


});

// import { database } from 'firebase';
// import React from 'react';
// import { render, unmountComponentAtNode } from 'react-dom';
// import { act } from 'react-dom/test-utils';
// import BoissonAlcool from './BoissonAlcool';

// const dict = require('../../../translate/Translation.json');

// let container = null;

// // jest.mock("firebase/app", () => {
// //     const data = { name: "unnamed" };
// //     const snapshot = { val: () => data };
// //     return {
// //       initializeApp: jest.fn().mockReturnValue({
// //         database: jest.fn().mockReturnValue({
// //           ref: jest.fn().mockReturnThis(),
// //           once: jest.fn(() => Promise.resolve(snapshot))
// //         })
// //       })
// //     };
// //   });

// beforeEach(() => {
//     // setup a DOM element as a render target
//     container = document.createElement("div");
//     document.body.appendChild(container);
// });
  
// afterEach(() => {
//     // cleanup on exiting
//     unmountComponentAtNode(container);
//     container.remove();
//     container = null;
// });

// const setUp = (mock, testFunc) => {

//     render(<BoissonAlcool
//             alcool = { mock.alcool } 
//             />, container);
    
//     testFunc();
// };


// it('test change educ alcool setting', () => {
//     const dummyAlcool = {
//         alcool: {
//             notifications: {
//                 active: false,
//             },
//             dailyTarget:
//             {
//                 value: 0
//             },
//             limitConsom: {
//                 dailyTarget: 0,
//                 weeklyTarget: 0,
//                 educAlcool: false,
//                 sobrietyDays: 4,
//                 notificationMessage: "Good job"
//             },
//             alcools: [
//                 {
//                     id: 0,
//                     favoris: false,
//                     name: '',
//                     qtte: 0,
//                     proteine: 0,
//                     glucide: 0,
//                     fibre: 0,
//                     gras: 0,
//                     unit: '',
//                     consumption: 0,
//                 }
//             ],
//         }
//     };
//     const testFunc = () => {
        
//         localStorage.setItem('userUid', '435f4rcev42');
//         localStorage.setItem('settings', JSON.stringify(dummyAlcool));

//         expect(dummyAlcool.alcool.limitConsom.dailyTarget).toBe(0);
//         expect(dummyAlcool.alcool.limitConsom.weeklyTarget).toBe(0);
//         const educAlcoolToggle = document.getElementById('educAlcoolToggle');

//         // educAlcoolToggle.click();
//         educAlcoolToggle.dispatchEvent(new MouseEvent('click'));

//         const sets = JSON.parse(localStorage.getItem('settings'));
        
//         expect(dummyAlcool.alcool.limitConsom.dailyTarget).toBe(3);
//         expect(dummyAlcool.alcool.limitConsom.weeklyTarget).toBe(15);
        
//     };
//     setUp(dummyAlcool, testFunc);
// });