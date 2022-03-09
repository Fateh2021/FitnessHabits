import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Nourriture from '../Nourriture';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';


const dict = require('../../../../../translate/Translation.json');

let container = null;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const setUp = (mock, testFunc) => {
    localStorage.setItem('dashboard', JSON.stringify(mock));

    render(<Nourriture
        translationKey='Macronutriment'
        dashboardKey='macroNutriment'
        dashboardSubKey='macroNutriments'
        cssId='dummy'
        parentCallback={(e) => { }}
        macroNutriment={mock.macroNutriment}
        macroNutriments={mock.macroNutriment.macroNutriments}
        globalConsumption={mock.macroNutriment.dailyTarget.globalConsumption}
        currentDate={new Date()}
        macroNutrimentToEdit={undefined}
        itemContainerDisplayStatus={false}
        test={true}
    />, container);

    checkInitialValuesRendering(mock);
    testFunc();

    localStorage.removeItem('dashboard');
};

const checkInitialValuesRendering = (mock) => {
    for (let i = 0; i < mock.macroNutriment.macroNutriments.length; i++) {
        const macroNutriment = document.getElementById(`${i}`);
        const unitConsumption = macroNutriment.querySelector('#unitConsumption');
        expect(unitConsumption.value).toBe(mock.macroNutriment.macroNutriments[i].consumption);
    }
};

const updateByASingleUnit = (buttonId, start, end) => {
    const button = document.getElementById(`${buttonId}`);
    const unitConsumption = document.getElementById('unitConsumption');
    const globalConsumption = document.getElementById('globalConsumption');
    const direction = end - start;
    const increment = direction > 0;

    for (let i = start; increment ? i < end : i > end; increment ? i++ : i--) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(unitConsumption.value).toBe(increment ? i + 1 : i - 1);
        expect(globalConsumption.value).toBe(unitConsumption.value);
    }
}

const updateToTargetTotal = (buttonId, targetData, targetTotal) => {
    const updateFunc = (id, initialAmount, targetIncrement) => {
        const macroNutriment = document.getElementById(`${id}`);
        for (let i = 0; i < Math.abs(targetIncrement); i++) {
            const button = macroNutriment.querySelector(`#${buttonId}`);
            button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        const unitConsumption = macroNutriment.querySelector('#unitConsumption');
        const expected = Math.max(initialAmount + targetIncrement, 0);
        expect(unitConsumption.value).toBe(expected);
    };

    for (let i = 0; i < targetData.length; i++) {
        updateFunc(i, targetData[i].initialAmount, targetData[i].targetIncrement);
    }

    const globalConsumption = document.getElementById('globalConsumption');
    expect(globalConsumption.value).toBe(targetTotal);
};

const setUpTranslationTest = (testFunc) => {
    const originalLanguage = localStorage.getItem('userLanguage');
    testFunc();
    localStorage.setItem('userLanguage', originalLanguage);
}

const setUpNegativeMacroNutriment = (buttonId, targetData, targetTotal) => {
    const updateFunc = (id, initialAmount, targetIncrement) => {
        const button = document.getElementById(buttonId);
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const popup = document.getElementById("divPopUp1-1");
        const input = popup.getElementsByClassName("divAddTextNut")[id];
        input.value = initialAmount + targetIncrement;
        fireEvent.ionChange(input);
        const currentMacroQty = input.value;
        expect(currentMacroQty).toBe(targetTotal);
    };

    for (let i = 0; i < targetData.length; i++) {
        updateFunc(i, targetData[i].initialAmount, targetData[i].targetIncrement);
    }
};

it('test negative quantity on macro-nutriments', () => {
    const dummyDashboard = {
        macroNutriment: 
        {
            macroNutriments:
            [
                {
                    consumption: 6,
                    favoris: false,
                    fibre: 0,
                    glucide: 0,
                    gras: 0,
                    id: 0,
                    name: "",
                    proteine: 2,
                    qtte: 0,
                    unit: ""
                },
                {
                    consumption: 2,
                    favoris: false,
                    fibre: 0,
                    glucide: 13,
                    gras: 0,
                    id: 1,
                    name: "",
                    proteine: 0,
                    qtte: 0,
                    unit: ""
                },
                {
                    consumption: 12,
                    favoris: false,
                    fibre: 0,
                    glucide: 0,
                    gras: 0,
                    id: 2,
                    name: "",
                    proteine: 0,
                    qtte: 0,
                    unit: ""
                },
                {
                    consumption: 30,
                    favoris: false,
                    fibre: 0,
                    glucide: 0,
                    gras: 44,
                    id: 3,
                    name: "",
                    proteine: 0,
                    qtte: 0,
                    unit: ""
                }
            ],
            dailyTarget:
            {
                globalConsumption: 50,
                unit: "",
                value: 0
            }
        }
    };
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

it('test div visibility toggle', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: "",
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 0,
                unit: "",
                value: 0
            }
        }
    };

    const moduleNames = ['Gras', 'Cereales', 'Legumes', 'Proteines'];
    const macroNutrimentTypes = ['gras', 'cereales', 'legumes', 'proteines'];
    const macroNutrimentSubTypes = ['grass'].concat(macroNutrimentTypes.slice(1));
    const divs = ['myDIV2', 'myDIV3', 'myDIV4', 'myDIV5'];

    const getToggledValue = (i) => {
        return i % 2 == 0 ? 'block' : 'none';
    }

    divs.forEach((div, index) => {
        act(() => {
            render(<Nourriture
                translationKey={moduleNames[index]}
                dashboardKey={macroNutrimentTypes[index]}
                dashboardSubKey={macroNutrimentSubTypes[index]}
                cssId={div}
                parentCallback={undefined}
                macroNutriment={dummyDashboard.macroNutriment}
                macroNutriments={dummyDashboard.macroNutriment.macroNutriments}
                globalConsumption={dummyDashboard.macroNutriment.dailyTarget.globalConsumption}
                currentDate={new Date()}
                macroNutrimentToEdit={undefined}
                itemContainerDisplayStatus={false}
            />,
                container);
        });
        const moduleImage = document.getElementById('moduleImg').src;
        expect(moduleImage).toBe(`http://localhost/assets/${moduleNames[index]}.jpg`);

        const arrow = document.getElementById('proteinArrow');
        const elem = document.getElementById(div);
        elem.style.display = 'none';

        act(() => {
            for (let i = 0; i < 5; i++) {
                arrow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                expect(elem.style.display).toBe(getToggledValue(i));
            }
        });
    });
});

