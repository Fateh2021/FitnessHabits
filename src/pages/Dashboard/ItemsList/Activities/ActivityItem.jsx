import React, {useEffect, useRef, useState} from "react";
import { IonContent, IonRow, IonIcon, IonLabel, IonModal, IonCol, IonButton} from '@ionic/react';
import {create, trash} from 'ionicons/icons';
import PratiqueUtil from "./Practice.js"
import * as translate from "../../../../translate/Translator";
import ActivityEditForm from "./ActivityEditForm";

const ActivityItem = (props) =>  {
    const [activity, setActivity] = useState(props.activity)
    const [showModify, setShowModify] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const isMounted = useRef(1)

    const updatePractice = (Activity) => {
        setActivity(Activity)
        props.modifyActivity(Activity)
    }

    useEffect(() => {
        isMounted.current = 1

        return () => {
            isMounted.current = 0
        }
    })

    return  (
      <div className='activityItem' data-testid={'activityItem' + activity.id} >
        <IonLabel data-testid="practiceName"><b className='activityName'>{activity.name}</b></IonLabel>
        <IonRow>
          <IonCol size='4' className="fontPractice" data-testid="activityDuration">{PratiqueUtil.formatHourMinute(activity.duration)}</IonCol>
          <IonCol size='5' className="fontPractice" data-testid="activityIntensity">{translate.getText(activity.intensity)}</IonCol>
          <IonCol>
              <IonIcon icon={create} onClick={() =>  {
                  if (isMounted.current) {
                      setShowModify(true)}
                  }
              }></IonIcon>
          </IonCol>
          <IonCol>
              <IonIcon data-testid="deleteOpen" icon={trash} onClick={() => {
                  if (isMounted.current) {
                      setShowDelete(true)
                  }
              }}></IonIcon>
          </IonCol>
        </IonRow>

        <ActivityEditForm onSubmitAction={updatePractice} isOpen={showModify} onDidDismiss={setShowModify} activity={activity}/>

        <IonModal className='activity-modal-xxsmall' isOpen={showDelete} onDidDismiss={() => {
            if (isMounted.current) {
                setShowDelete(false)
            }
        }}>
          <IonContent className='activity-content'>
            <IonLabel data-testid="deleteTitle"><h1 className='activityTitle' >{translate.getText("DELETE_USUAL_ACTIVITY")}</h1></IonLabel>
            <p data-testid="deleteDescription">
              {translate.getText("DELETE_USUAL_ACTIVITY_DESCRIPTIION")}
            </p>
            <IonButton color="tertiary" data-testid="deleteCancel" onClick={() => {
                if (isMounted.current) {
                    setShowDelete(false)
                }
            }}>
              {translate.getText("WEIGHT_PREF_CANCEL")}
            </IonButton>
            <IonButton color="primary" data-testid="deleteConfirm" onClick={() => {
                if (isMounted.current) {
                    props.onRemoveActivity(activity)
                }
            }}>
              {translate.getText("CONFIRM_DELETE")}
            </IonButton>
          </IonContent>
        </IonModal>
      </div>
    )
}

export default ActivityItem