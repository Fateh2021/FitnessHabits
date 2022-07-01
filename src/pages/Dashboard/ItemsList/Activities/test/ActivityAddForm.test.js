import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import ActivityAddForm from "../ActivityAddForm";

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

describe('ActivityAddForm', () => {
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

    test(" Test 1 : Translation of words to add an activity in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<ActivityAddForm isOpen={true}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('addTitle');
            const submit = screen.getByTestId('addSubmit');
            const duration = screen.getByTestId('addDuration');
            const intensity = screen.getByTestId('addIntensity');

            expect(title.textContent.toString()).toBe("Add usual activity");
            expect(submit.textContent.toString()).toBe("Add");
            expect(duration.textContent.toString()).toBe("Duration");
            expect(intensity.textContent.toString()).toBe("Intensity");
        })
    });

    test(" Test 2 : Translating words to add an activity in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<ActivityAddForm isOpen={true}/>);
            await waitForIonicReact();
            const title = screen.getByTestId('addTitle');
            const submit = screen.getByTestId('addSubmit');
            const duration = screen.getByTestId('addDuration');
            const intensity = screen.getByTestId('addIntensity');

            expect(title.textContent.toString()).toBe("Añadir actividad habitual");
            expect(submit.textContent.toString()).toBe("Añadir");
            expect(duration.textContent.toString()).toBe("Duración");
            expect(intensity.textContent.toString()).toBe("Intensidad");
        })
    });

    test(" Test 3 : Displaying default values in the form", async() => {
        await act(async () => { render(<ActivityAddForm isOpen={true}/>)
            await waitForIonicReact();
            const name = screen.getByTestId('nameValue');
            const time = screen.getByTestId('timeValue');
            const duration = screen.getByTestId('durationValue');
            const intensity = screen.getByTestId('intensityValue');

            expect(name.value).toBe("");
            expect(time.value).toBe("00:00");
            expect(duration.value).toBe("00:00");
            expect(intensity.value).toBe("INTENSITY_LOW");
        })
    });
});
