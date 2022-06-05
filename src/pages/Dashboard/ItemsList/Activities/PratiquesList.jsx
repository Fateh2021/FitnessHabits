import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle, addCircle} from 'ionicons/icons';
import PratiqueItem from "./PratiqueItem";

import '../../../Tab1.css';

const PratiquesList = (props) =>  {

  const [currentDate, setCurrentDate] = useState('');
  const [practices, setPractices] = useState ([]);
  const [activities, setActivities] = useState ([]);

  useEffect(() => {
    setCurrentDate(props.currentDate.startDate);
  }, [props.currentDate])

  useEffect(() => {
    setPractices(props.practices);
    setActivities(props.activities);
  }, [props.practices, props.activities])

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "flex":divElt.style.display = "none";
    }    
  }

  const addPractice = () => {
    const userUID = localStorage.getItem('userUid');
    const newId = practices.length === 0 ? 1 : Math.max.apply(Math, practices.map((practice) => {return practice.id})) + 1
    let newPractice = {
      id: newId,
      name: "Karate",
      date: currentDate.toISOString(),
      time: 60,
      intensity: "High"
    };
    setPractices(practices.concat(newPractice));
    //firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").remove();
    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: practices.concat(newPractice), activities: activities});
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
        <IonLabel><h1 className='activityTitle' >Activités</h1></IonLabel>
          {
            practices.map((practice) => (
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