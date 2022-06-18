import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
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
    var currentDate= {startDate: new Date("2022-06-03 10:30")}
    var practice = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : currentDate.startDate.toISOString(),
        'time' :  120,
        'intensity' : 'INTENSITY_LOW'
    }
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

    test(" Test 1 : Traduction des mots pour ajouter une activite en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm isOpen={true}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');
            const duration = screen.getByTestId('modifyDuration');
            const intensity = screen.getByTestId('modifyIntensity');

            expect(title.textContent.toString()).toBe("Add activity");
            expect(submit.textContent.toString()).toBe("Add");
            expect(duration.textContent.toString()).toBe("Duration");
            expect(intensity.textContent.toString()).toBe("Intensity");
        })
    });

    test(" Test 2 : Traduction des mots pour modifier une activite en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeForm isOpen={true} practice={practice}/>)
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');

            expect(title.textContent.toString()).toBe("Edit activity");
            expect(submit.textContent.toString()).toBe("Edit");
        })
    });

    test(" Test 3 : Traduction des mots pour ajouter une activite en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm isOpen={true}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');
            const duration = screen.getByTestId('modifyDuration');
            const intensity = screen.getByTestId('modifyIntensity');

            expect(title.textContent.toString()).toBe("Añadir actividad");
            expect(submit.textContent.toString()).toBe("Añadir");
            expect(duration.textContent.toString()).toBe("Duración");
            expect(intensity.textContent.toString()).toBe("Intensidad");
        })
    });

    test(" Test 4 : Traduction des mots pour modifier une activite en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeForm isOpen={true} practice={practice}/>)
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');

            expect(title.textContent.toString()).toBe("Editar actividad");
            expect(submit.textContent.toString()).toBe("Editar");
        })
    });

});
