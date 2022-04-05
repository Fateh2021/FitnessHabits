import firebase from "firebase"
import moment from "moment";
import * as translate from "../../../translate/Translator";
const currentDate = new Date()
const DIFF_UNITY_WEIGHT = 2.2;

// Variables in Firebase and localstorage remains in French for now with a translation in comment
export function initPrefWeight() {
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
  })
}

export function formatWeight(weight) {
	// LocalStorage : prefUnitePoids = prefUnitWeight
  let prefUnitWeight = localStorage.getItem('prefUnitePoids');
  if (prefUnitWeight === "LBS") {
    return (weight * DIFF_UNITY_WEIGHT).toFixed(2)
  }
  return weight
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
    return moment(date).format("YYYY-MM-DD");
}