import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {act} from "react-dom/test-utils";
import Food from "../Food";
import {ionFireEvent} from "@ionic/react-test-utils";
import {fireEvent} from "@testing-library/react";

const dict = require("../../../../../translate/Translation.json");

let container = null;

let originalDashboard;
let originalLanguage;

beforeAll(() => {
    originalDashboard = localStorage.getItem("dashboard");
    originalLanguage = localStorage.getItem("userLanguage")
});

afterAll(() => {
    localStorage.setItem("dashboard", originalDashboard);
    localStorage.setItem("userLanguage", originalLanguage);
});

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const setUp = (mock, testFunc) => {
    localStorage.setItem("dashboard", JSON.stringify(mock));
    const categoryKey = "someFoodCategory";

    render(<Food 
        categoryKey = { categoryKey }
        updateFoodConsumptionCallback = { () => { } }
        macroNutrimentConsumption = { mock.food.categories[categoryKey].macroNutrimentConsumption }
        foodItems = {mock.food.categories[categoryKey].items}
        currentDate = { new Date() }
        foodItemToEdit = { undefined }
        itemContainerDisplayStatus = { false }
        test = { true } 
    />, container);

    testFunc();
    localStorage.removeItem("dashboard");
};

const initDummyDashboard = () => {
    const dummyDashboard = {
        food: {
            globalMacroNutrimentConsumption: {
                proteins: 0,
                carbs: 0,
                fibre: 0,
                fats: 0
            },
            categories: {
                someFoodCategory: {
                    macroNutrimentConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                }
            }
        }
    };
    return dummyDashboard;
};

const setUpNegativeMacroNutriment = (buttonId, targetData, targetTotal) => {
    const updateFunc = (id, initialAmount, targetIncrement) => {
        const button = document.getElementById(buttonId);
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        const popup = document.getElementById("divPopUp1-1");
        const input = popup.getElementsByClassName("divAddTextNut")[id];
        input.value = initialAmount + targetIncrement;
        ionFireEvent.ionChange(input);
        const currentMacroQty = input.value;
        expect(currentMacroQty).toBe(targetTotal);
    };

    for (let i = 0; i < targetData.length; i++) {
        updateFunc(i, targetData[i].initialAmount, targetData[i].targetIncrement);
    }
};

const populateFoodItems = (start, end, expected, expectationFunc = (e) => {}) => {
    const addButton = document.getElementById("addButton");
    for (let i = start; i < end; i++) {
        addButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        const foodItemPopup = document.getElementById("divPopUp1-1");

        const name = foodItemPopup.getElementsByClassName('divAddText')[0];
        const qty = foodItemPopup.getElementsByClassName('divAddText')[1];
        const unit = foodItemPopup.querySelector('#materialSelectAddHyd');
        const proteins = foodItemPopup.getElementsByClassName('divAddTextNut')[0];
        const carbs = foodItemPopup.getElementsByClassName('divAddTextNut')[1];
        const fibre = foodItemPopup.getElementsByClassName('divAddTextNut')[2];
        const fats = foodItemPopup.getElementsByClassName('divAddTextNut')[3];

        name.value = expected[i].name;
        ionFireEvent.ionChange(name);

        qty.value = expected[i].qty;
        ionFireEvent.ionChange(qty);

        unit.value = expected[i].unit;
        fireEvent.change(unit);

        proteins.value = expected[i].proteins;
        ionFireEvent.ionChange(proteins);

        carbs.value = expected[i].carbs;
        ionFireEvent.ionChange(carbs);

        fibre.value = expected[i].fibre;
        ionFireEvent.ionChange(fibre);

        fats.value = expected[i].fats;
        ionFireEvent.ionChange(fats);

        const saveButton = foodItemPopup.querySelector("#saveButton");
        saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expectationFunc(i);
    }
};

it("test negative quantity on macro-nutriments", () => {
    const dummyDashboard = initDummyDashboard();

    const targetData = [
        {
            initialAmount: 2,
            targetIncrement: -20
        },
        {
            initialAmount: 13,
            targetIncrement: -14
        },
        {
            initialAmount: 0,
            targetIncrement: -5
        },
        {
            initialAmount: 44,
            targetIncrement: -44
        }
    ];
    setUp(dummyDashboard, () => { setUpNegativeMacroNutriment("addButton", targetData, 0); });
});

