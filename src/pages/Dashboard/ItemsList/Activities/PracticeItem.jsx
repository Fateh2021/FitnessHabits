import React, {useEffect, useState} from "react";
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {create, trash} from 'ionicons/icons';
import FormatDate from "../../../../DateUtils";
import PratiqueUtil from "./Practice.js"
import * as translate from "../../../../translate/Translator";
import PracticeForm from "./PracticeForm";

const PracticeItem = (props) =>  {
    const [practice, setPractice] = useState(props.practice)
    const [formatedCurrentDate, setFormatedCurrentDate] = useState('');

    useEffect(() => {
        FormatDate(new Date(practice.date)).then(dt => setFormatedCurrentDate(dt))
    }, [practice.date])

    const updatePractice = (Practice) => {
        setPractice(Practice)
        props.modifyPractice(Practice)
    }

    return (
      <div className='activityItem'>
        <IonLabel data-testid="practiceName"><b className='activityName'>{practice.name}</b></IonLabel>
        <IonRow>
          <IonCol size='4' data-testid="practiceDate">{formatedCurrentDate}</IonCol>
          <IonCol size='2' data-testid="practiceDuration">{PratiqueUtil.formatHourMinute(practice.time)}</IonCol>
          <IonCol size='3' data-testid="practiceIntensity">{translate.getText(practice.intensity)}</IonCol>
          <IonCol>
              <IonIcon icon={create} onClick={() => PratiqueUtil.accor("PracticeForm" + practice.id)}></IonIcon>
          </IonCol>
          <IonCol>
              <IonIcon icon={trash} onClick={() => props.onRemovePractice(practice)}></IonIcon>
          </IonCol>
        </IonRow>

        <PracticeForm onSubmitAction={updatePractice} practice={practice}/>

        <div id="deleteActivity" className='popUpWindow' onClick={() => PratiqueUtil.accor("deleteActivity")}>
          <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
            <IonLabel><h1 className='activityTitle' >Supprimer Activité</h1></IonLabel>
          </div>
        </div>

      </div>
    )
}

export default PracticeItem