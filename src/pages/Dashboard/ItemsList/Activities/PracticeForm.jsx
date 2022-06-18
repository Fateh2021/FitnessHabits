import React, {useEffect, useState} from "react";
import {
    IonButton,
    IonCol,
    IonDatetime,
    IonLabel,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonContent,
    IonModal,
    IonInput
} from "@ionic/react";
import PratiqueUtil from "./Practice";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css"

const PracticeForm = (props) => {
    const [intensity, setIntensity] = useState(props.practice ? props.practice.intensity : "INTENSITY_LOW")
    const [name, setName] = useState(props.practice ? props.practice.name : '')
    const [time, setTime] = useState(props.practice ? PratiqueUtil.formatHourMinute(props.practice.time) : '00:00')

    const beforeSubmit = (e) => {
        e.preventDefault()
        let [hour, minute] = time.split(":")

        if (props.practice) {
            props.onSubmitAction({
                id: props.practice.id,
                name,
                time: (parseInt(hour) * 60 + parseInt(minute)),
                intensity,
                date: props.practice.date
            })
        }
        else {
            props.onSubmitAction({
                name,
                time: (parseInt(hour) * 60 + parseInt(minute)),
                intensity
            })
        }
        resetForm()
    }

    const resetForm = () => {
        if (!props.practice) {
            setName('')
            setTime('00:00')
            setIntensity("INTENSITY_LOW")
        }
        props.onDidDismiss(false)
    }

    return (
        <IonModal className='activity-modal-small'
                  isOpen={props.isOpen} onDidDismiss={resetForm}>
            <IonContent className='activity-content'>
                <IonLabel data-testid="modifyTitle"><h1 className='activityTitle' >{(props.practice ? translate.getText("MODIFY_ACTIVITY") : translate.getText("ADD_ACTIVITY"))}</h1></IonLabel>
                <form onSubmit={beforeSubmit}>
                    <br/>
                    <IonRow>
                        <IonInput style={{textAlign: "left"}} className="inputFormActivity" type='text' placeholder={translate.getText("NAME_ACTIVITY")}
                                  value={name} required={true} onIonChange={(e) => { setName(e.detail.value)}}
                        />
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='4'>
                            <IonLabel data-testid="modifyDuration">{translate.getText("EXP_REPORT_DURATION")}</IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                            <IonInput className="inputFormActivity"
                                      type="time"
                                      value={time}
                                      onIonChange={e =>  {setTime(e.detail.value) }}
                                      required={true}
                                      min={"00:01"}
                                      max={"24:00"}/>
                        </IonCol>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='8'>
                            <IonLabel data-testid="modifyIntensity">{translate.getText("INTENSITY")}</IonLabel>
                        </IonCol>
                        <IonCol size='4'>
                            <IonSelect value={intensity} onIonChange={e => {setIntensity(e.detail.value)}}>
                                <IonSelectOption value="INTENSITY_LOW">{translate.getText("INTENSITY_LOW")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_MEDIUM">{translate.getText("INTENSITY_MEDIUM")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIGH">{translate.getText("INTENSITY_HIGH")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIIT">{translate.getText("INTENSITY_HIIT")}</IonSelectOption>
                            </IonSelect>
                        </IonCol>

                    </IonRow>
                    <IonRow style={{justifyContent:"center"}}>
                        <IonButton type="submit" data-testid="modifySubmit">{(props.practice ? translate.getText("MODIFY") : translate.getText("ADD"))}</IonButton>
                    </IonRow>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default PracticeForm