it('test save item', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments: [],

            dailyTarget:
            {
                globalConsumption: 0,
                unit: "",
                value: 0
            }
        }
    };
    const testFunc = () => {
        expect(dummyDashboard.macroNutriment.macroNutriments.length).toBe(0);
        const addButton = document.getElementById('addButton');

        for (let i = 0; i < 5; i++) {
            addButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const saveButton = document.getElementById('saveButton');
            saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(dummyDashboard.macroNutriment.macroNutriments.length).toBe(i + 1);
        }
    };
    setUp(dummyDashboard, testFunc);
});

it('test delete item', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 10,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 67,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 1,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 81,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 2,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 3,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 55,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 4,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 213,
                unit: "",
                value: 0
            }
        }
    };
    const testFunc = () => {
        const globalConsumption = document.getElementById('globalConsumption');
        let updatedValue = globalConsumption.value;

        for (let i = 0; i < dummyDashboard.macroNutriment.macroNutriments.length; i++) {
            // La fonction <code> splice </code> utilisée dans <code> deleteItem </code> du module Nourriture modifie le tableau <code> macroNutriments </code> 'in place' 
            // et décale les éléments à chaque fois après en avoir enlevé un. Donc, l'indice de l'élément courant va demeurer 0 à chaque fois.
            // Par contre, dans HDOM, chaque <code> macroNutriment </code> a son propre identifiant qui demeure en place, d'où la nécessité de maintenir l'indice <code> i </code> à jour
            // pour récupérer l'élément HDOM correspondant.
            const currentMacroNutriment = dummyDashboard.macroNutriment.macroNutriments[0];
            const macroNutrimentHDOM = document.getElementById(`${i}`);
            const unitConsumption = macroNutrimentHDOM.querySelector('#unitConsumption');
            const deleteButton = macroNutrimentHDOM.querySelector('#deleteButton');
            deleteButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            updatedValue -= unitConsumption.value;
            expect(dummyDashboard.macroNutriment.macroNutriments.includes(currentMacroNutriment)).toBe(false);
            expect(globalConsumption.value).toBe(updatedValue);
        }
    };
    setUp(dummyDashboard, testFunc);
});

