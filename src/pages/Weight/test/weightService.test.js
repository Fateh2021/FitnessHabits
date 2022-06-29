<<<<<<< HEAD
import {cleanup} from "@testing-library/react";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
=======
import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
import * as weightService  from "../configuration/weightService"

jest.mock("firebase", () => {
    const data = {
        dateFormat:"yyyy-LL-dd",
        preferencesPoids:{
          dateCible:"2022-06-24",
          poidsCible:90,
          poidsInitial:100,
          unitePoids:"LBS"
        },
        pseudo:"Ben",
        size:150
      }

    const empty = {
        dateFormat:null,
        preferencesPoids: null,
        pseudo:null,
        size:null
    };

    const empty2 = {
        dateFormat:null,
        preferencesPoids:{
            dateCible:null,
            poidsCible:null,
            poidsInitial:null,
            unitePoids:null
          },
        pseudo:null,
        size:null
    };

    const dataList = [
        {poids:{
            dailyPoids: 75,
            datePoids: "2022-06-18 13:15"
        }},
        {poids:{
            dailyPoids: 65,
            datePoids: "2022-06-20 13:15"
        }},
        {poids:{
            dailyPoids: 0
        }},
        {poids:{
            dailyPoids: 80,
            datePoids: "2022-06-17 13:15"
        }},
        {poids:{
            dailyPoids: 70,
            datePoids: "2022-06-19 13:15"
        }}
    ];
    const snapshot = { val: () => data };
    const snapshotNull = { val: () => null };
    const snapshotEmpty = { val: () => empty };
    const snapshotEmpty2 = { val: () => empty2 };
    const snapshotList = { val: () => dataList };
    return {
        auth: jest.fn(),
        database: jest.fn().mockReturnValue({
            ref: jest.fn().mockReturnValue({
                update: jest.fn(),
                once: jest.fn().mockResolvedValueOnce(snapshot)
                               .mockResolvedValueOnce(snapshotNull)
                               .mockResolvedValueOnce(snapshotEmpty)
                               .mockResolvedValueOnce(snapshotEmpty2),
                orderByChild: jest.fn().mockReturnValue({
                    once: jest.fn().mockResolvedValue(snapshotList)
                })
            })
        })
    };
});

<<<<<<< HEAD
=======
/*jest.mock("./configuration/weightService", () => { 
    const originalModule = jest.requireActual('./configuration/weightService');
    return {
        ...originalModule,
        initProfile: jest.fn().mockResolvedValue()
    };
})*/

