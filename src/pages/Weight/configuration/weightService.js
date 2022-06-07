import firebase from 'firebase'
import moment from "moment";
import 'moment/locale/fr' 
import 'moment/locale/es' 
import * as translate from "../../../translate/Translator";
const DIFF_UNITY_WEIGHT = 2.2;

// Variables in Firebase and localstorage remains in French for now with a translation in comment
export function initPrefWeight() {
  return new Promise((resolve) => {
    const userUID = localStorage.getItem('userUid');
    // Firebase : preferencesPoids = preferencesWeight
    let prefWeightRef = firebase.database().ref('profiles/'+ userUID +"/preferencesPoids")
    prefWeightRef.once("value").then(function(snapshot) {
      // Lets retrieve the weight preference we have in firebase before putting it in localstorage
      // Firebase : unitePoids = unitWeight
      if (snapshot.val() !== null && snapshot.val().unitePoids !== null) {
        // LocalStorage : prefUnitePoids = prefUnitWeight
        localStorage.setItem("prefUnitePoids", snapshot.val().unitePoids.toString());
      } else {
        localStorage.setItem("prefUnitePoids", "KG");
      }
      resolve();
    })
  });
}
export function initWeights() {
  console.log("why is not working")
  return new Promise((resolve) => {
    const userUID = localStorage.getItem('userUid');
    let preferencesWeightRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
    preferencesWeightRef.once("value").then(function(snapshot) {
        if (snapshot.val() != null) {
          // Firebase : poidsInitial = initialWeight
          // Firebase : poidsCible = targetWeight
          localStorage.setItem("poidsInitial", snapshot.val().poidsInitial);
          localStorage.setItem("poidsCible", snapshot.val().poidsCible);
          localStorage.setItem("dateCible", snapshot.val().dateCible);
        }
        else {
          localStorage.setItem("poidsInitial", 0);
          localStorage.setItem("poidsCible", 0);
          localStorage.setItem("dateCible", "1999-9-9");
        }
        resolve();
      })
  });
}

export function initSize() {
  return new Promise((resolve) => {
    const userUID = localStorage.getItem('userUid');
    var size_from_BD = firebase.database().ref("profiles/" + userUID);
      size_from_BD.once("value").then(function (snapshot) {
        if (snapshot.val() != null) {
          localStorage.setItem("taille", snapshot.val().size);
        }
        else {
          localStorage.setItem("taille", 0);
        }
        resolve();
      })
  });
}


export function formatWeight(weight) {
	// LocalStorage : prefUnitePoids = prefUnitWeight
  let prefUnitWeight = localStorage.getItem('prefUnitePoids');
  if (prefUnitWeight === "LBS") {
    return (weight * DIFF_UNITY_WEIGHT).toFixed(1)
  }
  return parseFloat(weight).toFixed(1)
}

export function formatToKG(weight) {
	// LocalStorage : prefUnitePoids = prefUnitWeight
  let prefUnitWeight = localStorage.getItem('prefUnitePoids');
  if (prefUnitWeight === "LBS") {
    return (weight / DIFF_UNITY_WEIGHT).toFixed(2)
  }

  return weight;
}

// LocalStorage : prefUnitePoids = prefUnitWeight
export function getPrefUnitWeight() {
    return localStorage.getItem('prefUnitePoids');
}

export function setPrefUnitWeight(value) {
    const userUID = localStorage.getItem('userUid');
    // LocalStorage : prefUnitePoids = prefUnitWeight
    localStorage.setItem("prefUnitePoids",value)
    // Firebase : preferencesPoids = preferencesWeight, unitePoids = unitWeight
    firebase.database().ref('profiles/' + userUID +"/preferencesPoids").update({"unitePoids": value})
}

export function calculation_BMI(height, dailyWeight){
	return (dailyWeight / ((height / 100) * (height / 100))).toFixed(2);
}

export function check_BMI_change(BMI_value){
  var BMI_category = find_new_category(BMI_value);
  let BMI_category_local = localStorage.getItem('BMI_group');

  localStorage.setItem('BMI_group', BMI_category);
  if (BMI_category_local !== null && BMI_category.localeCompare(BMI_category_local) ) {
      alert(translate.getText(BMI_category));
  }
}

export function find_new_category(BMI_value){
    var BMI_group = '';
    if (BMI_value <= 18.49) {
      BMI_group = 'SKIN_CATEGORY';

    } else if (BMI_value >= 18.5 && BMI_value <= 25) {
      BMI_group = 'IDEAL_CATEGORY';

    } else if (BMI_value >= 25.01 && BMI_value <= 30) {
      BMI_group = 'OVERWEIGHT_CATEGORY';

    } else if (BMI_value >= 30.01 && BMI_value <= 35) {
      BMI_group = 'CATEGORY_OB_CLASS_1';

    } else if (BMI_value >= 35.01 && BMI_value <= 40) {
      BMI_group = 'CATEGORY_OB_CLASS_2';

    } else if (BMI_value > 40) {
      BMI_group = 'CATEGORY_OB_CLASS_3';
    }

    return BMI_group+"";
}

export function formatDate (date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
}

export function toDate (date) {
  return moment(date).toDate();
}

export function formatDateShape (date,shape) {
  var lang = localStorage.getItem("userLanguage")
    shape = shape.toUpperCase();
    shape = shape.replace(/L/gi,"M");
    if(lang === 'en'){
      moment.locale('en')
      return moment(date).format(shape);
    }
    else if(lang === 'fr'){
      moment.locale('fr')
      return moment(date).format(shape);
    }
    else if(lang == 'es'){
      moment.locale('es')
      return moment(date).format(shape);
    }
}

export function initPrefDate() {
  return new Promise((resolve) => {
    const userUID = localStorage.getItem('userUid');
    let prefDatetRef = firebase.database().ref('profiles/'+ userUID +"/dateFormat")
    prefDatetRef.once("value").then(function(snapshot) {
      // Lets retrieve the date format preference we have in firebase before putting it in localstorage
      if (snapshot.val() !== null) {
        // LocalStorage : prefUnitePoids = prefUnitWeight
        localStorage.setItem("prefDateFormat", snapshot.val().toString());
      } else {
        localStorage.setItem("prefDateFormat", "dd-LL-yyyy");
      }
      resolve();
    })
  });
}

export function getPrefDate() {
  return localStorage.getItem("prefDateFormat")
}

export function updateWeightDashboard(newWeight, currentDate) {
  const userUID = localStorage.getItem('userUid');
  let new_dailyWeight = newWeight;
  const dashboard = JSON.parse(localStorage.getItem("dashboard"));

  dashboard.poids.dailyPoids = formatToKG(new_dailyWeight);
  dashboard.poids.datePoids = new Date();
  localStorage.setItem("dashboard", JSON.stringify(dashboard));

  firebase
      .database()
      .ref(
          "dashboard/" +
    userUID +
    "/" +
    currentDate.startDate.getDate() +
    (currentDate.startDate.getMonth() + 1) +
    currentDate.startDate.getFullYear()
  )
  .update(dashboard);
}