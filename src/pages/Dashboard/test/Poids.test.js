import React from 'react';
import { render, screen } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import App from '../../../App';
import Poids from '../ItemsList/Poids';

import { formatPoids,formatToKG , trouver_nouvelle_categorie, formatDate, initPrefPoids, 
        getDailyPoids, setPrefUnitePoids, saveEntreeDePoids} from '../../Poids/configuration/poidsService';
import { doneAll } from 'ionicons/icons';

beforeEach(() => {
  var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
  var poids={
    dailyPoids:"77",
    datePoids:"2022-03-17T15:24:10.792Z"
  }
  var size="160";
  const pseudo_dashboard = {
    userUID,
    poids,
    size
  };
  localStorage.setItem('userUid', userUID);
  localStorage.setItem('dashboard', JSON.stringify(pseudo_dashboard));
  localStorage.setItem("prefUnitePoids", 'KG');
  localStorage.setItem('userLanguage', 'fr');
});

afterEach(() => {
  localStorage.clear();
});

test('Traduction du mot Poids en espagnol', async() => {
  localStorage.setItem('userLanguage', 'es')
  act(() => {render(<Poids poids/>);
    const mot = screen.getByText(/Peso/i);
    expect(mot).toBeDefined();
	})
});


test('Traduction du mot Poids en anglais', async() => {
  localStorage.setItem('userLanguage', 'en')
  act(() => {render(<Poids poids/>);
    const mot = screen.getByText(/Weight/i);
    expect(mot).toBeDefined();
  })
});

test('Traduction du mot Poids en anglais', async() => {
  localStorage.setItem('userLanguage', 'en')
  act(() => {render(<Poids poids/>)
    const mot = screen.getByText(/BMI/i);
    expect(mot).toBeDefined();
  })
});

/*
test('tests - conversion du poids Kg - LBS', () => {  
  const dash_ = JSON.parse(localStorage.getItem("dashboard"));  

  act(() => {
    const { getByTestId, getByLabelText } =  render(<Poids poids={ dash_.poids } />);
    const weight = getByLabelText("weight");
    const weight_in_LBS = (dash_.poids.dailyPoids * 2.2).toFixed(2);
    
    const select = getByTestId("select");
    fireEvent.change(select , { target: { value: "LBS" } });
    expect(weight.value).toBe(weight_in_LBS);
    fireEvent.change(select , { target: { value: "KG" } });
    expect(weight.value).toBe(dash_.poids.dailyPoids);  
  })
  
});
*/

/*
test('test - changement de poids, verification valeur de IMC', done => {
  const dash_ = JSON.parse(localStorage.getItem("dashboard"));
  act(() => {
  const { getByTestId, getByLabelText } = render(<Poids poids={ dash_.poids } />);
  const weight = getByTestId("poids_input");
  const imc = getByLabelText("imc");  
  act(() => {fireEvent.ionChange(weight, "99");})
  fireEvent.ionChange(weight, "99");
  
  expect((weight).value).toEqual("99");

  try{
    const wait_time = setTimeout(() => {
      const taille = dash_.size / 100;
      const x = 99 / (taille * taille);
      expect((imc).value).toEqual(x.toFixed(2));
    }, 2000); // attendre que la valeur de imc soit mise a jour
    done();
  }
  catch (error) {
    done(error);
  }  
})
});
*/
/*
test('select down', async() => {
  act(() => {
    render(<Poids poids/>);
    const s = screen.getByTestId('select');

    fireEvent.click(s);
  
    expect('LBS').toBeDefined();
    expect('KG').toBeDefined();
  })


});
*/
/*
describe('saveEntreeDePoids', () => {

  it('valeur should be 88', async() => {
    saveEntreeDePoids(88);
    var tmp = JSON.parse(localStorage.getItem("dashboard")).poids.dailyPoids;
    expect(tmp).toBe(88);

  });

});*/
/*
describe('setPrefUnitePoids', () => {

  it('should return undefined', async() => {
    setPrefUnitePoids('LBS');
    var tmp = localStorage.getItem("prefUnitePoids");    
    expect(tmp).toBe('LBS');
  });

});*/
/*
describe('getDailyPoids', () => {

  it('should return undefined', async() => {
    expect(getDailyPoids()).toBe(undefined);
  });

});*/
/*
describe('initPrefPoids', () => {

  it('should return KG', async() => {
    initPrefPoids();
    const local_unite = localStorage.getItem('prefUnitePoids');
    expect(local_unite).toBe('KG');
  });

});*/

/*
describe('formatDate', () => {

  it('should return 2022-03-16', async() => {
      expect(formatDate(new Date('2022-03-16'))).toBe('2022-03-16');
  });
});
*/
/*
describe('trouver_nouvelle_categorie', () => {

  it('should return CATEGORIE_IDEAL', async() => {
      expect(trouver_nouvelle_categorie(20)).toBe('CATEGORIE_IDEAL');
  });

});*/
/*
describe('formatPoids', () => {

  it('should return 77', async() => {
      expect(formatPoids(77)).toBe(77);
  });

});*/
/*
describe('formatToKG', () => {

  it('should return 35.00', async() => {
    localStorage.setItem("prefUnitePoids", 'LBS');
    expect(Number(formatToKG(77))).toBe(35.00);

  });

});*/
/*
test('valeur de poids', async() => {

  act(() => {render(<Poids poids/>);
    const  poids_input = screen.getByTestId('poids_input');
    const mot = document.getElementsByClassName('native-input sc-ion-input-md');
    expect(mot).toBeDefined();
  })


});
*/
/*
test('go to page de configuration', async() => {
  act(() => {
    render(<Poids poids/>);

    const img = screen.getByTestId('img_sauter');
    act(() => {fireEvent.click(img)})

    const pop_up_elem_kg = screen.getByText(/KG/i);
    expect(pop_up_elem_kg).toBeInTheDocument();
  })
});*/