it("test div visibility toggle", () => {
    const dummyDashboard = initDummyDashboard();
    const moduleNames = ["proteinFood", "grainFood", "vegetables", "fruit", "dairyProducts"];

    const getToggledValue = (i) => {
        return i % 2 == 0 ? "block" : "none";
    }

    moduleNames.forEach((moduleName, index) => 
    {
        act(() => {
            render(<Food 
                categoryKey = { moduleNames[index] }
                updateFoodConsumptionCallback = { () => {} }
                macroNutrimentConsumption = { dummyDashboard.food.categories.someFoodCategory.macroNutrimentConsumption }
                foodItems = { dummyDashboard.food.categories.someFoodCategory.items }
                currentDate = { new Date() }
                foodItemToEdit = { undefined }
                itemContainerDisplayStatus = { false }
            />, 
            container);
        });
        const moduleImage = document.getElementById("moduleImg").src;
        expect(moduleImage).toBe(`http://localhost/assets/${ moduleNames[index] }.jpg`);

        const arrow = document.getElementById("proteinArrow");
        const elem = document.getElementById(moduleName);
        elem.style.display = "none";

        act(() => {
            for (let i = 0; i < 5; i++) {
                arrow.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                expect(elem.style.display).toBe(getToggledValue(i));
            }
        });
    });
});

it("test save item", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            name: "food item 0",
            qty: 34,
            unit: "unit",
            proteins: 12,
            carbs: 56,
            fibre: 456,
            fats: 3
        },
        { 
            name: "food item 1",
            qty: 45,
            unit: "unit",
            proteins: 0,
            carbs: 14,
            fibre: 9,
            fats: 0
        },
        {
            name: "food item 2",
            qty: 200,
            unit: "unit",
            proteins: 45,
            carbs: 21,
            fibre: 34,
            fats: 18
        },
        {
            name: "food item 3",
            qty: 78,
            unit: "unit",
            proteins: 90,
            carbs: 110,
            fibre: 0,
            fats: 0
        },
        {
            name: "food item 4",
            qty: 1,
            unit: "unit",
            proteins: 67,
            carbs: 900,
            fibre: 121,
            fats: 450
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        expect(items.length).toBe(0);
    
        const expectationFunc = (index) => {
            expect(items.length).toBe(index + 1);
            expect(document.getElementById(items[index].id) === undefined && document.getElementById(items[index].id) === null).toBe(false);
            // Vu que chaque nouvel aliment est ajouté au début du tableau <code> items </code> (avec la fonction unshift()), on doit tester les valeurs de l'élément à l'indice 0 à chaque tour de boucle.  
            expect(items[0].name).toBe(expected[index].name);
            expect(items[0].qty).toBe(expected[index].qty);
            expect(items[0].unit).toBe(expected[index].unit);
            expect(items[0].proteins).toBe(expected[index].proteins);
            expect(items[0].carbs).toBe(expected[index].carbs);
            expect(items[0].fibre).toBe(expected[index].fibre);
            expect(items[0].fats).toBe(expected[index].fats);
        };
        
        populateFoodItems(0, 5, expected, expectationFunc);

        expect(items.length).toBe(5);

        const localStorageDashboard = JSON.parse(localStorage.getItem("dashboard"));

        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins).toBe(214);
        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs).toBe(1101);
        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre).toBe(620);
        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats).toBe(471);

        expect(document.getElementById('proteinConsumptionPerCategory').innerHTML).toBe('214');
        expect(document.getElementById('carbConsumptionPerCategory').innerHTML).toBe('1101');
        expect(document.getElementById('fibreConsumptionPerCategory').innerHTML).toBe('620');
        expect(document.getElementById('fatConsumptionPerCategory').innerHTML).toBe('471');
    };
    setUp(dummyDashboard, testFunc);
});

