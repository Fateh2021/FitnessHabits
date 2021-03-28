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
    var language = "";
    
    if (localStorage["userLanguage"]) {
        language = localStorage.getItem("userLanguage");
    } else {
        const userUID = localStorage.getItem('userUid');
        firebase.database().ref('settings/' + userUID).once('value', (snapshot) => {
            const data = snapshot.val();
            language = data["langue"];
        });        
    }

    if (language == "") {
        var lang = window.navigator.userLanguage
            || window.navigator.language;
        lang = lang.substring(0, 2);
        if (supportedLanguages.includes(lang)) {
            language = lang;
        }
    }
    return language;
}

export function getText(key) {
    return dict[key][getLang()];
}
