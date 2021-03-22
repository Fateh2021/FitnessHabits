import React, {useState, useEffect} from 'react';
import { IonRow, IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar, IonContent, IonTitle, IonToggle, IonItemGroup, IonCheckbox, IonTextarea} from '@ionic/react';
import { arrowDropdownCircle, star} from 'ionicons/icons';
import Alcool from '../Alcool'
import * as firebase from 'firebase'

import '../../../pages/Tab1.css';


const BoissonAlcool = (props) => {
  
  const [notifications, setNotifications] = useState(props.alcool.notifications);
  const [dailyTarget, setDailyTarget] = useState(props.alcool.dailyTarget);
  const [limitConsom, setLimitConsom] = useState(props.alcool.limitConsom);
  const [gender, setGender] = useState("");
 
  // update state on prop change
  useEffect(() => {
    setNotifications(props.alcool.notifications);
    defineGender().then(() =>{
      setDailyTarget(props.alcool.dailyTarget); 
      setLimitConsom(props.alcool.limitConsom);
    });
  }, [props.alcool.dailyTarget, props.alcool.limitConsom, props.alcool.notifications])

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const handleOnNotifications = event => {
    const userUID = localStorage.getItem('userUid');
    const updatedNotifications = { ...notifications, "active": event.detail.checked };
    setNotifications(updatedNotifications);
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.notifications = updatedNotifications;
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("handleOnNotifications -- updatedNotifications ::"+JSON.stringify(updatedNotifications));
    console.log("handleOnNotifications -- settings ::"+JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const handleDailyTargetChange = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' };
    setDailyTarget({ ...dailyTarget, [name]: value});
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("handleDailyTargetChange -- updatedDailyTarget ::"+JSON.stringify(updatedDailyTarget));
    console.log("handleDailyTargetChange -- settings ::"+JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  const handleOnEducAlcool = event => {
    const userUID = localStorage.getItem('userUid');
    const updatedLimitConsom = { ...limitConsom, "educAlcool": event.detail.checked };
    if(event.detail.checked){
      if(gender == "H")
      {
        updatedLimitConsom.dailyTarget = 3;
        updatedLimitConsom.weeklyTarget = 15;
      } else {
        updatedLimitConsom.dailyTarget = 2;
        updatedLimitConsom.weeklyTarget = 10;
      }
    } 
    setLimitConsom(updatedLimitConsom);
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.limitConsom = updatedLimitConsom;
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("handleOnEducAlcool -- updatedLimitConsom ::"+JSON.stringify(updatedLimitConsom));
    console.log("handleOnEducAlcool -- settings ::"+JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  const handleOnLimitConsom = event => {console.log("change!!!");
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedLimitConsom = { ...limitConsom, [name]: value ? value : (name === 'value') ? 0 : '' };
    setLimitConsom({ ...limitConsom, [name]: value});
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.limitConsom = updatedLimitConsom;
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("handleOnLimitConsom -- updatedLimitConsom ::"+JSON.stringify(updatedLimitConsom));
    console.log("handleOnLimitConsom -- settings ::"+JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  const defineGender = async () => {
    return new Promise(resolve => {
      const localProfile = localStorage['profile'];
      if (localProfile) {
          setGender(JSON.parse(localProfile).gender)
          resolve();
      } else {
          const userUID = localStorage.getItem('userUid');
          console.log("Loading Profile From DB...");
          firebase.database().ref('profiles/'+userUID)
          .once("value", (snapshot) => {
              const prof = snapshot.val();
              if (prof) {
                  localStorage.setItem('profile', JSON.stringify(prof));
                  setGender(prof.gender);
                  resolve();
              }               
          });
      }
    });
  };

  return (
    <div>
      {/* Entête Alcool */}
      <IonItem className="divTitre8">
        <IonAvatar slot="start">
          <img src="/assets/Alcool.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Alcool</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV7")} />
      </IonItem>

      {/* Détails Alcool */}
      <div id="myDIV7">
      <IonItem className="descripItem">     
          <IonRow>
            <IonCol size="1">
              <IonIcon  className="target" icon={star}/></IonCol>
            <IonCol size="3">
              <IonLabel className = 'description'><h3>Description</h3></IonLabel></IonCol>
            <IonCol size="2" >
              <IonLabel className = 'taillePortion'><h3>Taille</h3></IonLabel>
            </IonCol>
            <IonCol size="2" >
              <IonLabel className = 'uniteMesure'><h3>Unité</h3></IonLabel>
            </IonCol>
            <IonCol size="4" >
              <div className="triangle">
                <div className="triangleText1"><b>Gras</b></div>
                <div className="triangleText2"><b>Prot</b></div>
                <div className="triangleText3"><b>Fib</b></div>
                <div className="triangleText4"><b>Gluc</b></div>         
              </div>    
            </IonCol>
          </IonRow>                     
        </IonItem>
              
        {/* Items Alcool */}
        <Alcool alcools={props.alcool.alcools} />
       
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type= 'number' name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChange}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonItem>
        </IonRadioGroup>

        {/* Activer les notifications*/}
        <IonItemGroup className="notifHeader">
          <IonItem>
            <IonCol size="1"></IonCol>
            <IonCol size="2" className="notifHeader"><IonLabel>Activer les notifications</IonLabel></IonCol>
            <IonCol size='0.88'></IonCol>
            <IonCol size='1'><IonToggle color="dark" name="notifications" onIonChange={handleOnNotifications} checked={notifications.active} /></IonCol>
          </IonItem>
        </IonItemGroup>

        {/* Limites de consommations*/}
        <IonItemGroup className="limiteConsom" hidden={!notifications.active}>
          <IonItem>
            <IonCol size="1"></IonCol>
            <IonLabel className='cibleTitle'><h3>Limites de consommations</h3></IonLabel> 
          </IonItem>
          <IonItem>
            <IonCol size="2"></IonCol>
            <IonCol size="1">
              <IonInput type='number' min='0' className='inputConsom' name="dailyTarget" onIonChange={handleOnLimitConsom} disabled={limitConsom.educAlcool} value={limitConsom.dailyTarget}></IonInput>
            </IonCol>
            <IonCol size="2">
              <IonLabel position="fixed">par jour</IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size="2"></IonCol>
            <IonCol size="1">
              <IonInput type='number' min='0' className='inputConsom' name="weeklyTarget" onIonChange={handleOnLimitConsom} disabled={limitConsom.educAlcool} value={limitConsom.weeklyTarget}></IonInput>
            </IonCol>
            <IonCol size="2">
              <IonLabel position="fixed">par semaine</IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size="1"></IonCol>
            <IonCol size="1">
              <IonLabel position="fixed">Maximum</IonLabel>
            </IonCol>
            <IonCol size="1">
              <IonInput type='number' min='0' className='inputConsom' name="sobrietyDays" onIonChange={handleOnLimitConsom} value={limitConsom.sobrietyDays}></IonInput>
            </IonCol>
            <IonCol size="4">
              <IonLabel position="fixed">jours par</IonLabel>
              <IonLabel position="fixed">semaine</IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size='1'></IonCol>
            <IonCol size='2'>
              <IonCheckbox onIonChange={handleOnEducAlcool} checked={limitConsom.educAlcool} value={limitConsom.educAlcool}></IonCheckbox>
            </IonCol>
            <IonCol size='4'>
              <IonLabel>Utiliser les recommandations d'Educ'alcool</IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size='1'></IonCol>
            <IonCol size="2"> 
              <ion-label>Message de notification</ion-label>
            </IonCol>
            <IonTextarea id="message_notif" clear-on-edit="true" class="messagenotif" name="notificationMessage" onIonChange={handleOnLimitConsom} value={limitConsom.notificationMessage}></IonTextarea>
          </IonItem>
        </IonItemGroup>
      </div>
    </div>            
  );
}
export default BoissonAlcool;