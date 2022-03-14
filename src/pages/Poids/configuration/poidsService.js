import firebase from 'firebase'
import * as translate from "../../../translate/Translator";
const currentDate = new Date()
const DIFF_UNITE_POIDS = 2.2;


export function initPrefPoids() {
    var prefUnitePoids = "bla";
    const userUID = localStorage.getItem('userUid');
    let prefPoidsRef = firebase.database().ref('profiles/' + userUID +"/preferencesPoids")
    prefPoidsRef.once("value").then(function(snapshot) {
        if (localStorage["prefUnitePoids"] === "LBS" || localStorage["prefUnitePoids"] === "KG") {
            prefUnitePoids = localStorage.getItem("prefUnitePoids");
        } else if (snapshot.val() !== null && snapshot.val().unitePoids !== null) {
            localStorage.setItem("prefUnitePoids",snapshot.val().unitePoids.toString());
        } else {
            localStorage.setItem("prefUnitePoids", "KG");
        }
        localStorage.setItem("prefUnitePoids", prefUnitePoids);
    })
}

export function formatPoids(poids) {    
    return (poids * DIFF_UNITE_POIDS).toFixed(2);
}

export function formatToKG(poids) {
    return (poids / DIFF_UNITE_POIDS).toFixed(2);
}

export function getDailyPoids() {
    const userUID = localStorage.getItem('userUid');
    let preferencesPoidsRef = firebase.database().ref('dashboard/' + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear())
    preferencesPoidsRef.once("value").then(function(snapshot) {
        if (snapshot.val() !== null && snapshot.val().dailyPoids !== null ) {
          return formatPoids(snapshot.val().dailyPoids)
        }
    })
}

export function getPrefUnitePoids() {
    return localStorage.getItem('prefUnitePoids');
}

export function setPrefUnitePoids(val) {
    const userUID = localStorage.getItem('userUid');
    localStorage.setItem("prefUnitePoids",val)
    firebase.database().ref('profiles/' + userUID +"/preferencesPoids").update({"unitePoids": val})
}

export function saveEntreeDePoids(dailyPoids) {
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    if (prefUnitePoids === "LBS") {
        dailyPoids = ((dailyPoids / 2.2).toFixed(2))
    }
    const userUID = localStorage.getItem('userUid');
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.poids.dailyPoids = dailyPoids;
    dashboard.poids.datePoids = new Date()
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear()).update(dashboard);
}

// Vérification du changement possible de catégorie IMC
export function verifier_changement_IMC(value) {
    var new_imc_categorie = trouver_nouvelle_categorie(value);
    const userUID = localStorage.getItem('userUid');
    let old_imc_categorie = localStorage.getItem('groupe_IMC');

    if (old_imc_categorie == null || new_imc_categorie.localeCompare(old_imc_categorie) ) {
        alert(translate.getText(new_imc_categorie));
        localStorage.setItem('groupe_IMC', new_imc_categorie);
    }
}

// Pour trouver la nouvelle catégorie pour IMC
function trouver_nouvelle_categorie(value){
    var groupe_IMC = '';
    if (value <= 18.49) {
      groupe_IMC = 'CATEGORIE_MAIGRE';

    } else if (value >= 18.5 && value <= 25) {
      groupe_IMC = 'CATEGORIE_IDEAL';

    } else if (value >= 25.01 && value <= 30) {
      groupe_IMC = 'CATEGORIE_SURPOIDS';

    } else if (value >= 30.01 && value <= 35) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_1';

    } else if (value >= 35.01 && value <= 40) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_2';

    } else if (value > 40) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_3';
    }

    return groupe_IMC+"";
}