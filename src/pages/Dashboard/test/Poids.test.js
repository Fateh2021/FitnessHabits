import React from "react";
import {render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import moment from "moment";
import {act} from "react-dom/test-utils";
import Poids from "../ItemsList/Poids";

import { formatWeight, formatToKG , find_new_category, formatDate, initPrefWeight, setPrefUnitWeight, formatDateShape, calculation_BMI} from '../../Weight/configuration/weightService';
import { doneAll } from 'ionicons/icons';

jest.mock("firebase", () => {
    return {
        auth: jest.fn(),
        database: jest.fn().mockReturnValue({
            ref: jest.fn().mockReturnValue({
                update: jest.fn(),
                once: jest.fn().mockReturnValue(new Promise(() => {})),
                orderByChild: jest.fn().mockReturnValue({
                    once: jest.fn().mockReturnValue(new Promise(() => {}))
                })
            })
        })
    };
});

const dailyPoids = "77" ;
const poidsInitial = "85";
const poidsCible = "56";
const dateCible = "2022-10-25";
const dateFormat = "YYYY-MM-DD";
const prefUnite = "KG";
var size = 165;
var poids={
    dailyPoids:"77",
    datePoids:"2022-03-17T15:24:10.792Z",
}

beforeEach(() => {
    var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
    var poids={
        dailyPoids:"77",
        datePoids:"2022-03-17T15:24:10.792Z",
    }
    var size="165";
    var dateFormat = "YYYY-MM-DD";
    const pseudo_dashboard = {
        userUID,
        poids,
        size,
        dateFormat,

    };
    localStorage.setItem("userUid", userUID);
    localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
    localStorage.setItem("prefUnitePoids", "KG");
    localStorage.setItem("userLanguage", "fr");
    localStorage.setItem("prefDateFormat", dateFormat);
    localStorage.setItem("poidsInitial", 85);
    localStorage.setItem("poidsCible", 56);
    localStorage.setItem("dateCible", "2022-10-25");
    localStorage.setItem("taille", 165);
});

afterEach(() => {
    localStorage.clear();
});

test(" Test 1 : Traduction du mot Poids en espagnol", async() => {
    localStorage.setItem("userLanguage", "es")
    act(() => { render(<Poids poids/>);
        const mot= screen.getAllByText(/Peso/i);
        expect(mot).toBeDefined();
    })
});

test(" Test 2 : Traduction du mot IMC (indice masse corporel) en espagnol", async() => {
    localStorage.setItem("userLanguage", "es")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/IMC/i);
        expect(mot).toBeDefined();
    })
});

test(" Test 3 : Traduction du mot Cible  en espagnol", async() => {
    localStorage.setItem("userLanguage", "es")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/Objetivo/i);
        expect(mot).toBeDefined();
    })
});

test(" Test 4 : Traduction du mot initial en espagnol", async() => {
    localStorage.setItem("userLanguage", "es")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/inicial/i);
        expect(mot).toBeDefined();
    })
});

test(" Test 5 : Traduction du mot Poids en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<Poids poids/>);
        const mot = screen.getAllByText(/Weight/i);
        expect(mot).toBeDefined();
    })
});

test(" Test 6 : Traduction du mot IMC (indice masse corporel) en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/BMI/i);
        expect(mot).toBeDefined();
    })
});
test(" Test 7 : Traduction du mot Cible en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/Target/i);
        expect(mot).toBeDefined();
    })
});

test(" Test 8 : Traduction du mot initial en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/Initial/i);
        expect(mot).toBeDefined();
    })
});


test(" Test 9 : Affichage des valeurs initialles dans le dashboard", async() => {
    act(() => { render(<Poids poids={poids}/>);
    })
    const initialWeight = screen.getByTestId("initWeight");
    const targetWeight = screen.getByTestId("targWeight");
    const targetDate = screen.getByTestId("targWeightDate");
    const dailyWeight = screen.getByTestId("dlyPoids");
    const favUnit = screen.getByTestId("prefUnit");
    const bmi = screen.getByTestId("imc");
    expect(initialWeight.textContent).toBe(parseFloat(poidsInitial).toFixed(1));
    expect(targetWeight.textContent).toBe(parseFloat(poidsCible).toFixed(1));
    expect(dailyWeight.textContent).toBe(parseFloat(dailyPoids).toFixed(1));
    expect(targetDate.textContent).toBe(formatDateShape(dateCible, dateFormat));
    expect(favUnit.textContent.toString().toUpperCase()).toBe(prefUnite);
    expect(bmi.textContent).toBe(calculation_BMI(size, dailyPoids));

});

