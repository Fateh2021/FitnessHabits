import React, {useState, useEffect} from "react"
import { IonInput, IonButton, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import { arrowDropdownCircle, trash, addCircle, removeCircle} from 'ionicons/icons';
import firebase from 'firebase'
import DefaultSettings from '../../../Settings/DefaultSettings'
import { DateTime } from "luxon";
import { getLang } from "../../../../translate/Translator"

import '../../../Tab1.css';
import AlcoolItem from './AlcoolItem';

const AlcoolList = (props) => {
  //---- Header alcool ---------
  const [, setDailyTarget] = useState(props.alcool.dailyTarget);
  const [alcool, setAlcool] = useState(props.alcools);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.alcool.dailyTarget);
  }, [props.alcool.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(() => {
    setAlcool(props.alcools);
  }, [props.alcools])
  
  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      divElt.style.display = (!divElt.style.display || divElt.style.display === "none")
        ? "block"
        : "none";
    }
  }

//---- Items alcool ---------
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);

    if (index !== 0) {
      array[index] = item;
    }

    array[item].consumption += 1;

    updateCacheAndBD(array);

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  
    console.log('currentDate :::::' + currentDate.startDate.getMonth())
  }

  const DailyConsumptionDecrementAlcool = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);  

    if (index !== 0) {
      array[index] = item;
    }

    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }

    updateCacheAndBD(array);

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  
    console.log('currentDate :::::' + currentDate.startDate.getMonth())
  }

  const totalConsumption = ()=>{
    var array = [...alcool];
    var sum = 0;
    var consumption = 0;
    debugger;
    for (let item of array){
      consumption = item.consumption;
      sum += consumption; 
    }
    console.log ("la somme ::::: " + sum);
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItemAlcool = (item) => {
    var array = [...alcool];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    console.log("index :::::" + array[item].id);

    if (index === -1) {
      array.splice(item, 1);
    } else {
      array[item] = item;
    }

    setAlcool(array);  
    for (let value of array){
      consumption = value.consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.alcools = array;
    dashboard.alcool.dailyTarget.globalConsumption = sum;    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
     
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
    var array = [...alcool];
    const index = array.findIndex((e) => e.id === item.id);

    if (index === -1) {
      array.unshift(item);
    } else {
      array[index] = item;
    }

    setAlcool (array);
    closeItemContainer();
    updateCacheAndBD(array);
    checkNotifications();
  }

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  const updateCacheAndBD = (alcools) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.alcools= alcools;
    console.log("dashboard.alcool.alcools:::::" + JSON.stringify( dashboard))
    setAlcool(alcools)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase
    .database()
    .ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
    .update(dashboard)
    .then(() => {
      console.log("props.currentDate.startDate.getDay())::::::" + props.currentDate.startDate.getDay());
      console.log ("currentDate.startDate" + currentDate.startDate.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      }))
      checkNotifications();
    });
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const checkNotifications = () => {
    // Obtenir les préférences de l'utilisateur
    const userUID = localStorage.getItem('userUid');
    firebase
      .database()
      .ref('settings/' + userUID + '/alcool')
      .once("value", (snapshot) => {
        const sets = snapshot.val();
        const alcoolSettings = sets ?? {
          dailyTarget:{
            value:0,
            unit:''
          },
          notifications :{
            active: false
          }, 
          limitConsom : {
            educAlcool: true,
            weeklyTarget: 0,
            dailyTarget: 0,
            sobrietyDays: 7,
            notificationMessage: ''
          },
          alcools:DefaultSettings.alcools
        };

        alcoolSettings.limitConsom.notificationMessage = getNotificationMsg()

        // Obtenir les consommation jusqu'au dernier lundi
        getConsommationBackToMonday(alcoolSettings, userUID);
        
      });
  }

  const getConsommationBackToMonday = (alcoolSettings, userUID) =>
    firebase
      .database()
      .ref('dashboard/' + userUID)
      .orderByKey()
      .once("value", (snapshot) => {
        const consommations = snapshot.val();
        const date = new Date();

        // Vérifier s'il respecte ses consommations journalières
        respectDailyConsumption(alcoolSettings, consommations, date);

        // Vérifier s'il respecte ses consommations hebdomadaires
        // Obtenir les formats de date de la semaine
        respectWeeklyConsumption(alcoolSettings, consommations, date);

        // Vérifier s'il respecte ses jours de consommation de suite 
        respectConsecutiveConsumption(alcoolSettings, consommations, date);

      });

  const respectDailyConsumption = (alcoolSettings, consommations, date) => {
    const dailyCount = getConsumptionsCount(consommations, date);

    if (alcoolSettings.notifications.active && 
      alcoolSettings.limitConsom && 
      alcoolSettings.limitConsom.dailyTarget && 
      dailyCount > alcoolSettings.limitConsom.dailyTarget
    ) {
      displayNotification(getLang(), alcoolSettings.limitConsom.notificationMessage);
    }
  }

  const respectWeeklyConsumption = (alcoolSettings, consommations, date) => {
    let weeklyCount = 0;
      for (let i = 0; i < date.getDay(); i++) {
        const dateDiff = DateTime.fromJSDate(date).minus({ days: i}).toJSDate();
        weeklyCount += getConsumptionsCount(consommations, dateDiff)
      }
      if(alcoolSettings.notifications.active && alcoolSettings.limitConsom &&
          alcoolSettings.limitConsom.weeklyTarget && weeklyCount > alcoolSettings.limitConsom.weeklyTarget) {
        displayNotification(getLang(), alcoolSettings.limitConsom.notificationMessage)
      }
  }

  const respectConsecutiveConsumption = (alcoolSettings, consommations, date) => {
    let streak = true;
    if(alcoolSettings.limitConsom && alcoolSettings.limitConsom.sobrietyDays)
    {
      for (let i = 0; i < alcoolSettings.limitConsom.sobrietyDays; i++) {
        const dateDiff = DateTime.fromJSDate(date).minus({ days: i}).toJSDate();
        if(getConsumptionsCount(consommations, dateDiff) === 0) {
          streak = false;
          break;
        }
      }
    }

    console.log("Nombre de jours de consommation: ", +alcoolSettings.limitConsom.sobrietyDays);
    if (streak) {
      console.log("!!notification days streak");
    }
  }

  const getDbDate = (date) => {
    return date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
  }

  const getNotificationMsg = () => {
    var userLang = getLang()
    switch (userLang) {
      case "fr": return "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite. C'est juste un rappel..."
      case "en": return "According to EducAlcool guidelines, you just exceeded the limits of alcohol intake. This is just a reminder..."
      case "es": return "Según las recomendaciones de ÉducAlcool, acaba de superar el límite. Es solo un recordatorio ..."
    }
  }

  const getConsumptionsCount = (consommations, date) => {
    let count = 0;
    const code = getDbDate(date);
    if(consommations[code] && consommations[code].alcool && consommations[code].alcool.alcools)
    {
      for (const alc of consommations[code].alcool.alcools) {
        if(alc.consumption) {
          count += alc.consumption;
        }
      }
    }
    return count;
  }

  const displayNotification = (header, message) => {
    // Notification already being displayed check
    if (document.getElementsByTagName('ion-toast').length > 0) {
      return
    }

    const toast = document.createElement('ion-toast');
    let header_msg
    let close_msg
    switch (header) {
      case "en": 
        header_msg = "Too much alcohol?"
        close_msg = "Close"
            break;
      case "fr": 
        header_msg = "Trop d'Alcool?"
        close_msg = "Fermer"
            break;
      case "es": 
        header_msg = "¿Demasiado alcohol?"
        close_msg = "Cerrar"
    }

    toast.header = header_msg;
    toast.message = message;
    toast.duration = 5000;
    toast.position = 'top'
    toast.cssClass = 'toast-alcool'
    toast.buttons = [close_msg];

    document.body.appendChild(toast);
    toast.present();
  }

  return (
  <div>
    <IonItem className="divTitre8">
      <IonAvatar slot="start">
        <img src="/assets/Alcool.jpg" alt=""/>
      </IonAvatar>
      <IonLabel><h2><b>Alcool</b></h2></IonLabel>
      <IonInput className='inputTextGly' value = {globalConsumption} readonly></IonInput> 
      <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV8")}/>
    </IonItem>          
    <div id="myDIV8">
    <div> 
          <div className="divHyd">
            <div className="sett">
              { alcool.map((alco, index) => (      
                <IonItem className="divTitre11" key={alco.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{alco.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrementAlcool(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {alco.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItemAlcool(index)}>
                    <IonIcon  icon={trash} />
                  </IonButton>
                </IonItem>
                ))
              } 
            </div>
          </div>
          <div className="ajoutBotton">    
            <IonButton className="ajoutbreuvage1" color="danger" size="small" onClick={() => openAddItemContainer()}>
            <IonIcon icon={addCircle}/><label className="labelAddItem">breuvage</label></IonButton>
          </div>
          {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashAlcool) => saveItem(itemDashAlcool)}/>}   
        </div>        
    </div>
  </div>  
  );
}
export default AlcoolList;