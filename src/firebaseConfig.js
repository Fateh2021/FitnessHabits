import * as firebase from 'firebase'
import "firebase/auth";

const config={
    apiKey: "AIzaSyCp-IIRzRipMrhMIKbvFZm6yGenEQucsVE",
    authDomain: "fir-auth-app-9d2cf.firebaseapp.com",
    databaseURL: "https://fir-auth-app-9d2cf.firebaseio.com",
    projectId: "fir-auth-app-9d2cf",
    storageBucket: "fir-auth-app-9d2cf.appspot.com",
    messagingSenderId: "999931997950",
    appId: "1:999931997950:web:cda0933d8f68bff0cbbfaf",
    measurementId: "G-F6S5DRN5MS"
}

firebase.initializeApp(config)

export function getCurrentUser() {        
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
            if (user){
                resolve(user)
            }else{
                resolve(null)
            }
            unsubscribe()
        })
    })
}

