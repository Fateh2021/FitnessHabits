import * as firebase from 'firebase';


export const dict = require('./Translation.json');
export const supportedLanguages = ["en", "es", "fr"];

export function setLang (lang) {
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem("userLanguage", lang);
        //insert in db
    }
}

export function getLang () {
    var language = "en";
    if (localStorage["userLanguage"]) {
        language = localStorage.getItem("userLanguage");
    }else if (false) { //else if (database) {
        //language = database.userLanguage
    } else {    
        var lang = window.navigator.userLanguage 
                || window.navigator.language;
        lang = lang.substring(0,2);
        if (supportedLanguages.includes(lang)) {
            language = lang;
        } 
    } 
    return language;
}

export function getText (key) {
    return dict[key][getLang()];
}



