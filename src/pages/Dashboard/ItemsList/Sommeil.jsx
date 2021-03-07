import React, {useEffect, useState} from "react"
import * as firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';

import '../../Tab1.css';

const Sommeil = (props) => {

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [heure, setHeure] = useState(props.heures);
  const [minute, setMinute] = useState(props.minutes);
  const [sommeil, setSommeil] = useState (props.sommeil);

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }   
  }
  
  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setHeure(props.heures);
  }, [props.heures])

  useEffect(() => {
    setMinute(props.minutes);
  }, [props.minutes])

  useEffect(() => {
    setSommeil(props.sommeil);
  }, [props.sommeil])

  const handleChangeHeure = event => {
    const activitiesHeure = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.sommeil.heure= activitiesHeure;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setHeure(activitiesHeure);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleChangeMinute = event => {
    const activitiesMinute = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.sommeil.minute = activitiesMinute;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setMinute(activitiesMinute);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  return (
    <div>
      <IonItem className="divTitre7">
        <IonAvatar slot="start">
          <img src="/assets/Sommeil3.png" alt=""/>
        </IonAvatar>
        <IonLabel><h2><b>Sommeil</b></h2></IonLabel>
        <IonInput className='inputTextGly' value={heure+":"+minute} readonly></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV7")}/>
        </IonItem>
        <div id="myDIV7">
          <IonItem>     
            <IonRow>
              <IonCol size="2">
                <IonLabel className = 'joggingTitle'><h3>Durée</h3></IonLabel>
              </IonCol>
              <IonCol size="2" >
                <IonInput className='inputTextActivities' type= "number" value={heure} onIonChange={handleChangeHeure}></IonInput>  
              </IonCol>
              <IonCol className="activitieCheck" size="3" >
                <IonButton classname = "buttonActivities" color="light" onClick={""}>HH</IonButton> 
              </IonCol>
              <IonCol size="2" >
                <IonInput className='inputTextActivities' type= "number"  value={minute} onIonChange={handleChangeMinute}></IonInput>  
              </IonCol>
              <IonCol className="activitieCheck"  size="3" >
                <IonButton classname = "buttonActivities" color="light" onClick={""}>Min</IonButton> 
              </IonCol>
            </IonRow>
          </IonItem>
        </div>
    </div>  
  );
}
export default Sommeil;