it("test delete item", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            name: "food item 0",
            qty: 1,
            unit: "unit",
            proteins: 12,
            carbs: 34,
            fibre: 56,
            fats: 36
        },
        {
            name: "food item 1",
            qty: 1,
            unit: "unit",
            proteins: 6,
            carbs: 73,
            fibre: 11,
            fats: 2
        },
        {
            name: "food item 2",
            qty: 1,
            unit: "unit",
            proteins: 440,
            carbs: 156,
            fibre: 67,
            fats: 0
        },
        {
            name: "food item 3",
            qty: 1,
            unit: "unit",
            proteins: 0,
            carbs: 16,
            fibre: 24,
            fats: 1
        },
        {
            name: "food item 4",
            qty: 1,
            unit: "unit",
            proteins: 45,
            carbs: 0,
            fibre: 0,
            fats: 100
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        populateFoodItems(0, 5, expected);

        expect(items.length).toBe(5);

        let proteinConsumptionPerCategory = 503;
        let carbConsumptionPerCategory = 279;
        let fibreConsumptionPerCategory = 158;
        let fatConsumptionPerCategory = 139;

        let nbItems = items.length;

        for (let i = 0; i < 5; i++) {
            const localStorageDashboard = JSON.parse(localStorage.getItem("dashboard"));
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins).toBe(proteinConsumptionPerCategory);
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs).toBe(carbConsumptionPerCategory);
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre).toBe(fibreConsumptionPerCategory);
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats).toBe(fatConsumptionPerCategory);
            // La fonction <code> splice </code> utilisée dans <code> deleteItem </code> du module Nourriture modifie le tableau <code> items </code> 'in place' 
            // et décale les éléments à chaque fois après en avoir enlevé un. Donc, l'indice de l'élément courant va demeurer 0 à chaque fois.
            const currentFoodItem = items[0];   
            const currentFoodItemHDOM = document.getElementById(items[0].id);

            const showButton = currentFoodItemHDOM.querySelector("#showButton");
            showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const foodItemPopup = document.getElementById('divPopUp1-1')
            const proteins = foodItemPopup.getElementsByClassName('divAddTextNut')[0];
            const carbs = foodItemPopup.getElementsByClassName('divAddTextNut')[1];
            const fibre = foodItemPopup.getElementsByClassName('divAddTextNut')[2];
            const fats = foodItemPopup.getElementsByClassName('divAddTextNut')[3];
            // Il est nécessaire de déclencher la fermeture du popup ici afin de ne pas avoir le même popup s'ouvrir à la prochaine itération.
            const closeButton = foodItemPopup.querySelector("#closeButton");
            closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const deleteButton = document.getElementById("deleteButton");
            deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            expect(items.includes(currentFoodItem)).toBe(false);
            expect(items.length).toBe(--nbItems);

            proteinConsumptionPerCategory -= proteins.value;
            carbConsumptionPerCategory -= carbs.value;
            fibreConsumptionPerCategory -= fibre.value;
            fatConsumptionPerCategory -= fats.value;
        }
        expect(items.length).toBe(0);
    }; 
    setUp(dummyDashboard, testFunc);
});

it("test edit and save", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            name: "food item 0",
            qty: 1,
            unit: "unit",
            proteins: 189,
            carbs: 567,
            fibre: 80,
            fats: 11
        },
        {
            name: "food item 1",
            qty: 1,
            unit: "unit",
            proteins: 14,
            carbs: 1,
            fibre: 0,
            fats: 39
        },
        {
            name: "food item 2",
            qty: 1,
            unit: "unit",
            proteins: 41,
            carbs: 111,
            fibre: 222,
            fats: 17
        },
        {
            name: "food item 3",
            qty: 1,
            unit: "unit",
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 34
        },
        {
            name: "food item 4",
            qty: 1,
            unit: "unit",
            proteins: 22,
            carbs: 78,
            fibre: 0,
            fats: 100
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        populateFoodItems(0, 5, expected);

        expect(items.length).toBe(5);

        const units = ["gr", "ml", "oz", "unit", "cup"];

        for (let i = 0; i < items.length; i++) {
            let cachedDashboard = JSON.parse(localStorage.getItem("dashboard"));
            let proteinConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins;
            let carbConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs;
            let fibreConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre;
            let fatConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats;

            const currentFoodItemHDOM = document.getElementById(items[i].id);
            const showButton = currentFoodItemHDOM.querySelector("#showButton");
            
            showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const foodItemPopup = document.getElementById("divPopUp1-1");

            const name = foodItemPopup.getElementsByClassName("divAddText")[0];
            const qty = foodItemPopup.getElementsByClassName("divAddText")[1];
            const unit = foodItemPopup.querySelector("#materialSelectAddHyd");

            const proteins = foodItemPopup.getElementsByClassName("divAddTextNut")[0];
            const proteinsOld = proteins.value;

            const carbs = foodItemPopup.getElementsByClassName('divAddTextNut')[1];
            const carbsOld = carbs.value;

            const fibre = foodItemPopup.getElementsByClassName("divAddTextNut")[2];
            const fibreOld = fibre.value;

            const fats = foodItemPopup.getElementsByClassName("divAddTextNut")[3];
            const fatsOld = fats.value;

            name.value = `new name ${i}`;
            ionFireEvent.ionChange(name);

            qty.value = (i + 1) * 2;
            ionFireEvent.ionChange(qty);

            unit.value = units[i];
            fireEvent.change(unit);
            
            proteins.value = i;
            ionFireEvent.ionChange(proteins);

            carbs.value = i + 1;
            ionFireEvent.ionChange(carbs);

            fibre.value = i + 2;
            ionFireEvent.ionChange(fibre);

            fats.value = i + 3;
            ionFireEvent.ionChange(fats);

            const saveButton = foodItemPopup.querySelector("#saveButton");
            saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            proteinConsumptionPerCategory = proteinConsumptionPerCategory - proteinsOld + proteins.value;
            carbConsumptionPerCategory = carbConsumptionPerCategory - carbsOld + carbs.value;
            fibreConsumptionPerCategory = fibreConsumptionPerCategory - fibreOld + fibre.value;
            fatConsumptionPerCategory = fatConsumptionPerCategory - fatsOld + fats.value;

            cachedDashboard = JSON.parse(localStorage.getItem("dashboard"));
            expect(cachedDashboard.food.categories.someFoodCategory.items[i].name).toBe(`new name ${i}`);
            expect(cachedDashboard.food.categories.someFoodCategory.items[i].qty).toBe((i + 1) * 2);
            expect(cachedDashboard.food.categories.someFoodCategory.items[i].unit).toBe(units[i]);

            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins).toBe(proteinConsumptionPerCategory);
            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs).toBe(carbConsumptionPerCategory);
            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre).toBe(fibreConsumptionPerCategory);
            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats).toBe(fatConsumptionPerCategory);
        }
        const cachedDashboard = JSON.parse(localStorage.getItem("dashboard"));
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins).toBe(10);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs).toBe(15);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre).toBe(20);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats).toBe(25);

        expect(items.length).toBe(5);
    };

    setUp(dummyDashboard, testFunc);
});

