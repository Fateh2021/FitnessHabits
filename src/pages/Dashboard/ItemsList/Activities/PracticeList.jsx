import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonModal, IonContent, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle, addCircle, settings} from 'ionicons/icons';
import * as translate from "../../../../translate/Translator";
import PracticeItem from "./PracticeItem";
import PratiqueUtil from "./Practice.js"
import PracticeAddForm from "./PracticeAddForm";
import '../../../Tab1.css';
import ActivityList from "./ActivityList";

const PracticeList = (props) =>  {
  const [practices, setPractices] = useState (PratiqueUtil.getPracticesFilter(props.practices, new Date()));
  const [showPratiqueList, setShowPratiqueList] = useState(false)
  const [showActivityList, setShowActivityList] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  /*
    Add a new practice to the firebase database.
    Give the practice an unique id.
    Concatenate the new practice to the list.
  */
  const addPractice = (practiceToAdd) => {
    const userUID = localStorage.getItem('userUid')
    let newId = 1
    if (practices.length !== 0) {
      newId = Math.max.apply(Math, practices.map((practice) => {return practice.id})) + 1
    }
    let newPractice = {
      id: newId,
      name: practiceToAdd.name,
      date: (new Date(practiceToAdd.date)).toISOString(),
      time: practiceToAdd.time,
      duration: practiceToAdd.duration,
      intensity: practiceToAdd.intensity
    }
    firebase.database().ref('activity/'+userUID).update({practices: practices.concat(newPractice)}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(practices.concat(newPractice), new Date()))
    })
  }

  /*
    Modify a practice in the firebase database.
    Filter the old practice from the current list.
    Concatenate the new practice to the list.
  */
  const modifyPractice = (practiceToModify) => {
    const userUID = localStorage.getItem('userUid')

    let practicesWithoutOld = practices.filter((item) => {
      return item.id !== practiceToModify.id
    }).concat({...practiceToModify})

    firebase.database().ref('activity/'+userUID).update({practices: practicesWithoutOld}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(practicesWithoutOld, new Date()))
    })

  }

  /*
    Remove a practice from the firebase database.
    Filter the practice from the current list.
  */
  const removePractice = (practiceToDelete) => {
    const remainingPractices = practices.filter( (practice) => {
      if(practice.id === practiceToDelete.id) {
        return false
      }
      return true
    })

    const userUID = localStorage.getItem('userUid')
    firebase.database().ref('activity/'+userUID).update({practices: remainingPractices}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(remainingPractices, new Date()))
    })
  };

   return (
    <div>
      <IonItem className="divTitre6">
        <IonAvatar slot="start">
          <img src="/assets/Running.jpg" alt=""/>
        </IonAvatar>
        <IonLabel data-testid="moduleTitle"><h2><b>{translate.getText("ACTIVITIES")}</b></h2></IonLabel>
        <IonIcon className="arrowDashItem" data-testid={"openPracticeList"} icon={arrowDropdownCircle} onClick={() => setShowPratiqueList(true)}/>
      </IonItem>
      <IonModal data-testid="pratiquesList" className="activity-modal-big"
                isOpen={showPratiqueList} onDidDismiss={() => setShowPratiqueList(false)}>
        <IonContent className="activity-content">
          <IonLabel><h1 className='activityTitle' >{translate.getText("ACTIVITIES")}</h1></IonLabel>
            <br/>
            {
                practices.map(practice => (
                    <PracticeItem key={practice.id} practice={practice} modifyPractice={modifyPractice} onRemovePractice={removePractice} />
                ))
            }
            <br/>
            <IonIcon className='addButtonActivity' data-testid="addPractice" icon={addCircle} onClick={() => setShowAddForm(true)} />
            <IonIcon className='addButtonActivity' data-testid="openActivityList" icon={settings} onClick={() => setShowActivityList(true)}/>
            <ActivityList activities={props.activities} showActivityList={showActivityList} setShowActivityList={setShowActivityList}/>
            <PracticeAddForm onSubmitAction={addPractice} isOpen={showAddForm} onDidDismiss={setShowAddForm} />
        </IonContent>
      </IonModal>
    </div>
  );
}
export default PracticeList;