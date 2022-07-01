import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import ActivityEditForm from "../ActivityEditForm";

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

describe('ActivityEditForm', () => {
    var activity = {
        'id' : 1,
        'name' : 'Jogging',
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
        await act(async () => { render(<ActivityEditForm isOpen={true} activity={activity}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');
            const duration = screen.getByTestId('modifyDuration');
            const intensity = screen.getByTestId('modifyIntensity');

            expect(title.textContent.toString()).toBe("Edit activity");
            expect(submit.textContent.toString()).toBe("Edit");
            expect(duration.textContent.toString()).toBe("Duration");
            expect(intensity.textContent.toString()).toBe("Intensity");
        })
    });

    test(" Test 2 : Translating words to modify an activity in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<ActivityEditForm isOpen={true} activity={activity}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('modifyTitle');
            const submit = screen.getByTestId('modifySubmit');
            const duration = screen.getByTestId('modifyDuration');
            const intensity = screen.getByTestId('modifyIntensity');

            expect(title.textContent.toString()).toBe("Editar actividad");
            expect(submit.textContent.toString()).toBe("Editar");
            expect(duration.textContent.toString()).toBe("Duración");
            expect(intensity.textContent.toString()).toBe("Intensidad");
        })
    });

    test(" Test 3 : Displaying activity values in the form", async() => {
        await act(async () => { render(<ActivityEditForm isOpen={true} activity={activity}/>)
            await waitForIonicReact();
            const name = screen.getByTestId('nameValue');
            const duration = screen.getByTestId('durationValue');
            const intensity = screen.getByTestId('intensityValue');

            expect(name.value).toBe("Jogging");
            expect(duration.value).toBe("02:00");
            expect(intensity.value).toBe("INTENSITY_MEDIUM");
        })
    });
});
