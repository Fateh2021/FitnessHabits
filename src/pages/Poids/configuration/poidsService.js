import firebase from "firebase"
import moment from "moment";
import * as translate from "../../../translate/Translator";
const currentDate = new Date()
const DIFF_UNITE_POIDS = 2.2;
//
export function initPrefPoids() {
    const userUID = localStorage.getItem("userUid");
    let prefPoidsRef = firebase.database().ref("profiles/"+ userUID +"/preferencesPoids")
    prefPoidsRef.once("value").then(function(snapshot) {
    // Permet de récupération de la préférence de poids que nous avons dans firebase avant de mettre ça dans le localstorage
        if (snapshot.val() !== null && snapshot.val().unitePoids !== null) {
            localStorage.setItem("prefUnitePoids", snapshot.val().unitePoids.toString());
        } else {
            localStorage.setItem("prefUnitePoids", "KG");
        }
    })
}

export function formatPoids(poids) {
    let prefUnitePoids = localStorage.getItem("prefUnitePoids");
    if (prefUnitePoids === "LBS") {
        return (poids * DIFF_UNITE_POIDS).toFixed(2)
    }
    return poids
}

export function formatToKG(poids) {
    let prefUnitePoids = localStorage.getItem("prefUnitePoids");
    if (prefUnitePoids === "LBS") {
        return (poids / DIFF_UNITE_POIDS).toFixed(2)
    }
    return poids
}

export function getDailyPoids() {
    const userUID = localStorage.getItem("userUid");
    let preferencesPoidsRef = firebase.database().ref("dashboard/" + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear())
    preferencesPoidsRef.once("value").then(function(snapshot) {
        if (snapshot.val() !== null && snapshot.val().dailyPoids !== null ) {
            return formatPoids(snapshot.val().dailyPoids)
        }
    })
}

export function getPrefUnitePoids() {
    return localStorage.getItem("prefUnitePoids");
}

export function setPrefUnitePoids(val) {
    const userUID = localStorage.getItem("userUid");
    localStorage.setItem("prefUnitePoids", val)
    firebase.database().ref("profiles/" + userUID +"/preferencesPoids").update({"unitePoids": val})
}

export function saveEntreeDePoids(dailyPoids) {
    let prefUnitePoids = localStorage.getItem("prefUnitePoids");
    if (prefUnitePoids === "LBS") {
        dailyPoids = ((dailyPoids / 2.2).toFixed(2))
    }
    const userUID = localStorage.getItem("userUid");
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));
    dashboard.poids.dailyPoids = dailyPoids;
    dashboard.poids.datePoids = new Date()
    localStorage.setItem("dashboard", JSON.stringify(dashboard));
    firebase.database().ref("dashboard/" + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear()).update(dashboard);
}

export function verifier_changement_IMC(valeur_imc) {
    var imc_category = trouver_nouvelle_categorie(valeur_imc);
    let imc_category_local = localStorage.getItem("groupe_IMC");

    localStorage.setItem("groupe_IMC", imc_category);
    if (imc_category_local !== null && imc_category.localeCompare(imc_category_local) ) {
        alert(translate.getText(imc_category));
    }
}

export function trouver_nouvelle_categorie(valeur_imc) {
    var groupe_IMC = "";
    if (valeur_imc <= 18.49) {
        groupe_IMC = "CATEGORIE_MAIGRE";

    } else if (valeur_imc >= 18.5 && valeur_imc <= 25) {
        groupe_IMC = "CATEGORIE_IDEAL";

    } else if (valeur_imc >= 25.01 && valeur_imc <= 30) {
        groupe_IMC = "CATEGORIE_SURPOIDS";

    } else if (valeur_imc >= 30.01 && valeur_imc <= 35) {
        groupe_IMC = "CATEGORIE_OB_CLASSE_1";

    } else if (valeur_imc >= 35.01 && valeur_imc <= 40) {
        groupe_IMC = "CATEGORIE_OB_CLASSE_2";

    } else if (valeur_imc > 40) {
        groupe_IMC = "CATEGORIE_OB_CLASSE_3";
    }

    return groupe_IMC+"";
}

export function formatDate (date) {
    return moment(date).format("YYYY-MM-DD");
}