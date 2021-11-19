import firebase from 'firebase'
const currentDate = new Date()
const DIFF_UNITE_POIDS = 2.2;


export function initPrefPoids() {
    var prefUnitePoids = "bla";
    const userUID = localStorage.getItem('userUid');
    let prefPoidsRef = firebase.database().ref('profiles/' + userUID +"/preferencesPoids")
    prefPoidsRef.once("value").then(function(snapshot) {
        if (localStorage["prefUnitePoids"] === "LBS" || localStorage["prefUnitePoids"] === "KG") {
            prefUnitePoids = localStorage.getItem("prefUnitePoids");
        } else if (snapshot.val() != null && snapshot.val().unitePoids != null) {
            localStorage.setItem("prefUnitePoids",snapshot.val().unitePoids.toString());
        } else {
            localStorage.setItem("prefUnitePoids", "KG");
        }
    })
    localStorage.setItem("prefUnitePoids", prefUnitePoids);
}

export function formatPoids(poids) {
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    if (prefUnitePoids == "LBS") {
        return (poids * DIFF_UNITE_POIDS).toFixed(2)
    }
    return poids
}

export function formatToKG(poids) {
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    if (prefUnitePoids == "LBS") {
        return (poids / DIFF_UNITE_POIDS).toFixed(2)
    }
    return poids
}

export function getDailyPoids() {
    const userUID = localStorage.getItem('userUid');
    let preferencesPoidsRef = firebase.database().ref('dashboard/' + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear())
    preferencesPoidsRef.once("value").then(function(snapshot) {
        if (snapshot.val() != null && snapshot.val().dailyPoids != null ) {
          return formatPoids(snapshot.val().dailyPoids)
        }
    })
}

export function getprefUnitePoids() {
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    return prefUnitePoids
}

export function saveEntreeDePoids(dailyPoids) {
    let prefUnitePoids = localStorage.getItem('prefUnitePoids');
    if (prefUnitePoids == "LBS") {
        dailyPoids = ((dailyPoids / 2.2).toFixed(2))
    }
    const userUID = localStorage.getItem('userUid');
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.poids.dailyPoids = dailyPoids;
    dashboard.poids.datePoids = new Date()
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear()).update(dashboard);
}