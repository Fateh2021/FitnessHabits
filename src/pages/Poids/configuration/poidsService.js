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
    })
    localStorage.setItem("prefUnitePoids", prefUnitePoids);
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
    
    var imc_category = trouver_category(v);
    const userUID = localStorage.getItem('userUid');
    let imc_c = localStorage.getItem('IMC_c');

    localStorage.setItem('IMC_c', imc_category);
    if (imc_c !== null && imc_category.localeCompare(imc_c) ) {
        alert(translate.getText(imc_category));
    }
    


  }
  /**
   * Moins de 18,49: Trop maigre
18,5 à 25: Poids idéal ou optimal A
25,01 à 30: Surpoids B
30,01 à 35: Obésité classe 1 C
35,01 à 40: Obésité sévère (classe 2) D 
Plus de 40: Obésité morbide E
   */
  function trouver_category(i){
      var val = 'F';
      if (i < 18.50) {
        val = 'A';
      }else if(i < 25.01){
        val = 'B';       
      }else if(i < 30.01){
        val = 'C';       
      }else if(i < 35.01){
        val = 'D';  
      }else if(i < 40.01){
        val = 'E';  
      }
      return val+val+"";
  }