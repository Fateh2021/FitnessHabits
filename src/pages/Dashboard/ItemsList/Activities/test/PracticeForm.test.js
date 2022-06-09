import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeForm from "../PracticeForm";

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

describe('PracticeForm', () => {
    var practice = {
        'id' : 1,
        'name' : 'Jogging',
        'time' :  '02:00',
        'intensity' : 'INTENSITY_LOW'
    }
    var currentDate= {startDate: "2022-06-03 10:30"}
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var dateFormat = "YYYY-MM-DD";
        const pseudo_dashboard = {
            userUID,
            dateFormat,

        };
        localStorage.setItem("userUid", userUID);
        localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
        localStorage.setItem("prefUnitePoids", "KG");
        localStorage.setItem("userLanguage", "fr");
        localStorage.setItem("prefDateFormat", dateFormat);
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });

    test(" Test 1 : Traduction des mots Ajouter activite en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm practice={practice}/>);
            const mot = screen.getAllByText(/Add activity/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 2 : Traduction des mots Modifier activite en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Edit activity/i);
            expect(mot).toBeDefined();
        })
    });
    test(" Test 3 : Traduction du mot Duree en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Duration/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 4 : Traduction du mot Ajouter en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Add/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 5 : Traduction du mot Modifier en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Edit/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 6 : Traduction des mots Ajouter activite en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm practice={practice}/>);
            const mot= screen.getAllByText(/Añadir actividad/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 7 : Traduction des mots Modifier activite en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Editar actividad/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 8 : Traduction du mot Duree en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Duración/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 9 : Traduction du mot Ajouter en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Añadir/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 10 : Traduction du mot Modifier en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm practice={practice}/>)
            const mot = screen.getByText(/Editar/i);
            expect(mot).toBeDefined();
        })
    });    
});