it("test no edit and save", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            name: "food item",
            qty: 1,
            unit: "unit",
            proteins: 14,
            carbs: 0,
            fibre: 0,
            fats: 12
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        populateFoodItems(0, 1, expected);

        expect(items.length).toBe(1);

        let cachedDashboard = JSON.parse(localStorage.getItem("dashboard"));
        let proteinConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins;
        let carbConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs;
        let fibreConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre;
        let fatConsumptionPerCategory = cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats;

        const currentFoodItemHDOM = document.getElementById(items[0].id);
        const showButton = currentFoodItemHDOM.querySelector("#showButton");    
        showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        // Aucune modification n'a lieu - on ne fait que visualiser l'item et appuyer sur le bouton de sauvegarde pour fermer le popup.
        const foodItemPopup = document.getElementById("divPopUp1-1");
        const saveButton = foodItemPopup.querySelector("#saveButton");
        saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        // À ce moment-ci, on ne s'attend à aucun changement.
        cachedDashboard = JSON.parse(localStorage.getItem("dashboard"));
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.proteins).toBe(proteinConsumptionPerCategory);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.carbs).toBe(carbConsumptionPerCategory);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fibre).toBe(fibreConsumptionPerCategory);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrimentConsumption.fats).toBe(fatConsumptionPerCategory);

        expect(items.length).toBe(1);
    };
    setUp(dummyDashboard, testFunc);
});

