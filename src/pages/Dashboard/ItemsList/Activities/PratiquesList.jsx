import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';
import PratiqueItem from "./PratiqueItem";

import '../../../Tab1.css';

const PratiquesList = (props) =>  {

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [activities, setActivities] = useState (props.activities);


  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "flex":divElt.style.display = "none";
    }    
  }


  const handleChangeMinute = event => {
    const activitiesMinute = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.activities.minute = activitiesMinute;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }
  
  const handleChangeHeure = event => {
    const activitiesHeure = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.activities.heure= activitiesHeure;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  return (
    <div>
      <IonItem className="divTitre6">
        <IonAvatar slot="start">
          <img src="/assets/Running.jpg" alt=""/>
        </IonAvatar>
        <IonLabel><h2><b>Activités</b></h2></IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("pratiquesList")}/>
      </IonItem>
      <div id="pratiquesList" className='popUpWindow' onClick={() => accor("pratiquesList")}>
        <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
          <h1 className='activityTitle' >Activités</h1>
          {
            activities.map((activity) => (
                <PratiqueItem key={activity.id} currentDate={currentDate.startDate} activity={activity} />
            ))
          }
        </div>
      </div>
    </div>    
  );
}
export default PratiquesList;