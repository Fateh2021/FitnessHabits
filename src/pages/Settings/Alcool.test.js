import React from 'react';
import Alcool from './Alcool';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.

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

describe('Settings Alcool Section Test', () => {

    // test('change educ alcool setting', () => {

     
    // });
});