it("test module translation", () => {
    const testFunc = () => {
        ["en", "es", "fr"].forEach(lang => {
            localStorage.setItem("userLanguage", lang); 
            
            ["proteinFood", "grainFood", "vegetables", "fruit", "dairyProducts"].forEach(category => {
    
                act(() => {
                    render(<Food 
                        categoryKey = { category }
                        updateFoodConsumptionCallback = { () => { } }
                        macroNutrimentConsumption = { {} }
                        foodItems = { [] }
                        currentDate = { new Date() }
                        macroNutrimentToEdit = { undefined }
                        itemContainerDisplayStatus = { false }
                    />, 
                    container);
        
                        
                });   
                const moduleName = document.getElementById("moduleName").innerHTML;
                expect(moduleName).toBe(dict["FOOD_MODULE"]["foodCategories"][category][lang]);
                const addFoodItem = document.getElementById("addFoodItem").innerHTML;
                expect(addFoodItem).toBe(dict["FOOD_MODULE"]["functions"]["addFoodItem"][lang]);
                const addButton = document.getElementById("addButton");
                addButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

                const measures = document.getElementById("materialSelectAddHyd").children;
                const gr = measures[1].innerHTML;
                expect(gr).toBe(dict["UNIT_GR"][lang]);
                const oz = measures[2].innerHTML;
                expect(oz).toBe(dict["UNIT_OZ"][lang]);
                const ml = measures[3].innerHTML;
                expect(ml).toBe(dict["UNIT_ML"][lang]);
                const cup = measures[4].innerHTML;
                expect(cup).toBe(dict["UNIT_CUP"][lang]);
                const unit = measures[5].innerHTML;
                expect(unit).toBe(dict['UNIT_TEXT'][lang]);

                const itemQtyBoxValue = document.getElementById('foodItemQty').getAttribute('placeholder');
                expect(itemQtyBoxValue).toBe(dict['FOOD_MODULE']['macroNutriments']['qty'][lang]);
                const protQtyBoxValue = document.getElementById('protQty').innerHTML;
                expect(protQtyBoxValue).toBe(dict['FOOD_MODULE']['macroNutriments']['proteins'][lang]);
                const glucQtyBoxValue = document.getElementById('glucQty').innerHTML;
                expect(glucQtyBoxValue).toBe(dict['FOOD_MODULE']['macroNutriments']['carbs'][lang]);
                const fibQtyBoxValue = document.getElementById('fibQty').innerHTML;
                expect(fibQtyBoxValue).toBe(dict['FOOD_MODULE']['macroNutriments']['fibre'][lang]);
                const fatQtyBoxValue = document.getElementById('fatQty').innerHTML;
                expect(fatQtyBoxValue).toBe(dict['FOOD_MODULE']['macroNutriments']['fats'][lang]);
            });
        });
    };
    testFunc();
});

it("test translation for non-existent key", () => {
    const testFunc = () => {
        ["en", "es", "fr"].forEach(lang => {
            localStorage.setItem("userLanguage", lang);

            act(() => {
                render(<Food 
                    categoryKey = { "UnsupportedKey" }
                    updateFoodConsumptionCallback = { () => { } }
                    macroNutrimentConsumption = { {} }
                    foodItems = { [] }
                    currentDate = { new Date() }
                    macroNutrimentToEdit = { undefined }
                    itemContainerDisplayStatus = { false }
                />, 
                container);         
            });    
            const moduleName = document.getElementById("moduleName").innerHTML;
            expect(moduleName).toBe("Node with key UnsupportedKey is undefined");
        });
    };
    testFunc();
});

it("test translation for non-supported language", () => {
    localStorage.setItem("userLanguage", "it");
    const testFunc = () => {
        act(() => {
            render(<Food 
                categoryKey = 'proteinFood'
                updateFoodConsumptionCallback = { () => { } }
                macroNutrimentConsumption = { {} }
                foodItems = { [] }
                currentDate = { new Date() }
                macroNutrimentToEdit = { undefined }
                itemContainerDisplayStatus = { false }
            />, 
            container);         
        });  
        const moduleName = document.getElementById("moduleName").innerHTML;
        expect(moduleName).toBe(`Translation into it for node ${JSON.stringify(dict["FOOD_MODULE"]["foodCategories"]["proteinFood"])} is currently not supported`);  
    };
    testFunc();
});

it("test favorites button and favorites sorted", () => {
    const dummyDashboard = initDummyDashboard();
    let expected = [];
    const iteration = 7;

    for (let i = 0; i < iteration; i++) {
        const foodItem = {
            name: "some name",
            favorite: false,
            qty: 1,
            unit: "unit",
            proteins: 1,
            carbs: 2,
            fibre: 3,
            fats: 4
        };
        expected.push(foodItem);
    }

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        populateFoodItems(0, 7, expected);
        expect(items.length).toBe(iteration);
        
        for (let i = 0; i < items.length; i++) {
            const currentFoodItemHDOM = document.getElementById(items[i].id);
            const showButton = currentFoodItemHDOM.querySelector("#showButton");   

            showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const foodItemPopup = document.getElementById("divPopUp1-1");

            const favButton = foodItemPopup.querySelector("#favoriteButton");
            const saveButton = foodItemPopup.querySelector("#saveButton");
            if (i % 2) {
                favButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
            // Test toggle button
            else if (i === (iteration - 1)) {
                favButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                favButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
            saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
        // Test favorites button
        items.forEach((item, i) => {
            if (i < (iteration >> 1)) {
                expect(item.favorite).toBeTruthy();
            }
            else {
                expect(item.favorite).toBeFalsy();
            }
        });

        // Test if list is sorted
        expect(items).toBe(items.sort((a, b) => a.favorite - b.favorite));
    }

    setUp(dummyDashboard, testFunc);
})