it('test daily consumption increment: by a single unit', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 0,
                unit: "",
                value: 0
            }
        }
    };
    setUp(dummyDashboard, () => { updateByASingleUnit('incrementButton', 0, 5); });
});

it('test daily consumption increment: to a target total', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 1,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 2,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 3,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 4,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 0,
                unit: "",
                value: 0
            }
        }
    };
    const targetData = [
        {
            initialAmount: 0,
            targetIncrement: 5
        },
        {
            initialAmount: 0,
            targetIncrement: 12
        },
        {
            initialAmount: 0,
            targetIncrement: 6
        },
        {
            initialAmount: 0,
            targetIncrement: 11
        },
        {
            initialAmount: 0,
            targetIncrement: 3
        }
    ];
    setUp(dummyDashboard, () => { updateToTargetTotal('incrementButton', targetData, 37); });
});

it('test daily consumption increment: by a target amount', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 75,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 20,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 1,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 3,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 2,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 14,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 3,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 1,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 4,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 113,
                unit: "",
                value: 0
            }
        }
    };
    const targetData = [
        {
            initialAmount: 75,
            targetIncrement: 7
        },
        {
            initialAmount: 20,
            targetIncrement: 12
        },
        {
            initialAmount: 3,
            targetIncrement: 105
        },
        {
            initialAmount: 14,
            targetIncrement: 9
        },
        {
            initialAmount: 1,
            targetIncrement: 33
        }
    ];
    setUp(dummyDashboard, () => { updateToTargetTotal('incrementButton', targetData, 279) });
});

it('test daily consumption decrement: by a single unit', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 5,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 5,
                unit: "",
                value: 0
            }
        }
    };
    setUp(dummyDashboard, () => { updateByASingleUnit('decrementButton', 5, 0); });
});

it('test daily consumption decrement: to a target total', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 50,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 11,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 1,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 45,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 2,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 16,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 3,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 9,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 4,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 131,
                unit: "",
                value: 0
            }
        }
    };
    const targetData = [
        {
            initialAmount: 50,
            targetIncrement: -50
        },
        {
            initialAmount: 11,
            targetIncrement: -11
        },
        {
            initialAmount: 45,
            targetIncrement: -45
        },
        {
            initialAmount: 16,
            targetIncrement: -16
        },
        {
            initialAmount: 9,
            targetIncrement: -9
        }
    ];
    setUp(dummyDashboard, () => { updateToTargetTotal('decrementButton', targetData, 0); });
});

it('test daily consumption decrement: by a target amount', () => {
    const dummyDashboard = {
        macroNutriment:
        {
            macroNutriments:
                [
                    {
                        consumption: 2,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 0,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 0,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 1,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 12,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 2,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 71,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 3,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    },
                    {
                        consumption: 15,
                        favoris: false,
                        fibre: 0,
                        glucide: 0,
                        gras: 0,
                        id: 4,
                        name: "",
                        proteine: 0,
                        qtte: 0,
                        unit: ""
                    }
                ],
            dailyTarget:
            {
                globalConsumption: 100,
                unit: "",
                value: 0
            }
        }
    };
    const targetData = [
        {
            initialAmount: 2,
            targetIncrement: -1
        },
        {
            initialAmount: 0,
            targetIncrement: -2
        },
        {
            initialAmount: 12,
            targetIncrement: -5
        },
        {
            initialAmount: 71,
            targetIncrement: -13
        },
        {
            initialAmount: 15,
            targetIncrement: -45
        }
    ];
    setUp(dummyDashboard, () => { updateToTargetTotal('decrementButton', targetData, 66); });
});

