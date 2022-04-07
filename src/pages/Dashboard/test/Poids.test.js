import React from "react";
import {render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import Poids from "../ItemsList/Poids";

import { formatWeight, formatToKG , find_new_category, formatDate, initPrefWeight, setPrefUnitWeight} from '../../Weight/configuration/weightService';
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
    localStorage.setItem("userUid", userUID);
    localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
    localStorage.setItem("prefUnitePoids", "KG");
    localStorage.setItem("userLanguage", "fr");
});

afterEach(() => {
    localStorage.clear();
});

test("Traduction du mot Poids en espagnol", async() => {
    localStorage.setItem("userLanguage", "es")
    act(() => { render(<Poids poids/>);
        const mot = screen.getByText(/Peso/i);
        expect(mot).toBeDefined();
    })
});

test("Traduction du mot Poids en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<Poids poids/>);
        const mot = screen.getByText(/Weight/i);
        expect(mot).toBeDefined();
    })
});

test("Traduction du mot Poids en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<Poids poids/>)
        const mot = screen.getByText(/BMI/i);
        expect(mot).toBeDefined();
    })
});

// Si il y a des messages d'erreurs, veuiller mettre en commentaire ce test, rouler les tests, décommenter et rerouler les tests.
test("tests - conversion du poids KG", () => {
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    act(() => {
        const { getByTestId, getByLabelText } =  render(<Poids poids={ dashboard.poids } />);
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