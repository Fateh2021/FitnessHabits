import firebase from 'firebase'
import "firebase/auth";
import React, { useState } from 'react';
import { IonInput, IonGrid, IonItem, IonRow, IonCol, IonPage, IonButton, IonLoading, IonIcon } from '@ionic/react';
import { toast } from '../../Toast'
import * as translate from '../../translate/Translator'

/* les imports de l'équipe GEFRAL */
import { signInWithGoogle, signInWithFacebook } from '../../firebaseConfig';
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
            let res = await signInWithGoogle();
            localStorage.setItem('userUid', res.user.uid);
            toast(translate.getText("AUTH_FED_CONNECT_GOOGLE_SUCCESS"));
            props.history.push('/dashboard');

        }catch(error){
            toast(translate.getText("AUTH_FED_CONNECT_GOOGLE_ERROR"), 4000)
        }
        setBusy(false)
    }

    /*GEFRAL: fonction permettant de se connecter avec un compte Facebook */
    async function facebookSignIn(){
        setBusy(true);

        try{
            let res = await signInWithFacebook()
            localStorage.setItem('userUid', res.user.uid);
            toast(translate.getText("AUTH_FED_CONNECT_FB_SUCCESS") );
            props.history.push('/dashboard');
        }catch(error){
            toast(translate.getText("AUTH_FED_CONNECT_FB_ERROR"), 4000)
        }
        setBusy(false)
    }

    return (
        <IonPage className="fondIntro">
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

                {/*Bout de code rajouté par l'équipe Gefral */}
                <IonRow>
                    <IonCol size="12" >
                        <IonButton expand="full" color="dark" onClick={facebookSignIn}>
                            <IonIcon  className="icon-facebook-format" icon={logoFacebook}/>
                            {translate.getText("AUTH_FED_CONNECT_FB")}
                            <IonIcon icon={arrowForward}/>
                        </IonButton>
                        <IonButton expand="full" color="dark" onClick={googleSignIn} >
                            <IonIcon className="icon-google-format" icon={logoGoogle}/>
                            {translate.getText("AUTH_FED_CONNECT_GOOGLE")}
                            <IonIcon icon={arrowForward}/>
                        </IonButton>
                    </IonCol>
                    <IonCol class="or-format">{translate.getText("OR")}</IonCol>
                </IonRow>

                <IonRow className="">
                    <IonCol>
                        <IonLoading message={translate.getText("WAIT")} duration={0} isOpen={busy} />
                        <IonItem color="transparent">
                            <IonInput placeholder={translate.getText("USER_NAME")} onIonChange={(e) => setUsername(e.target.value)}/>
                        </IonItem>
                        <IonItem color="transparent">
                            <IonInput type="password" placeholder={translate.getText("PASSWORD")} onIonChange={(e) => setPassword(e.target.value)}/>
                        </IonItem>
                        <IonButton className="login-button-left" onClick={login}>{translate.getText("CONNECT")}</IonButton>
                        <IonButton className="register-button-right" color="secondary" href="/register">{translate.getText("NEW_REGISTER")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
};
export default LogIn;