import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {BrowserRouter} from "react-router-dom";
import App from "../../../App";

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(ui, { wrapper: BrowserRouter });
}

test("Traduction du mot Initial Poids en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    renderWithRouter(<App />, { route: "/ConfigurationPoids" });
    const mot = screen.getByText(/Initial weight/i);
    expect(mot).toBeDefined();
});
