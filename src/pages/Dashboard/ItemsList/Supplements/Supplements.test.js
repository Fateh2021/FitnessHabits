import React from "react";
import { render } from "@testing-library/react";
import firebase from "firebase";
import "firebase/auth";
import Supplements from "../Supplements.jsx";
import { ionFireEvent } from "@ionic/react-test-utils";

const testProfile = {
    pseudo: "testUser",
    email: "testUser@fitnesshabit.com",
    size: "999",
    gender: "N",
    dateFormat: "dd-LLL-yyyy",
};

jest.mock("firebase", () => {
    return {
        auth: jest.fn(),
        database: jest.fn(),
    };
});

describe("How <Supplements> is rendered", () => {
    beforeAll(() => {
        localStorage.setItem("profile", JSON.stringify(testProfile));
    });

    afterAll(() => { localStorage.removeItem("profile") });

    it("Main menu should not crash", () => {
        const { baseElement } = render(<Supplements />);
        expect(baseElement).toBeDefined();
    });

    it("Main menu should be closed by default", () => {
        const { queryByTestId } = render(<Supplements />);
        const menuModal = queryByTestId("menu");
        expect(menuModal).toBeNull();
    });

    
    it("Main menu should open as expected", () => {
        const { getByTestId } = render(<Supplements />);

        const btnOpen = getByTestId("btn-open");
        btnOpen.click();
        const menuModal = getByTestId("menu");

        expect(menuModal).toBeDefined();
    });

    it("Main menu should close as expected", () => {
        const { getByTestId , queryByTestId} = render(<Supplements />);

        const btnOpen = getByTestId("btn-open");
        btnOpen.click();
        const btnClose = getByTestId("iconeRetourMenu");
        btnClose.click();
        
        const menuModal = queryByTestId("menu");
        expect(menuModal).toBeNull();
    });

    it("add supplement form should open as expected", () => {
        const { getByTestId } = render(<Supplements />);

        const boutonAfficherMenu = getByTestId("btn-open");
        boutonAfficherMenu.click();

        const boutonAjouterSupplement = getByTestId("boutonAjouterSupplement");
        boutonAjouterSupplement.click();

        const formulaireAjouterSupplement = getByTestId("formulaireAjouterSupplement");

        expect(formulaireAjouterSupplement).toBeDefined();
    });

    it("add supplement form should close as expected", () => {
        const { getByTestId, queryByTestId } = render(<Supplements />);

        const boutonAfficherMenu = getByTestId("btn-open");
        boutonAfficherMenu.click();

        const boutonAjouterSupplement = getByTestId("boutonAjouterSupplement");
        boutonAjouterSupplement.click();
        boutonAjouterSupplement.click();

        const formulaireAjouterSupplement = queryByTestId("formulaireAjouterSupplement");

        expect(formulaireAjouterSupplement).toBeNull();
    });

    /*

    it("should display profile information", () => {
        const { getByTestId } = render(<Sidebar pictureDisabled={true} />);
        const usernameElement = getByTestId("username");
        const heightElement = getByTestId("height");
        const genderElement = getByTestId("gender");
        const emailElement = getByTestId("email");
        const dateFormatElement = getByTestId("dateFormat");

        expect(usernameElement.textContent).toEqual(testProfile.pseudo);
        expect((heightElement.value*100).toString()).toEqual(testProfile.size);
        expect(genderElement.value).toEqual(testProfile.gender);
        expect(emailElement.value).toEqual(testProfile.email);
        expect(dateFormatElement.value).toEqual(testProfile.dateFormat);
    });
    */
});

/*describe("How <Sidebar> behaves", () => {

    beforeEach(() => {
        localStorage.setItem("profile", JSON.stringify(testProfile));
    });

    afterAll(() => { localStorage.removeItem("profile") });

    it("should save a new supplement on pressing save button with valid values", () => {
        const mockSaveHandler = jest.mock().fn();
        const mockDonneesAjoutSontValides = jest.mock().fn();

        const { getByTestId } = render(
            <Supplements
                testFunctions={{
                    handleSave: mockSaveHandler,
                    donneesAjoutSontValides: mockDonneesAjoutSontValides,
                }}
            />
        );
        const btnSave = getByTestId("btn-save");
        btnSave.click();

        // Check que le toast de data saved existe et qu'il est defined
        // Check que les données ont été sauvegardé dans Firebase

        expect(mockSaveHandler).toBeCalledTimes(1);
        expect(mockDonneesAjoutSontValides).toBeCalledTimes(1);
    });

    it("should display an error when trying to save with invalid values", () => {
        const { getByTestId } = render(<Supplements />);

        const btnSave = getByTestId("btn-save");
        btnSave.click();

        // Check que le toast d'erreur existe et qu'il est defined
        // Check que rien n'a été sauvegardé dans Firebase
    });
}); */

jest.clearAllMocks();
