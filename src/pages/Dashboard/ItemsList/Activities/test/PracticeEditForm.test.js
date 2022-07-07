import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeEditForm from "../PracticeEditForm";

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

describe('PracticeEditForm', () => {
    var practice = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : "2022-06-03",
        'time' :  480,
        'duration' : 120,
        'intensity' : 'INTENSITY_MEDIUM'
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

    test(" Test 1 : Translation of words to modify an activity in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeEditForm isOpen={true} practice={practice}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');
            const date = screen.getByTestId('modifyDate');
            const time = screen.getByTestId('modifyTime');
            const duration = screen.getByTestId('modifyDuration');
            const intensity = screen.getByTestId('modifyIntensity');

            expect(title.textContent.toString()).toBe("Edit activity");
            expect(submit.textContent.toString()).toBe("Edit");
            expect(date.textContent.toString()).toBe("Date");
            expect(time.textContent.toString()).toBe("Start time");
            expect(duration.textContent.toString()).toBe("Duration");
            expect(intensity.textContent.toString()).toBe("Intensity");
        })
    });

    test(" Test 2 : Translating words to modify an activity in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeEditForm isOpen={true} practice={practice}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');
            const date = screen.getByTestId('modifyDate');
            const time = screen.getByTestId('modifyTime');
            const duration = screen.getByTestId('modifyDuration');
            const intensity = screen.getByTestId('modifyIntensity');

            expect(title.textContent.toString()).toBe("Editar actividad");
            expect(submit.textContent.toString()).toBe("Editar");
            expect(date.textContent.toString()).toBe("Fecha");
            expect(time.textContent.toString()).toBe("Hora de inicio");
            expect(duration.textContent.toString()).toBe("Duración");
            expect(intensity.textContent.toString()).toBe("Intensidad");
        })
    });

    test(" Test 3 : Displaying practice values in the form", async() => {
        await act(async () => { render(<PracticeEditForm isOpen={true} practice={practice}/>)
            await waitForIonicReact();
            const name = screen.getByTestId('nameValue');
            const date = screen.getByTestId('dateValue');
            const time = screen.getByTestId('timeValue');
            const duration = screen.getByTestId('durationValue');
            const intensity = screen.getByTestId('intensityValue');

            expect(name.value).toBe("Jogging");
            expect(date.value).toBe("2022-06-03");
            expect(time.value).toBe("08:00");
            expect(duration.value).toBe("02:00");
            expect(intensity.value).toBe("INTENSITY_MEDIUM");
        })
    });
});
