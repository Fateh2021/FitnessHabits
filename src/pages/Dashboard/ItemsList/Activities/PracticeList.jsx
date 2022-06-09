import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle, addCircle} from 'ionicons/icons';
import * as translate from "../../../../translate/Translator";
import PracticeItem from "./PracticeItem";
import PratiqueUtil from "./Practice.js"
import PracticeForm from "./PracticeForm";
import '../../../Tab1.css';
import practice from "./Practice.js";

const PracticeList = (props) =>  {

  const [currentDate, setCurrentDate] = useState(props.currentDate.startDate);
  const [practices, setPractices] = useState ([]);
  const [activities, setActivities] = useState ([]);

  useEffect(() => {
    setPractices(PratiqueUtil.getPracticesFilter(props.practices, currentDate));
    setActivities(props.activities);
  }, [props.practices, props.activities])

  const addPractice = (Practice) => {
    if (currentDate.setHours(0, 0, 0, 0) > (new Date()).setHours(0, 0, 0, 0))
      return

    const userUID = localStorage.getItem('userUid')
    const newId = practices.length === 0 ? 1 : Math.max.apply(Math, practices.map((practice) => {return practice.id})) + 1
    let newPractice = {
      id: newId,
      name: Practice.name,
      date: currentDate.toISOString(),
      time: Practice.time,
      intensity: Practice.intensity
    }

    setPractices(PratiqueUtil.getPracticesFilter(practices.concat(newPractice), currentDate))
    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: practices.concat(newPractice), activities: activities})
  }

  const modifyPractice = (Practice) => {
    const userUID = localStorage.getItem('userUid')

    let practicesWithoutOldPractice = practices.filter((item) => {
      return item.id !== Practice.id
    }).concat({...Practice})

    setPractices(PratiqueUtil.getPracticesFilter(practicesWithoutOldPractice, currentDate))
    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: practicesWithoutOldPractice, activities: activities})
  }

  const handleRemovePractice = (practiceToDelete) => {
    const remainingPractices = practices.filter( (practice) => {
      if(practice.id === practiceToDelete.id) {
        return false
      }
      return true;
    });

    setPractices(remainingPractices);

    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: remainingPractices});
  };

  return (
    <div>
      <IonItem className="divTitre6">
        <IonAvatar slot="start">
          <img src="/assets/Running.jpg" alt=""/>
        </IonAvatar>
        <IonLabel><h2><b>{translate.getText("ACTIVITIES")}</b></h2></IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => PratiqueUtil.accor("pratiquesList")}/>
      </IonItem>
      <div id="pratiquesList" className='popUpWindow' onClick={() => PratiqueUtil.accor("pratiquesList")}>
        <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
        <IonLabel><h1 className='activityTitle' >{translate.getText("ACTIVITIES")}</h1></IonLabel>
          <br/>
          {
            practices.map((practice) => (
                <PracticeItem key={practice.id} practice={practice} modifyPractice={modifyPractice} onRemovePractice={handleRemovePractice} />
            ))
          }
          <br/>
          <IonIcon className='addButtonActivity' icon={addCircle} onClick={() => PratiqueUtil.accor("PracticeFormAdd")} />
          <PracticeForm onSubmitAction={addPractice} />
        </div>
      </div>
    </div>    
  );
}
export default PracticeList;