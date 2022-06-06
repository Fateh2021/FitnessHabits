import React, {useEffect, useState} from "react";
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {create, trash} from 'ionicons/icons';
import FormatDate from "../../../../DateUtils";
import PratiqueUtil from "./Practice.js"
import * as translate from "../../../../translate/Translator";

const PracticeItem = (props) =>  {
    const [practice, setPractice] = useState(props.practice)
    const [formatedCurrentDate, setFormatedCurrentDate] = useState('');

    useEffect(() => {
        FormatDate(new Date(practice.date)).then(dt => setFormatedCurrentDate(dt))
    }, [practice.date])

    return (
      <div className='activityItem'>
        <IonLabel><b className='activityName'>{practice.name}</b></IonLabel>
        <IonRow>
          <IonCol size='4'>{formatedCurrentDate}</IonCol>
          <IonCol size='2'>{PratiqueUtil.formatHourMinute(practice.time)}</IonCol>
          <IonCol size='3'>{translate.getText(practice.intensity)}</IonCol>
          <IonCol>
              <IonIcon icon={create} onClick={() => PratiqueUtil.accor("modifyActivity")}></IonIcon>
          </IonCol>
          <IonCol>
              <IonIcon icon={trash} onClick={() => PratiqueUtil.accor("deleteActivity")}></IonIcon>
          </IonCol>
        </IonRow>

        <div id="modifyActivity" className='popUpWindow' onClick={() => PratiqueUtil.accor("modifyActivity")}>
          <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
            <IonLabel><h1 className='activityTitle' >Modifier Activité</h1></IonLabel>
          </div>
        </div>

        <div id="deleteActivity" className='popUpWindow' onClick={() => PratiqueUtil.accor("deleteActivity")}>
          <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
            <IonLabel><h1 className='activityTitle' >Supprimer Activité</h1></IonLabel>
          </div>
        </div>

      </div>
    )
}

export default PracticeItem