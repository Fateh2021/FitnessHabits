import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent} from "@ionic/react-test-utils";
import {act} from "react-dom/test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import Supplements from "../Supplements"

jest.mock("firebase", () => {
    return {
        auth: jest.fn(),
        database: jest.fn().mockReturnValue({
            ref: jest.fn().mockReturnValue({
                update: jest.fn()
            })
        }),
        storage: jest.fn(),
    };
});

describe("Supplements", () => {
    var currentDate= {startDate: "2022-06-13 20:00"}

    beforeEach(() => {
        var mockUserUID = "testsupplement";
        var supplement = {
            listeMedSup: []
        };
        const mockDashboard = {
            mockUserUID,
            supplement
        };

        localStorage.setItem("userUid", mockUserUID);
        localStorage.setItem("dashboard", JSON.stringify(mockDashboard));
        localStorage.setItem("userLanguage", "fr");
    });

    test("Test 1 : Affichage du menu", () => {
        act(() => { 
            render(<Supplements currentDate={currentDate}/>);
        })
        const boutonAfficherMenu = screen.getByTestId("boutonAfficherMenu");

        act(() => { 
            ionFireEvent.click(boutonAfficherMenu);
        })

        const menu = screen.getByTestId("menu");
        
        expect(menu).toBeDefined();
    });

    test("Test 2 : Affichage du formulaire d'ajout", () => {
        act(() => { 
            render(<Supplements currentDate={currentDate}/>);
        })
        const boutonAfficherMenu = screen.getByTestId("boutonAfficherMenu");

        act(() => { 
            ionFireEvent.click(boutonAfficherMenu);
        })

        const boutonAjouterSupplement = screen.getByTestId("boutonAjouterSupplement");
        
        act(() => { 
            ionFireEvent.click(boutonAjouterSupplement);
        })

        const formulaireAjouterSupplement = screen.getByTestId("formulaireAjouterSupplement");

        expect(formulaireAjouterSupplement).toBeDefined();
    });

    afterEach(() => {
        cleanup();

        jest.clearAllMocks();

        localStorage.clear();
    });

});