>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
describe("weightService", () => {
    const dailyWeight = "77";
    const dateFormat = "YYYY/MM/DD"
    const currentDate = {startDate: new Date("2022-06-03 10:30")}
    const unitWeight = "KG"
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const size = "160";

    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids: dailyWeight,
            datePoids:"2022-03-17T15:24:10.792Z"
        }
        
        const pseudo_dashboard = {
            userUID,
            poids,
            size
        };

        let pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: unitWeight
            },
            pseudo:"John Doe",
            size: size
          };

        let dailyWeightList = [
            {x: "2022-06-07", y:70},
            {x: "2022-06-08", y:65},
            {x: "2022-06-09", y:60},
            {x: "2022-06-10", y:55}
        ];

        localStorage.setItem("userUid", userUID);
        localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
        localStorage.setItem("userLanguage", "fr");
        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
        localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });

    test("Test fonction initProfile", async() => {
        const dataDefault = {
            dateFormat:"dd-LL-yyyy",
            preferencesPoids:{
              dateCible:"1999-9-9",
              poidsCible:0,
              poidsInitial:0,
              unitePoids:"KG"
            },
            pseudo:"Scott",
            size:0
          }

        const dataMock = {
            dateFormat:"yyyy-LL-dd",
            preferencesPoids:{
              dateCible:"2022-06-24",
              poidsCible:90,
              poidsInitial:100,
              unitePoids:"LBS"
            },
            pseudo:"Ben",
            size:150
          }

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataMock);
        });

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataDefault);
        });

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataDefault);
        });

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataDefault);
        });

        
    });

    test("Test fonction getProfile", async() => {
        const pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: unitWeight
            },
            pseudo:"John Doe",
            size: size
          };

        const result = weightService.getProfile();
        expect(result).toStrictEqual(pseudoProfile);
    });

    test("Test fonction getPrefDate", async() => {
        let result = weightService.getPrefDate();
        expect(result).toStrictEqual(dateFormat);

        localStorage.setItem("profile", null);

        result = weightService.getPrefDate();
        expect(result).toStrictEqual(null);
    });

    test("Test fonction getTargetWeightDate", async() => {
        let result = weightService.getTargetWeightDate();
        expect(result).toStrictEqual(dateCible);

        localStorage.setItem("profile", null);

        result = weightService.getTargetWeightDate();
        expect(result).toStrictEqual(null);
    });

    test("Test fonction getTargetWeight", async() => {
        let result = weightService.getTargetWeight();
        expect(result).toStrictEqual(poidsCible);

        localStorage.setItem("profile", null);

        result = weightService.getTargetWeight();
        expect(result).toStrictEqual(null);
    });

    test("Test fonction getInitialWeight", async() => {
        let result = weightService.getInitialWeight();
        expect(result).toStrictEqual(poidsInitial);

        localStorage.setItem("profile", null);

        result = weightService.getInitialWeight();
        expect(result).toStrictEqual(null);
    });

    test("Test fonction getPrefUnitWeight", async() => {
        let result = weightService.getPrefUnitWeight();
        expect(result).toStrictEqual(unitWeight);

        localStorage.setItem("profile", null);

        result = weightService.getPrefUnitWeight();
        expect(result).toStrictEqual(null);
    });

    test("Test fonction getSize", async() => {
        let result = weightService.getSize();
        expect(result).toStrictEqual(size);

        localStorage.setItem("profile", null);

        result = weightService.getSize();
        expect(result).toStrictEqual(null);
    });

    test("Test fonction setPrefUnitWeight", async() => {
        weightService.setPrefUnitWeight("LBS")
        expect(JSON.parse(localStorage.getItem("profile")).preferencesPoids.unitePoids).toStrictEqual("LBS");
    });

    test("Test fonction formatWeight", async() => {
        let result = weightService.formatWeight(100)
        expect(result).toStrictEqual("100.0");

        const pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: "LBS"
            },
            pseudo:"John Doe",
            size: size
          };

        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
        result = weightService.formatWeight(100)
        expect(result).toStrictEqual("220.0");
    });

    test("Test fonction formatToKG", async() => {
        let result = weightService.formatToKG(220)
        expect(result).toStrictEqual(220);

        const pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: "LBS"
            },
            pseudo:"John Doe",
            size: size
          };

        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
        result = weightService.formatToKG(220)
        expect(result).toStrictEqual("100.00");
    });

    test("Test fonction calculation_BMI", async() => {
        let result = weightService.calculation_BMI(size, dailyWeight)
        expect(result).toStrictEqual("30.08");
    });

    test("Test fonction find_new_category", async() => {
        let result = weightService.find_new_category(15)
        expect(result).toStrictEqual("SKIN_CATEGORY");

        result = weightService.find_new_category(20)
        expect(result).toStrictEqual("IDEAL_CATEGORY");

        result = weightService.find_new_category(28)
        expect(result).toStrictEqual("OVERWEIGHT_CATEGORY");

        result = weightService.find_new_category(32)
        expect(result).toStrictEqual("CATEGORY_OB_CLASS_1");

        result = weightService.find_new_category(36)
        expect(result).toStrictEqual("CATEGORY_OB_CLASS_2");

        result = weightService.find_new_category(45)
        expect(result).toStrictEqual("CATEGORY_OB_CLASS_3");
    });

    test("Test fonction check_BMI_change", async() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        weightService.check_BMI_change(15); // localstorage is null
        weightService.check_BMI_change(16); // localstorage is not null but same category
        weightService.check_BMI_change(20); // localstorage is not null and different category
        expect(window.alert).toBeCalledWith("Poids idéal");
        weightService.check_BMI_change(15); // localstorage is not null and different category
        expect(window.alert).toBeCalledWith("Trop maigre");
    });

    test("Test fonction formatDate", async() => {
        let result = weightService.formatDate("2022-03-17T15:24:10.792")
        expect(result).toStrictEqual("2022-03-17 15:24");
    });

    test("Test fonction toDate", async() => {
        let result = weightService.toDate("2022-03-17 15:24")
        expect(result).toStrictEqual(new Date("2022-03-17T19:24:00.000Z"));
    });

    test("Test fonction formatDateShape", async() => {
        let result = weightService.formatDateShape("2022-05-17T15:24:10.792", "yyyy-LLLL-dd")
        expect(result).toStrictEqual("2022-mai-17");

        localStorage.setItem("userLanguage", "en");
        result = weightService.formatDateShape("2022-05-17T15:24:10.792", "yyyy-LLLL-dd")
        expect(result).toStrictEqual("2022-May-17");

        localStorage.setItem("userLanguage", "es");
        result = weightService.formatDateShape("2022-05-17T15:24:10.792", "yyyy-LLLL-dd")
        expect(result).toStrictEqual("2022-mayo-17");
    });

<<<<<<< HEAD
    // problem with new date, does not work 100% and will change in Sprint3
    /*test("Test fonction updateWeightDashboard", async() => {
=======
    test("Test fonction updateWeightDashboard", async() => {
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids: 90,
            datePoids: new Date()
        }
        
        const pseudo_dashboard = {
            userUID,
            poids,
            size
        };
        
        weightService.updateWeightDashboard(90, currentDate);
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard));
<<<<<<< HEAD
    });*/
=======
    });
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8

    test("Test fonction initDailyPoidsList", async() => {
        const dataList = [
            {x: "2022-06-17 13:15", y:"80.0"},
            {x: "2022-06-18 13:15", y:"75.0"},
            {x: "2022-06-19 13:15", y:"70.0"},
            {x: "2022-06-20 13:15", y:"65.0"}
        ];
        
        await weightService.initDailyPoidsList().then(() => {
            expect(JSON.parse(localStorage.getItem("listeDailyPoids"))).toStrictEqual(dataList);
        });
    });

    test("Test fonction getDailyWeightList", async() => {
        const dailyWeightList = [
            {x: "2022-06-07", y:70},
            {x: "2022-06-08", y:65},
            {x: "2022-06-09", y:60},
            {x: "2022-06-10", y:55}
        ];
        
        let result = weightService.getDailyWeightList()
        expect(result).toStrictEqual(dailyWeightList);
    });

    test("Test fonction getLastWeightInfos", async() => {
        const dailyWeightList = [
            {x: "2022-06-07", y:70},
            {x: "2022-06-08", y:65},
            {x: "2022-06-09", y:60},
            {x: "2022-06-10", y:55}
        ];
        
        let result = weightService.getLastWeightInfos(dailyWeightList)
        expect(result).toStrictEqual(["2022-06-10", 55]);
    });

    test("Test fonction getTime", async() => {
        let result = weightService.getTime("2022-05-17T15:24:10.792")
        expect(result).toStrictEqual("15:24");
    });
});