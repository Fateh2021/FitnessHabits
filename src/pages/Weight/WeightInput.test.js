import React from "react";
import {render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import WeightInput from "./WeightInput";

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

const dailyWeight = 77;
const showInputWeight = true;
const dateFormat = "AAAA/MM/DD"

beforeEach(() => {
    var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
    var poids={
        dailyPoids:"77",
        datePoids:"2022-03-17T15:24:10.792Z"
    }
    var size="160";
    const pseudo_dashboard = {
        userUID,
        poids,
        size
    };

    localStorage.setItem("userUid", userUID);
    localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
    localStorage.setItem("prefUnitePoids", "KG");
    localStorage.setItem("userLanguage", "fr");
    localStorage.setItem("prefDateFormat", dateFormat);
});

afterEach(() => {
    localStorage.clear();
});

test("affiche Nouveau poids et Ajouter si en francais", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
    })

    const mot1 = screen.getByText(/Nouveau poids/i);
    const mot2 = screen.getByText(/Ajouter/i);
    expect(mot1).toBeDefined();
    expect(mot2).toBeDefined();
});

test("Traduction des mots Nouveau poids et Ajouter en espagnol", async() => {
    localStorage.setItem("userLanguage", "es")
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
    })

    const mot1 = screen.getByText(/Nuevo peso/i);
    const mot2 = screen.getByText(/Agregar/i);
    expect(mot1).toBeDefined();
    expect(mot2).toBeDefined();
});

test("Traduction des mots Nouveau poids et Ajouter en anglais", async() => {
    localStorage.setItem("userLanguage", "en")
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
    })

    const mot1 = screen.getByText(/New weigth/i);
    const mot2 = screen.getByText(/Add/i);
    expect(mot1).toBeDefined();
    expect(mot2).toBeDefined();
});

test("Valeurs initialles", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
    })

    const weight = screen.getByTestId("weight");
    const select = screen.getByTestId("select");
    //doit ajouter pour la date aujourd'hui

    expect(weight.value).toBe(parseFloat(dailyWeight).toFixed(1).toString());
    expect(select.value).toBe("KG");
});

test("Changement de KG a LBS", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight}
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat} 
                            setDailyWeight={jest.fn()} 
                            adjustUnit={jest.fn()}/>);
    })

    const select = screen.getByTestId("select");
    const weight = screen.getByTestId("weight");  

    act(() => { 
        fireEvent.ionChange(select, "LBS");
    })

    expect(weight.value).toBe((dailyWeight * 2.2).toString());
    expect(select.value).toBe("LBS");
    
});

test("Changement de LBS a KG", async() => {
    localStorage.setItem("prefUnitePoids", "LBS");
    act(() => { render(<WeightInput dailyWeight={dailyWeight * 2.2}
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat} 
                            setDailyWeight={jest.fn()} 
                            adjustUnit={jest.fn()}/>);
    })
    const weight = screen.getByTestId("weight");
    const select = screen.getByTestId("select");

    act(() => { 
        fireEvent.ionChange(select, "KG");
    })

    expect(weight.value).toBe(parseFloat(dailyWeight).toFixed(1).toString());
    expect(select.value).toBe("KG");
});

test("Changement de valeur pour le poids", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
    })

    const weight = screen.getByTestId("weight");

    act(() => { 
        fireEvent.ionChange(weight, 100)
    }) 

    expect(weight.value).toBe(100);
});

test("Changement de valeur pour la date", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
    })

    const date = screen.getByTestId("date");

    act(() => { 
        fireEvent.ionChange(date, "2021-06-04")
    }) 

    expect(date.value).toBe("2021-06-04");
    expect(date.getAttribute('display-format')).toBe("AAAA/MM/DD");
});

test("Changement de valeur pour l'heure", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat}/>);
})

    const time = screen.getByTestId("time");

    act(() => { 
    fireEvent.ionChange(time, "06:30")
    }) 
    
    expect(time.value).toBe("06:30");
    expect(time.getAttribute('display-format')).toBe("HH:mm");
});

// don't know how to call the onDidDismiss
/*test("Fermer le modal", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} showInputWeight={showInputWeight} dateFormat={dateFormat}/>);
        const modal = screen.getByTestId("modal");
        console.log(modal);
        fireEvent.ionDidClose(modal)
    })
});*/

test("Cliquer sur Ajouter", async() => {
    act(() => { render(<WeightInput dailyWeight={dailyWeight} 
                            showInputWeight={showInputWeight} 
                            dateFormat={dateFormat} 
                            onSubmit={jest.fn()} />);
        const add = screen.getByTestId("add");
        fireEvent.click(add);
    })
});