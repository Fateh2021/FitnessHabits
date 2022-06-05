import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle, addCircle} from 'ionicons/icons';
import PratiqueItem from "./PratiqueItem";

import '../../../Tab1.css';

const PratiquesList = (props) =>  {

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [module, setModule] = useState (props.module);

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

  const addPractice = () => {
    const userUID = localStorage.getItem('userUid');
    const newId = module.practices.length === 0 ? 1 : Math.max.apply(Math, module.practices.map((practice) => {return practice.id})) + 1
    module.practices.push({
      id: newId,
      name: "Karate",
      date: currentDate.startDate,
      time: 60,
      intensity: "High"
    })
    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update(module);
    setModule(module);
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
            module.practices.map((practice) => (
                <PratiqueItem key={practice.id} practice={practice} />
            ))
          }
          <IonIcon className='addButtonActivity' icon={addCircle} onClick={addPractice} />
        </div>
      </div>
    </div>    
  );
}
export default PratiquesList;