it('test module translation', () => {
    const testFunc = () => {
        ['en', 'es', 'fr'].forEach(lang => {
            localStorage.setItem('userLanguage', lang);

            ['fats', 'proteins', 'vegetables', 'grain', 'fruits'].forEach(category => {

                act(() => {
                    render(<Nourriture
                        translationKey={category}
                        dashboardKey='dummy'
                        dashboardSubKey='dummy'
                        cssId='dummy'
                        parentCallback={(e) => { }}
                        macroNutriment={undefined}
                        macroNutriments={[]}
                        globalConsumption={0}
                        currentDate={new Date()}
                        macroNutrimentToEdit={undefined}
                        itemContainerDisplayStatus={false}
                    />,
                        container);


                });
                const moduleName = document.getElementById('moduleName').innerHTML;
                expect(moduleName).toBe(dict['FOOD_MODULE']['sub_titles'][category][lang]);
                const addMacroNutrimentButtonName = document.getElementById('addMacroNutriment').innerHTML;
                expect(addMacroNutrimentButtonName).toBe(dict['FOOD_MODULE']['functions']['add_macro_nutriment'][lang]);
                const addButton = document.getElementById('addButton');
                addButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                const measures = document.getElementById('materialSelectAddHyd').children;
                const gr = measures[1].innerHTML;
                expect(gr).toBe(dict['UNIT_GR'][lang]);
                const oz = measures[2].innerHTML;
                expect(oz).toBe(dict['UNIT_OZ'][lang]);
                const ml = measures[3].innerHTML;
                expect(ml).toBe(dict['UNIT_ML'][lang]);
                const cup = measures[4].innerHTML;
                expect(cup).toBe(dict['UNIT_CUP'][lang]);
                const unit = measures[5].innerHTML;
                expect(unit).toBe(dict['UNIT_TEXT'][lang]);

                const protQtyBoxValue = document.getElementById('protQty').innerHTML;
                expect(protQtyBoxValue).toBe(dict['FOOD_MODULE']['macro_nutriments']['proteins'][lang]);
                const glucQtyBoxValue = document.getElementById('glucQty').innerHTML;
                expect(glucQtyBoxValue).toBe(dict['FOOD_MODULE']['macro_nutriments']['glucides'][lang]);
                const fibQtyBoxValue = document.getElementById('fibQty').innerHTML;
                expect(fibQtyBoxValue).toBe(dict['FOOD_MODULE']['macro_nutriments']['fibre'][lang]);
                const fatQtyBoxValue = document.getElementById('fatQty').innerHTML;
                expect(fatQtyBoxValue).toBe(dict['FOOD_MODULE']['macro_nutriments']['fats'][lang]);
            });
        });
    };
    setUpTranslationTest(testFunc);
});

it('test translation for non-existent key', () => {
    const testFunc = () => {
        ['en', 'es', 'fr'].forEach(lang => {
            localStorage.setItem('userLanguage', lang);

            act(() => {
                render(<Nourriture
                    translationKey='UnsupportedKey'
                    dashboardKey='dummy'
                    dashboardSubKey='dummy'
                    cssId='dummy'
                    parentCallback={(e) => { }}
                    macroNutriment={undefined}
                    macroNutriments={[]}
                    globalConsumption={0}
                    currentDate={new Date()}
                    macroNutrimentToEdit={undefined}
                    itemContainerDisplayStatus={false}
                />,
                    container);
            });
            const moduleName = document.getElementById('moduleName').innerHTML;
            expect(moduleName).toBe(`Node with key UnsupportedKey is undefined`);
        });
    };
    setUpTranslationTest(testFunc);
});

it('test translation for non-supported language', () => {
    localStorage.setItem('userLanguage', 'it');
    const testFunc = () => {
        act(() => {
            render(<Nourriture
                translationKey='proteins'
                dashboardKey='dummy'
                dashboardSubKey='dummy'
                cssId='dummy'
                parentCallback={(e) => { }}
                macroNutriment={undefined}
                macroNutriments={[]}
                globalConsumption={0}
                currentDate={new Date()}
                macroNutrimentToEdit={undefined}
                itemContainerDisplayStatus={false}
            />,
                container);
        });
        const moduleName = document.getElementById('moduleName').innerHTML;
        expect(moduleName).toBe(`Translation into it for node ${JSON.stringify(dict['FOOD_MODULE']['sub_titles']['proteins'])} is currently not supported`);
    };
    setUpTranslationTest(testFunc);
});

it("test favoris button and favoris sorted", () => {
    const dummyDashboard = {
        macroNutriment: {
            macroNutriments: [],
            dailyTarget: {
                globalConsumption: 0,
                unit: "",
                value: 0
            }
        }
    };

    const testFunc = () => {
        const addButton = document.getElementById('addButton');

        for (let i = 0; i < 3; i++) {
            addButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const favButton = document.querySelector(".starFavoris");
            const saveButton = document.getElementById('saveButton');
            if (i % 2)
                favButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(dummyDashboard.macroNutriment.macroNutriments).toBe(dummyDashboard.macroNutriment.macroNutriments.sort((a,b) => a.favoris-b.favoris));
        }
    }

    setUp(dummyDashboard, testFunc)
})