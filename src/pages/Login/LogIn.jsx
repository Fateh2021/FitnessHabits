import * as firebase from 'firebase'
import "firebase/auth";
import React, { useState } from 'react';
import { IonInput, IonGrid, IonItem, IonRow, IonCol, IonPage, IonButton, IonLoading, IonIcon } from '@ionic/react';
import { toast } from '../../Toast'
/* les imports dont GEFRAL a besoin  */
import { signInWithGoogle } from '../../firebaseConfig';
import {logoFacebook,logoGoogle,arrowForward} from "ionicons/icons";

const LogIn = (props) => {    
    const [username, setUsername]= useState('')
    const [password, setPassword]= useState('')
    const [busy, setBusy]= useState(false)

    async function login(){ 
        setBusy(true);
        const email=username+'@fithab.com'
        try{
          let res = await firebase.auth().signInWithEmailAndPassword(email,password);
          localStorage.setItem('userUid', res.user.uid);
          toast('Authentification reussi!');
          props.history.push('/dashboard');
        }catch(error){
          toast('Erreur d\'authentification. L\'identifiant et/ou le mot passe sont invalides !', 4000)
        }
        setBusy(false)
    }

    /*GEFRAL: fonction permettant de se connecter avec un compte Google */
    async function googleSignIn(){
        setBusy(true);
        try{
            await signInWithGoogle();
            localStorage.setItem('userUid', firebase.auth().currentUser.uid);
            toast('Authentification Google reussi!');
            props.history.push('/dashboard');

        }catch(error){
            toast('Erreur d\'authentification Google!', 4000)
        }
        setBusy(false)
    }

    return (
      <IonPage>
          <img id="img" src="/assets/backgroundColor.png" alt=""/>
        <IonGrid>
          <IonRow className="">
            <IonCol>
            </IonCol>
            <IonCol size="8">
              <img className="logoIntro" src="/assets/LogoLegion.png" alt="" />
            </IonCol>
            <IonCol>
            </IonCol>
          </IonRow>

            <IonRow>
                <IonCol size="12" >
                    <IonButton expand="full" color="dark" onClick={googleSignIn} >
                        <IonIcon className="icon-google-format" icon={logoGoogle}/>
                        Se connecter via google
                        <IonIcon icon={arrowForward}/>
                    </IonButton>
                    <IonButton expand="full" color="dark" onClick={login}>
                        <IonIcon  className="icon-facebook-format" icon={logoFacebook}/>
                        Se connecter via Facebook
                        <IonIcon icon={arrowForward}/>
                    </IonButton>
                </IonCol>
                <IonCol class="or-format">OU</IonCol>
            </IonRow>

        <IonRow className="">
          <IonCol>
            <IonLoading message="Veuillez patienter.." duration={0} isOpen={busy} />   
            <IonItem>  
              <IonInput placeholder="Nom d'utilisateur?" onIonChange={(e) => setUsername(e.target.value)}/>
            </IonItem>
            <IonItem>
              <IonInput type="password" placeholder="Mot de passe?" onIonChange={(e) => setPassword(e.target.value)}/>
            </IonItem>         
            <IonButton className="login-button-left" onClick={login}>Se connecter</IonButton>
            <IonButton className="register-button-right" color="secondary" href="/register">Nouveau, s'enregistrer</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>       
      </IonPage>
  );
};
export default LogIn;