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
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    if (prefUnitePoids === "LBS") {
        return (poids * DIFF_UNITE_POIDS).toFixed(2)
    }
    return poids
}

export function formatToKG(poids) {
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    if (prefUnitePoids === "LBS") {
        return (poids / DIFF_UNITE_POIDS).toFixed(2)
    }
    return poids
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

export function verifier_changement_IMC(v){
    
    var imc_category = trouver_nouvelle_categorie(v);
    const userUID = localStorage.getItem('userUid');
    let imc_c = localStorage.getItem('groupe_IMC');

    localStorage.setItem('groupe_IMC', imc_category);
    if (imc_c !== null && imc_category.localeCompare(imc_c) ) {
        alert(translate.getText(imc_category));
    }
    


  }
  function trouver_nouvelle_categorie(value){
    var groupe_IMC = '';
    if (value <= 18.49) {
      groupe_IMC = 'CATEGORIE_MAIGRE';

    } 
    if (value >= 18.5 && value <= 25) {
      groupe_IMC = 'CATEGORIE_IDEAL';

    } 
    if (value >= 25.01 && value <= 30) {
      groupe_IMC = 'CATEGORIE_SURPOIDS';

    } 
    if (value >= 30.01 && value <= 35) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_1';

    } 
    if (value >= 35.01 && value <= 40) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_2';

    } 
    if (value > 40) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_3';
    }

    return groupe_IMC+"";
}