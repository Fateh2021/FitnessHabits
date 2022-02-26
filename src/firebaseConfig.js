import firebase from 'firebase'
import "firebase/auth";
import 'firebase/storage';

const config={
    apiKey: "AIzaSyDft1mFPDNZylWS2h1vXbP9kUFcl3tDZts",
    authDomain: "fitnesshabits-be415.firebaseapp.com",
    projectId: "fitnesshabits-be415",
    storageBucket: "fitnesshabits-be415.appspot.com",
    messagingSenderId: "1038172341754",
    appId: "1:1038172341754:web:5c6b20a4b55fcc00425043",
    measurementId: "G-N92LW0WCK4"
}

export default firebase.initializeApp(config).database().ref();

//export const storage = firebase.storage(); //Test non fonctionnels avec cette ligne

/*Config authentification Google et Facebook par l'équipe GEFRAL*/
export const auth = firebase.auth();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
providerGoogle.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(providerGoogle);
const providerFacebook = new firebase.auth.FacebookAuthProvider();
providerFacebook.setCustomParameters({ prompt: 'select_account' });
export const signInWithFacebook = () => auth.signInWithPopup(providerFacebook);

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

