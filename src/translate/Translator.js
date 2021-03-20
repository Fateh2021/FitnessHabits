
var preferredLanguage = "en";
var dict = require('./Translation.json');


exports.setLang = function(lang) {
    if (["en","es","fr"].includes(lang)) {
        preferredLanguage = lang;
    }
}

exports.getLang = function() {
    return preferredLanguage;
}

exports.getText = (key) => {
    return dict[key][preferredLanguage];
}

exports.preferredLanguage = preferredLanguage;
exports.dict = dict;