test(" Test 10 : Changement du format de date préférée", async() => {
    localStorage.setItem("prefDateFormat", "DD/MM/YYYY");
    act(() => { render(<Poids poids={poids}/>);
    })
    const targetDate = screen.getByTestId("targWeightDate");
    const targetDateString= targetDate.textContent.toString();
    var targetDateReceived = moment(targetDateString, ["YYYY-MM-DD", localStorage.getItem("prefDateFormat")], true);
    expect(targetDateReceived.creationData().format).toBe("DD/MM/YYYY");
})

test(" Test 11 : changement de l'unité de poids préférée : KG à LBS", async() => {
    localStorage.setItem("prefUnitePoids", "LBS");
    act(() => { render(<Poids poids={poids}/>);
    })
    const favUnit = screen.getByTestId("prefUnit");
    const initialWeight = screen.getByTestId("initWeight");
    const targetWeight = screen.getByTestId("targWeight");
    const dailyWeight = screen.getByTestId("dlyPoids");
    expect(favUnit.textContent.toString().toUpperCase()).toBe("LBS");
    expect(initialWeight.textContent).toBe(formatWeight(poidsInitial));
    expect(targetWeight.textContent).toBe(formatWeight(poidsCible));
    expect(dailyWeight.textContent).toBe(formatWeight(dailyPoids));
})

test(" Test 12 : changement de l'unité de poids préférée : LBS à KG", async() => {
    localStorage.setItem("prefUnitePoids", "KG");
    act(() => { render(<Poids poids={poids}/>);
    })
    const favUnit = screen.getByTestId("prefUnit");
    const initialWeight = screen.getByTestId("initWeight");
    const targetWeight = screen.getByTestId("targWeight");
    const dailyWeight = screen.getByTestId("dlyPoids");
    expect(favUnit.textContent.toString().toUpperCase()).toBe("KG");
    expect(initialWeight.textContent).toBe(formatWeight(poidsInitial));
    expect(targetWeight.textContent).toBe(formatWeight(poidsCible));
    expect(dailyWeight.textContent).toBe(formatWeight(dailyPoids));
})

test(" Test 13 : Valeur de l'IMC si le Poids actuel change", async() => {
    poids.dailyPoids = 60;
    act(() => { render(<Poids poids={poids}/>);
    })
    const bmi = screen.getByTestId("imc");
    expect(bmi.textContent).toBe(calculation_BMI(size, poids.dailyPoids));
})

test(" Test 14 : Valeur de l'IMC si la taille change", async() => {
    localStorage.setItem("taille", 163);
    size = 163;
    act(() => { render(<Poids poids={poids}/>);
    })
    const bmi = screen.getByTestId("imc");
    expect(bmi.textContent).toBe(calculation_BMI(size,poids.dailyPoids));
})




/*
// Si il y a des messages d'erreurs, veuiller mettre en commentaire ce test, rouler les tests, décommenter et rerouler les tests.
test("tests - conversion du poids KG", () => {
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    act(() => {
        //const { getByTestId, getByLabelText } =  render(<Poids poids={ dashboard.poids } />);
        const weight = getByLabelText("weight");
        const select = getByTestId("select");
        fireEvent.change(select, { target: { value: "KG" } });
        expect(weight.value).toBe(dashboard.poids.dailyPoids);
    })
});

test("select down", async() => {
    act(() => {
        render(<Poids poids/>);
        const option = screen.getByTestId("select");
        fireEvent.click(option);

        expect("KG").toBeDefined();
    })
});

describe('Test sur la fonction -> setPrefUnitePoids', () => {
  it('should return undefined', async() => {
    setPrefUnitWeight('LBS');
    var tmp = localStorage.getItem("prefUnitePoids");
    expect(tmp).toBe('LBS');
  });
});

describe('Test sur la fonction -> initPrefPoids', () => {
  it('should return KG', async() => {
    initPrefWeight();
    const local_unite = localStorage.getItem('prefUnitePoids');
    expect(local_unite).toBe('KG');
  });
});

describe('Test sur la fonction -> trouver_nouvelle_categorie', () => {
  it('should return IDEAL_CATEGORY', async() => {
      expect(find_new_category(20)).toBe('IDEAL_CATEGORY');
  });
});

describe('Test sur la fonction -> formatPoids', () => {
  it('should return 77', async() => {
      expect(formatWeight(77)).toBe(77);
  });
});

describe("Test sur la fonction -> formatToKG", () => {
    it("should return 35.00", async() => {
        localStorage.setItem("prefUnitePoids", "LBS");
        expect(Number(formatToKG(77))).toBe(35.00);
    });
});

test("valeur de poids", async() => {
    act(() => { render(<Poids poids/>);
        const poids_input = screen.getByTestId("poids_input");
        const mot = document.getElementsByClassName("native-input sc-ion-input-md");
        expect(mot).toBeDefined();
    })
});
*/