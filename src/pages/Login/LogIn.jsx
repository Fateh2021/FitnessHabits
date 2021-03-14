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
            <IonRow class="row-facebook-google-format">
                <IonCol>
                    <IonIcon class="google-facebook-logo-left" size="large" icon={logoGoogle}/>
                </IonCol>
                <IonCol >
                    <IonButton color="dark" class="google-facebook-button-right" onClick={login} >
                        Se connecter via google
                        <IonIcon icon={arrowForward}/>
                    </IonButton>
                </IonCol>
            </IonRow>
            <IonRow class="rowAlign">
                <IonCol>
                    <IonIcon class="google-facebook-logo-left" size="large" icon={logoFacebook}/>
                </IonCol>
                <IonCol>
                    <IonButton color="dark" class="google-facebook-button-right" onClick={login}>
                        Se connecter via Facebook
                        <IonIcon icon={arrowForward}/>
                    </IonButton>
                </IonCol>
            </IonRow>

            <IonRow class="rowAlignOr">OU</IonRow>
        <IonRow className="">
          <IonCol>
            <IonLoading message="Veuillez patienter.." duration={0} isOpen={busy} />   
            <IonItem>  
              <IonInput placeholder="Nom d'utilisateur?" onIonChange={(e) => setUsername(e.target.value)}/>
            </IonItem>
            <IonItem>
              <IonInput type="password" placeholder="Mot de passe?" onIonChange={(e) => setPassword(e.target.value)}/>
            </IonItem>         
            <IonButton onClick={login}>Se connecter</IonButton>
            <IonButton color="secondary" href="/register">Nouveau, s'enregistrer</IonButton>                  
          </IonCol>
        </IonRow>
      </IonGrid>       
      </IonPage>
  );
};
export default LogIn;