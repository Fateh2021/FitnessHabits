import firebase from 'firebase'
import "firebase/auth";
import React, { useState } from 'react';
import { IonInput, IonGrid, IonItem, IonRow, IonCol, IonPage, IonButton, IonLoading, IonIcon } from '@ionic/react';
import { toast } from '../../Toast'
import * as translate from '../../translate/Translator'

/* les imports de l'équipe GEFRAL */
import { signInWithGoogle, signInWithFacebook } from '../../firebaseConfig';
import {arrowForward} from "ionicons/icons";

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
            toast(translate.getText("AUTH_LOGIN_ERROR"), 4000)
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
                        <img className="logoIntro" src="/assets/LogoLegion.svg" alt="Logo" />
                    </IonCol>
                    <IonCol>
                    </IonCol>
                </IonRow>

                {/*Bout de code rajouté par l'équipe Gefral */}
                <IonRow style={{marginBottom:30}}>
                    <IonCol size="12" >
                        <IonButton className="btn-home" onClick={facebookSignIn}>
                            <IonCol size="1" >
                                <img src="/assets/socials/facebookLogo.svg" width="100%" height="100%" alt="Logo_texte" />
                            </IonCol>
                            {translate.getText("AUTH_FED_CONNECT_FB")}
                        </IonButton>
                        <IonButton className="btn-home" onClick={googleSignIn} >
                            <IonCol size="1" >
                                <img src="/assets/socials/googleLogo.svg" width="100%" height="100%" alt="Logo_texte" />
                            </IonCol>
                            {translate.getText("AUTH_FED_CONNECT_GOOGLE")}
                            <IonIcon icon={arrowForward}/>
                        </IonButton>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <IonLoading message={translate.getText("WAIT")} duration={0} isOpen={busy} />
                        <IonItem color="transparent" lines="none">
                            <IonInput className="input-login" placeholder={translate.getText("USER_NAME")} onIonChange={(e) => setUsername(e.target.value)}/>
                        </IonItem>
                        <IonItem color="transparent" lines="none" style={{marginBottom:20}}>
                            <IonInput className="input-login" type="password" placeholder={translate.getText("PASSWORD")} onIonChange={(e) => setPassword(e.target.value)}/>
                        </IonItem>
                        <IonButton className="btn-home" style={{marginBottom:20}}  size="large" onClick={login}>{translate.getText("CONNECT")}</IonButton>
                        <IonButton className="btn-home" color="secondary" href="/register">{translate.getText("NEW_REGISTER")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
};
export default LogIn;