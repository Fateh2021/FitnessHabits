import React, {useEffect, useRef, useState} from "react";
import { IonContent, IonRow, IonIcon, IonLabel, IonModal, IonCol, IonButton} from '@ionic/react';
import {create, trash} from 'ionicons/icons';
import FormatDate from "../../../../DateUtils";
import PratiqueUtil from "./Practice.js"
import * as translate from "../../../../translate/Translator";
import PracticeEditForm from "./PracticeEditForm";

const PracticeItem = (props) =>  {
    const [practice, setPractice] = useState(props.practice)
    const [showModify, setShowModify] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [formattedDate, setFormattedDate] = useState('')
    const isMounted = useRef(1)

    const updatePractice = (Practice) => {
        setPractice(Practice)
        props.modifyPractice(Practice)
    }

    useEffect(() => {
        isMounted.current = 1

        return () => {
            isMounted.current = 0
        }
    })

    FormatDate(new Date(practice.date)).then(dt => {
        if (isMounted.current) {
            setFormattedDate(dt)
        }
    })

    return  (
      <div className='activityItem' data-testid={'practiceItem' + practice.id} >
        <IonLabel data-testid="practiceName"><b className='activityName'>{practice.name}</b></IonLabel>
        <IonRow>
          <IonCol size='4' className="fontPractice" data-testid="practiceDate">{formattedDate} {translate.getText("AT")} {PratiqueUtil.formatHourMinute(practice.time)}</IonCol>
          <IonCol size="1" className="fontPractice">|</IonCol>
          <IonCol size='2' className="fontPractice" data-testid="practiceDuration">{PratiqueUtil.formatHourMinute(practice.duration)},</IonCol>
          <IonCol size='3' className="fontPractice" data-testid="practiceIntensity">{translate.getText(practice.intensity)}</IonCol>
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

        <PracticeEditForm onSubmitAction={updatePractice} isOpen={showModify} onDidDismiss={setShowModify} practice={practice}/>

        <IonModal className='activity-modal-xsmall' isOpen={showDelete} onDidDismiss={() => {
            if (isMounted.current) {
                setShowDelete(false)
            }
        }}>
          <IonContent className='activity-content'>
            <IonLabel data-testid="deleteTitle"><h1 className='activityTitle' >{translate.getText("DELETE_ACTIVITY")}</h1></IonLabel>
            <p data-testid="deleteDescription">
              {translate.getText("DELETE_ACTIVITY_DESCRIPTIION")}
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
                props.onRemovePractice(practice)
              }
            }}>
              {translate.getText("CONFIRM_DELETE")}
            </IonButton>
          </IonContent>
        </IonModal>
      </div>
    )
}

export default PracticeItem