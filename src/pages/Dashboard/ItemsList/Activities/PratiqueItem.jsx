import React, {useEffect, useState} from "react";
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {create, trash} from 'ionicons/icons';
import FormatDate from "../../../../DateUtils";

const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "flex":divElt.style.display = "none";
  }
}

const formatHourMinute = (time) => {
    return ((time - (time % 60)) / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + ':' + (time % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

const PratiquesItem = (props) =>  {
    const [practice, setPractice] = useState(props.practice)
    const [formatedCurrentDate, setFormatedCurrentDate] = useState('');

    useEffect(() => {
        FormatDate(practice.date.startDate).then(dt => setFormatedCurrentDate(dt))
    }, [practice.date])

    return (
      <div className='activityItem'>
        <IonLabel><b className='activityName'>{practice.name}</b></IonLabel>
        <IonRow>
          <IonCol size='3'>{formatedCurrentDate}</IonCol>
          <IonCol size='3'>{formatHourMinute(practice.time)}</IonCol>
          <IonCol size='3'>{practice.intensity}</IonCol>
          <IonCol>
            <IonButton onClick={() => accor("modifyActivity")}>
              <IonIcon icon={create}></IonIcon>
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton onClick={() => accor("deleteActivity")}>
              <IonIcon icon={trash}></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>

        <div id="modifyActivity" className='popUpWindow' onClick={() => accor("modifyActivity")}>
          <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
            <IonLabel><h1 className='activityTitle' >Modifier Activité</h1></IonLabel>
          </div>
        </div>

        <div id="deleteActivity" className='popUpWindow' onClick={() => accor("deleteActivity")}>
          <div className='popUpWindow-inner' onClick={(e) => e.stopPropagation()}>
            <IonLabel><h1 className='activityTitle' >Supprimer Activité</h1></IonLabel>
          </div>
        </div>

      </div>
    )
}

export default PratiquesItem