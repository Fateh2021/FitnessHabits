import React, {useState} from "react"
import firebase from 'firebase'
import { IonModal, IonContent, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle, addCircle} from 'ionicons/icons';
import * as translate from "../../../../translate/Translator";
import PracticeItem from "./PracticeItem";
import PratiqueUtil from "./Practice.js"
import PracticeForm from "./PracticeForm";
import '../../../Tab1.css';

const PracticeList = (props) =>  {
  const [currentDate, setCurrentDate] = useState(props.currentDate.startDate);
  const [practices, setPractices] = useState (PratiqueUtil.getPracticesFilter(props.practices, currentDate));
  const [showPratiqueList, setShowPratiqueList] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const addPractice = (practiceToAdd) => {
    if (currentDate.setHours(0, 0, 0, 0) > (new Date()).setHours(0, 0, 0, 0))
      return

    const userUID = localStorage.getItem('userUid')
    const newId = practices.length === 0 ? 1 : Math.max.apply(Math, practices.map((practice) => {return practice.id})) + 1
    let newPractice = {
      id: newId,
      name: practiceToAdd.name,
      date: currentDate.toISOString(),
      time: practiceToAdd.time,
      intensity: practiceToAdd.intensity
    }


    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: practices.concat(newPractice)}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(practices.concat(newPractice), currentDate))
    })
  }

  const modifyPractice = (practiceToModify) => {
    const userUID = localStorage.getItem('userUid')

    let practicesWithoutOldPractice = practices.filter((item) => {
      return item.id !== practiceToModify.id
    }).concat({...practiceToModify})


    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: practicesWithoutOldPractice}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(practicesWithoutOldPractice, currentDate))
    })

  }

  const removePractice = (practiceToDelete) => {
    const remainingPractices = practices.filter( (practice) => {
      if(practice.id === practiceToDelete.id) {
        return false
      }
      return true
    })

    const userUID = localStorage.getItem('userUid')
    firebase.database().ref('dashboard/'+userUID+ "/moduleActivity").update({practices: remainingPractices}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(remainingPractices, currentDate))
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
            <IonIcon className='addButtonActivity' icon={addCircle} onClick={() => setShowAddForm(true)} />
            <PracticeForm onSubmitAction={addPractice} isOpen={showAddForm} onDidDismiss={setShowAddForm} />
        </IonContent>
      </IonModal>
    </div>
  );
}
export default PracticeList;