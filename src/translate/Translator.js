import firebase from 'firebase'
const dict = require('./Translation.json');
const supportedLanguages = ["en", "es", "fr"];

export function setLang(lang) {
    const userUID = localStorage.getItem('userUid');
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem("userLanguage", lang);
        var field = { "langue": lang }
        firebase.database().ref('language/' + userUID).update(field);
    }
}

export function getLang() {
    var language = "en";
    if (localStorage["userLanguage"]) {
        console.log("local");
        language = localStorage.getItem("userLanguage");
        console.log(language);
    } else {
        var locale = window.navigator.userLanguage
                || window.navigator.language;
        locale = locale.substring(0, 2);
        if (supportedLanguages.includes(locale)) {
            language = locale;
        }
    }
    return language;
}

export function getText(key) {
    if (dict === undefined || dict[key] === undefined || dict[key][getLang()] === undefined) {
        console.error("Error in Translation.json")
        return "";
    }
    return dict[key][getLang()];
}
