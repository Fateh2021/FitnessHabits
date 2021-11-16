import firebase from 'firebase'
import "firebase/auth";
import React, { useState } from 'react';
import { IonInput, IonGrid, IonRow, IonCol, IonPage, IonButton, IonItem } from '@ionic/react';
import {toast} from '../../Toast'
import * as translate from '../../translate/Translator'


const Register= () => {
  
    const [username, setUsername]= useState('')
    const [password, setPassword]= useState('')
    const [cPassword, setCPassword] = useState('')
    
    async function register(){
        // Validation 
        if(password !== cPassword){
            return toast(translate.getText("PASSWORD_NOT_MATCH"))
        }
        if(username.trim() === '' || password.trim() === ''){
            return toast(translate.getText("USER_NAME_PASSWORD_REQUIRED"))
        }
        if (username !=='' || password.trim() !== '' || password === cPassword){
          toast(translate.getText("REGISTERED_SUCCESSFULLY"))
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
          <IonRow style={{marginBottom:30}}>
            <IonCol size="8" offset="2">
              <img className="logoIntro" src="/assets/LogoLegion.svg"width="100%" height="100%" alt="Logo" />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{marginBottom:30}}>
              {/* <IonLoading message="Registration in progress!" duration={10} isOpen={busy}/> */}
              <IonItem color="transparent" lines="none">  
                <IonInput className="input-login" placeholder={translate.getText("USER_NAME")} onIonChange={(e) => setUsername(e.target.value)}/>
              </IonItem>
              <IonItem color="transparent" lines="none">
                <IonInput className="input-login" type="password" placeholder={translate.getText("PASSWORD")} onIonChange={(e) => setPassword(e.target.value)}/>  
              </IonItem> 
              <IonItem color="transparent" lines="none">
                <IonInput className="input-login" type="password" placeholder={translate.getText("CONFIRM_PASWORD")} onIonChange={(e) => setCPassword(e.target.value)}/>  
              </IonItem>                        
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton className="btn-home" onClick={register}>{translate.getText("REGISTER")}</IonButton>
              <IonButton className="btn-home" color="secondary" href="/login">{translate.getText("ALREADY_REGISTERED")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
    </IonPage>
  );
};
export default Register;