import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeList from "../PracticeList";

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

describe('PracticeList', () => {
    var currentDate= {startDate: new Date("2022-06-03 10:30")}
    var practice = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : currentDate.startDate.toISOString(),
        'time' :  120,
        'intensity' : 'INTENSITY_LOW'
    }
    var activities= []
    var practices = [practice]
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

    test(" Test 1 : Traduction du mot Activites en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeList activities={activities} practices={practices} currentDate={currentDate}/>);
            const mot = screen.getByTestId('moduleTitle')
            expect(mot.textContent.toString()).toBe("Activities");
        })
    });

    test(" Test 2 : Traduction du mot Activites en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeList activities={activities} practices={practices} currentDate={currentDate}/>);
            const mot = screen.getByTestId('moduleTitle')
            expect(mot.textContent.toString()).toBe("Ocupaciones");
        })
    });

    test(" Test 3 : Affichage d'une pratique d'activite", async() => {
        await act(async () => {
            const modal = render(<PracticeList activities={activities} practices={practices} currentDate={currentDate}/>);
            await waitForIonicReact();
            modal.getByTestId("openPracticeList").click()
            const pratique = screen.getByTestId('practiceItem1')
            expect(pratique).toBeDefined();
        })
    });

});
