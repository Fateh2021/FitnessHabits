import firebase from 'firebase'
import moment from "moment";
import * as translate from "../../../translate/Translator";
const currentDate = new Date()
const WEIGHT_UNIT_DIFF = 2.2;

export function initPrefweight() {
    const userUID = localStorage.getItem('userUid');
    let refWeightPref = firebase.database().ref('profiles/'+ userUID +"/weightPreferences")
    refWeightPref.once("value").then(function(snapshot) {
    // Permet de récupération de la préférence de weight que nous avons dans firebase avant de mettre ça dans le localstorage
        if (snapshot.val() !== null && snapshot.val().weightUnit !== null) {
            localStorage.setItem("prefweightUnit",snapshot.val().weightUnit.toString());
        } else {
            localStorage.setItem("prefweightUnit", "KG");
        }
    })
}


export function formatWeight(weight) {
    let prefweightUnit = localStorage.getItem('prefweightUnit');
    if (prefweightUnit === "LBS") {
        return (weight * WEIGHT_UNIT_DIFF).toFixed(2)
    }
    return weight
}

export function formatToKG(weight) {
    let prefweightUnit = localStorage.getItem('prefweightUnit');
    if (prefweightUnit === "LBS") {
        return (weight / WEIGHT_UNIT_DIFF).toFixed(2)
    }
    return weight
}

export function getDailyweight() {
    const userUID = localStorage.getItem('userUid');
    let weightPreferencesRef = firebase.database().ref('dashboard/' + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear())
    weightPreferencesRef.once("value").then(function(snapshot) {
        if (snapshot.val() !== null && snapshot.val().dailyweight !== null ) {
          return formatWeight(snapshot.val().dailyweight)
        }
    })
}

export function getPrefweightUnit() {
    return localStorage.getItem('prefweightUnit');
}

export function setPrefweightUnit(val) {
    const userUID = localStorage.getItem('userUid');
    localStorage.setItem("prefweightUnit",val)
    firebase.database().ref('profiles/' + userUID +"/weightPreferences").update({"weightUnit": val})
}

export function saveEntreeDeweight(dailyweight) {
    let prefweightUnit = localStorage.getItem('prefweightUnit');
    if (prefweightUnit === "LBS") {
        dailyweight = ((dailyweight / 2.2).toFixed(2))
    }
    const userUID = localStorage.getItem('userUid');
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.weight.dailyweight = dailyweight;
    dashboard.weight.dateweight = new Date()
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear()).update(dashboard);
}

export function check_IMC_change(imc_value){
    var imc_category = find_new_category(imc_value);
    let imc_category_local = localStorage.getItem('groupe_IMC');

    localStorage.setItem('groupe_IMC', imc_category);
    if (imc_category_local !== null && imc_category.localeCompare(imc_category_local) ) {
        alert(translate.getText(imc_category));
    }
  }

export function find_new_category(imc_value){
    var groupe_IMC = '';
    if (imc_value <= 18.49) {
      groupe_IMC = 'CATEGORIE_MAIGRE';

    } else if (imc_value >= 18.5 && imc_value <= 25) {
      groupe_IMC = 'CATEGORIE_IDEAL';

    } else if (imc_value >= 25.01 && imc_value <= 30) {
      groupe_IMC = 'CATEGORIE_SURweight';

    } else if (imc_value >= 30.01 && imc_value <= 35) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_1';

    } else if (imc_value >= 35.01 && imc_value <= 40) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_2';

    } else if (imc_value > 40) {
      groupe_IMC = 'CATEGORIE_OB_CLASSE_3';
    }

    return groupe_IMC+"";
}

export function formatDate (date) {
    return moment(date).format('YYYY-MM-DD');
}