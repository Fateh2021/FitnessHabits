import * as firebase from 'firebase'
import "firebase/auth";
import React, { useState } from 'react';
import { IonInput, IonGrid, IonItem, IonRow, IonCol, IonPage, IonButton, IonLoading } from '@ionic/react';
import { toast } from '../../Toast'

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
      <IonPage className="fondIntro">
        <IonGrid >
          <IonRow className="">
            <IonCol>
            </IonCol>
            <IonCol size="8">
              <img className="logoIntro" src="/assets/Logo2.png" alt="" />  
            </IonCol>
            <IonCol>
            </IonCol>
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
            <IonButton onClick={login}>Se connecter</IonButton>
            <IonButton color="secondary" href="/register">Nouveau, s'enregistrer</IonButton>                  
          </IonCol>
        </IonRow>
      </IonGrid>       
      </IonPage>
  );
};
export default LogIn;