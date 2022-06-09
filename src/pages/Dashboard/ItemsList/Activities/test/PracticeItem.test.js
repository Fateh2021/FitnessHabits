import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeItem from "../PracticeItem";

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

describe('PracticeItem', () => {
    var currentDate= {startDate: new Date("2022-06-03 10:30")}
    var practice1 = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : currentDate.startDate.toISOString(),
        'time' :  '02:00',
        'intensity' : 'INTENSITY_LOW'
    }
    var practice2 = {
        'id' : 2,
        'name' : 'Tennis',
        'date' : currentDate.startDate.toISOString(),
        'time' :  '01:00',
        'intensity' : 'INTENSITY_MEDIUM'
    }
    var practice3 = {
        'id' : 3,
        'name' : 'Karate',
        'date' : currentDate.startDate.toISOString(),
        'time' :  '01:00',
        'intensity' : 'INTENSITY_HIGH'
    }
    var practice4 = {
        'id' : 4,
        'name' : 'Training',
        'date' : currentDate.startDate.toISOString(),
        'time' :  '00:30',
        'intensity' : 'INTENSITY_HIIT'
    }
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var dateFormat = "YYYY-MM-DD";
        const pseudo_dashboard = {
            userUID,
            dateFormat
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

    test(" Test 1 : Traduction du mot Basse en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeItem practice={practice1}/>);
            const mot = screen.getAllByText(/Low/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 2 : Traduction du mot Moyenne en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeItem practice={practice2}/>)
            const mot = screen.getAllByText(/Medium/i);
            expect(mot).toBeDefined();
        })
    });
    test(" Test 3 : Traduction du mot Haute en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeItem practice={practice3}/>)
            const mot = screen.getAllByText(/High/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 4 : Traduction du mot Tres intense en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeItem practice={practice4}/>)
            const mot = screen.getAllByText(/HIIT/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 5 : Traduction du mot Basse en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeItem practice={practice1}/>);
            const mot= screen.getAllByText(/Abajo/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 6 : Traduction du mot Moyenne en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeItem practice={practice2}/>)
            const mot = screen.getAllByText(/Medio/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 7 : Traduction du mot Haute en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeItem practice={practice3}/>)
            const mot = screen.getAllByText(/Alto/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 8 : Traduction du mot Tres intense en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeItem practice={practice4}/>)
            const mot = screen.getAllByText(/Muy intenso/i);
            expect(mot).toBeDefined();
        })
    });
});
