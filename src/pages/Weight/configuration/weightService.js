import firebase from 'firebase'
import moment from "moment";
import 'moment/locale/fr' 
import 'moment/locale/es' 
import * as translate from "../../../translate/Translator";
const DIFF_UNITY_WEIGHT = 2.2;


/*
export function initProfile() {
  return new Promise((resolve) => {
    const userUID = localStorage.getItem('userUid');
    let profileRef = firebase.database().ref('profiles/'+ userUID)
    profileRef.once("value").then(function(snapshot) {
      const dbProfile = snapshot.val();
      const dataProfile = checkDataProfile(dbProfile)
      localStorage.setItem("profile", JSON.stringify(dataProfile));
      resolve();
    })
  });
}*/

// temp no firebase
export function initProfile() {
  return new Promise((resolve) => {
    let dataProfile = {
      dateFormat:"yyyy-LL-dd",
      preferencesPoids:{
        dateCible:"2022-07-30",
        poidsCible:"69",
        poidsInitial:"90",
        unitePoids:"KG"
      },
      pseudo:"Scott",
      size:"170"
    };
    localStorage.setItem("profile", JSON.stringify(dataProfile));
    resolve();
  });
}

function checkDataProfile(dbProfile) {
  let dataProfile = {
    dateFormat:"dd-LL-yyyy",
    preferencesPoids:{
      dateCible:"1999-9-9",
      poidsCible:0,
      poidsInitial:0,
      unitePoids:"KG"
    },
    pseudo:"Scott",
    size:0
  };
  if (dbProfile !== null) {
    if(dbProfile.dateFormat !== null) {
      dataProfile.dateFormat = dbProfile.dateFormat;
    }
    if(dbProfile.pseudo !== null) {
      dataProfile.pseudo = dbProfile.pseudo;
    }
    if(dbProfile.size !== null) {
      dataProfile.size = dbProfile.size;
    }
    dataProfile = checkPreference(dataProfile, dbProfile.preferencesPoids)
  }
  return dataProfile;
}

function checkPreference(dataProfile, preferencesPoids) {
  if(preferencesPoids !== null) {
    if(preferencesPoids.dateCible !== null) {
      dataProfile.preferencesPoids.dateCible = preferencesPoids.dateCible;
    }
    if(preferencesPoids.poidsCible !== null) {
      dataProfile.preferencesPoids.poidsCible = preferencesPoids.poidsCible;
    }
    if(preferencesPoids.poidsInitial !== null) {
      dataProfile.preferencesPoids.poidsInitial = preferencesPoids.poidsInitial;
    }
    if(preferencesPoids.unitePoids !== null) {
      dataProfile.preferencesPoids.unitePoids = preferencesPoids.unitePoids;
    }
  }
  return dataProfile;
}

export function getProfile() {
  return JSON.parse(localStorage.getItem("profile"));
}

export function getPrefDate() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return profile ? profile.dateFormat : null;
}

export function getTargetWeightDate() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return profile ? profile.preferencesPoids.dateCible : null;
}

export function getTargetWeight() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return profile ? profile.preferencesPoids.poidsCible : null;
}

export function getInitialWeight() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return profile ? profile.preferencesPoids.poidsInitial : null;
}

export function getPrefUnitWeight() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return profile ? profile.preferencesPoids.unitePoids : null;
}

export function getSize() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return profile ? profile.size : null;
}

export function setPrefUnitWeight(value) {
    const userUID = localStorage.getItem('userUid');
    let profile = JSON.parse(localStorage.getItem("profile"));
    profile.preferencesPoids.unitePoids = value;
    localStorage.setItem("profile", JSON.stringify(profile));
    // Firebase : preferencesPoids = preferencesWeight, unitePoids = unitWeight
    firebase.database().ref('profiles/' + userUID +"/preferencesPoids").update({"unitePoids": value})
}

export function formatWeight(weight) {
  let prefUnitWeight = getPrefUnitWeight();
  if (prefUnitWeight === "LBS") {
    return (weight * DIFF_UNITY_WEIGHT).toFixed(1)
  }
  return parseFloat(weight).toFixed(1)
}

export function formatToKG(weight) {
  let prefUnitWeight = getPrefUnitWeight();
  if (prefUnitWeight === "LBS") {
    return (weight / DIFF_UNITY_WEIGHT).toFixed(2)
  }

  return weight;
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

    } else {
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
    else if(lang === 'es'){
      moment.locale('es')
      return moment(date).format(shape);
    }
    else {
      moment.locale('fr')
      return moment(date).format(shape);
    }
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
/*
export function initDailyPoidsList() {
  return new Promise((resolve) => {
  const userUID = localStorage.getItem('userUid');
  let weightRef = firebase.database().ref('dashboard/' + userUID)
  weightRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
    var dailyWeightList = []
    for (const [,value] of Object.entries(snapshot.val())) {
        if (value.poids.datePoids !== undefined) {
            let dateWeight = formatDate(value.poids.datePoids)
            let weight = formatWeight(value.poids.dailyPoids)
            dailyWeightList.push ({x: dateWeight, y: weight})
        }
    }
    dailyWeightList.sort(function(a,b){
      return new Date(a.x) - new Date(b.x)
    })
    localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
    resolve();
  })
  })
}*/

// temp no firebase
export function initDailyPoidsList() {
  return new Promise((resolve) => {

    let dailyWeightList = [
      {x: "2022-06-25", y: 79},
      {x: "2022-06-21", y: 82},
      {x: "2022-06-18", y: 96},
      {x: "2022-06-15", y: 85},
      {x: "2022-06-11", y: 80},
      {x: "2022-06-09", y: 82},
      {x: "2022-06-07", y: 84},
      {x: "2022-06-04", y: 86},
      {x: "2022-06-01", y: 88}
    ]
    dailyWeightList.sort(function(a,b){
      return new Date(a.x) - new Date(b.x)
    })
    localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
    resolve();
  })
}

export function getDailyWeightList() {
  return JSON.parse(localStorage.getItem("listeDailyPoids"));
}

export function getShowenGraph() {
  return JSON.parse(localStorage.getItem("showenGraph"));
}


export function getLastWeightInfos(array){
  var dernier=[]
  array.map((item, i)=>{
    if(i === array.length -1){
     dernier[0]= item.x;
     dernier[1]=item.y;
    }
  })
  return dernier
}

export function getTime(date) {
  return moment(date).format('HH:mm');
}




