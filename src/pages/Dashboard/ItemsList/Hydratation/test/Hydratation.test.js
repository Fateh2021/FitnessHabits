import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import {act} from "react-dom/test-utils";
import Hydratation from '../../Hydratation';


const dashboard =
{ 
    hydratation: {
        dailyTarget:{
            value:0,
            unit:"",
            globalConsumption:0,
        },
        hydrates:[]
    }   
}
//Translation testing Add Beverage Button
test('Traduction du mot Breuvage en anglais', async() => {
    localStorage.setItem('userLanguage', 'en');
    act(() => { render(<Hydratation hydrate={dashboard.hydratation} hydrates={dashboard.hydratation.hydrates}
        globalConsumption={dashboard.hydratation.dailyTarget.globalConsumption}/>);
        const mot = screen.getByText('+ Beverage');
        expect(mot).toBeDefined();
    })
});

test('Traduction du mot Breuvage en espagnol', async() => {
    localStorage.setItem('userLanguage', 'es');
    act(() => { render(<Hydratation hydrate={dashboard.hydratation} hydrates={dashboard.hydratation.hydrates}
        globalConsumption={dashboard.hydratation.dailyTarget.globalConsumption}/>);
        const mot = screen.getByText('+ Bebida');
        expect(mot).toBeDefined();
    })
});

test('Traduction du mot Breuvage en francais', async() => {
    localStorage.setItem('userLanguage', 'fr');
    act(() => { render(<Hydratation hydrate={dashboard.hydratation} hydrates={dashboard.hydratation.hydrates}
        globalConsumption={dashboard.hydratation.dailyTarget.globalConsumption}/>);
        const mot = screen.getByText('+ Breuvage');
        expect(mot).toBeDefined();
    })
});
