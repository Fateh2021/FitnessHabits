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

    it("should not crash", () => {
        const { baseElement } = render(<Supplements />);
        expect(baseElement).toBeDefined();
    });

    it("should be closed by default", () => {
        const { getByTestId } = render(<Supplements />);
        const menuModal = getByTestId("menu");
        
        expect(menuModal).toBeFalsy();
    });

    it("should open as expected", () => {
        const { getByTestId } = render(<Supplements />);

        const btnOpen = getByTestId("btn-open");
        btnOpen.click();
        const menuModal = getByTestId("menu");
        
        expect(menuModal).toBeDefined();
    });

    /*
    it("should close as expected", () => {
        const mockCloseHandler = jest.mock().fn();
        const { baseElement, getByTestId } = render(<Sidebar handleClose={mockCloseHandler} pictureDisabled={true} />);

        const sidebar = getByTestId("sidebar");
        const btnClose = getByTestId("btn-close");
        btnClose.click();

        expect(sidebar.classList).toContain("sidebarClose");
        expect(mockCloseHandler).toBeCalledTimes(1);

    });

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

describe("How <Sidebar> behaves", () => {

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
});

jest.clearAllMocks();