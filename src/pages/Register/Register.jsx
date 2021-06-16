import firebase from 'firebase'
import "firebase/auth";
import React, { useState } from 'react';
import { IonInput, IonGrid, IonRow, IonCol, IonPage, IonButton, IonItem } from '@ionic/react';
import {toast} from '../../Toast'


const Register= () => {
  
    const [username, setUsername]= useState('')
    const [password, setPassword]= useState('')
    const [cPassword, setCPassword] = useState('')
    
    async function register(){
        // Validation 
        if(password !== cPassword){
            return toast('Passwords do not match')
        }
        if(username.trim() === '' || password.trim() === ''){
            return toast('Username and password are required')
        }
        if (username !=='' || password.trim() !== '' || password === cPassword){
          toast('You have register successfully!')
        }
        const res = await registerUser(username, password)
        if (res){   
          window.location.href='/dashboard'
        }
    }

    async function registerUser (username, password){

      const email=username+'@fithab.com'
      try{
          await firebase.auth().createUserWithEmailAndPassword
          (email, password)
          toast(email)
          return true
      }catch(error){
          toast(email)
          toast(error.message, 4000)
          return false
      }
  }
    return (
      <IonPage className="fondIntro">
        <IonGrid >
          <IonRow className="">
            <IonCol></IonCol>
            <IonCol size="8">
              <img className="logoIntro" src="/assets/LogoLegion.png" alt="" />
            </IonCol>
            <IonCol></IonCol>
          </IonRow>
          <IonRow className="">
            <IonCol>
              {/* <IonLoading message="Registration in progress!" duration={10} isOpen={busy}/> */}
              <IonItem>  
                <IonInput placeholder="Nom d'utilisateur?" onIonChange={(e) => setUsername(e.target.value)}/>
              </IonItem>
              <IonItem>
                <IonInput type="password" placeholder="Mot de passe?" onIonChange={(e) => setPassword(e.target.value)}/>  
              </IonItem> 
              <IonItem>
                <IonInput type="password" placeholder="Confirmer le mot de passe?" onIonChange={(e) => setCPassword(e.target.value)}/>  
              </IonItem>             
              <IonButton onClick={register}>S'inscrire</IonButton>
              <IonItem><p>Vous avez déjà un compte!</p><IonButton href="/login">Se connecter</IonButton></IonItem>           
            </IonCol>
          </IonRow>
        </IonGrid>
    </IonPage>
  );
};
export default Register;