import * as firebase from 'firebase'
const dict = require('./Translation.json');
const supportedLanguages = ["en", "es", "fr"];

export function setLang(lang) {
    const userUID = localStorage.getItem('userUid');
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem("userLanguage", lang);
        var field = { "langue": lang }
        firebase.database().ref('settings/' + userUID).update(field);
    }
}

export function getLang() {
    var language = "en";
    if (localStorage["userLanguage"]) {
        language = localStorage.getItem("userLanguage");
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
    return dict[key][getLang()];
}
