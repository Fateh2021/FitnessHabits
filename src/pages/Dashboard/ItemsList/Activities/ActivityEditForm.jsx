import React, {useState} from "react";
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

const ActivityEditForm = (props) => {
    const [intensity, setIntensity] = useState(props.activity.intensity)
    const [name, setName] = useState(props.activity.name)
    const [duration, setDuration] = useState(PratiqueUtil.formatHourMinute(props.activity.duration))
    const [time, setTime] = useState(PratiqueUtil.formatHourMinute(props.activity.time))

    /*
      Prepare values before submission. 
      Convert the time and duration into integers.
      Reset form after submission.
    */
    const beforeSubmit = (e) => {
        e.preventDefault()
        let [durationHour, durationMinute] = duration.split(":")
        let [timeHour, timeMinute] = time.split(":")

        props.onSubmitAction({
            id: props.activity.id,
            name,
            time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
            duration: (parseInt(durationHour) * 60 + parseInt(durationMinute)),
            intensity,
        })
        resetForm()
    }

    /*
      Reset the form to its original values.
    */
    const resetForm = () => {
        props.onDidDismiss(false)
    }

    return (
        <IonModal className='activity-modal-xsmall' data-testid={"modifyForm" + props.activity.id}
                  isOpen={props.isOpen} onDidDismiss={resetForm}>
            <IonContent className='activity-content'>
                <IonLabel data-testid="modifyTitle"><h1 className='activityTitle' >{translate.getText("MODIFY_USUAL_ACTIVITY")}</h1></IonLabel>
                <form onSubmit={beforeSubmit}>
                    <br/>
                    <IonRow>
                        <IonCol>
                            <IonInput style={{textAlign: "left"}}
                                className="inputFormActivity"
                                data-testid="nameValue"
                                type='text'
                                placeholder={translate.getText("NAME_ACTIVITY")}
                                value={name}
                                onIonChange={(e) => { setName(e.detail.value)}}
                                required={true}/>
                        </IonCol>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='4'>
                            <IonLabel data-testid="addTime">{translate.getText("START_TIME")}</IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                            <IonInput className="inputFormActivity"
                                      data-testid="timeValue"
                                      type="time"
                                      value={time}
                                      onIonChange={e => {setTime(e.detail.value) }}
                                      required={true}
                                      min={"00:00"}
                                      max={"24:00"}/>
                        </IonCol>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='4'>
                            <IonLabel data-testid="modifyDuration">{translate.getText("EXP_REPORT_DURATION")}</IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                            <IonInput className="inputFormActivity"
                                      data-testid="durationValue"
                                      type="time"
                                      value={duration}
                                      onIonChange={e => {setDuration(e.detail.value) }}
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
                            <IonSelect data-testid="intensityValue" value={intensity} onIonChange={e => {setIntensity(e.detail.value)}}>
                                <IonSelectOption value="INTENSITY_LOW">{translate.getText("INTENSITY_LOW")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_MEDIUM">{translate.getText("INTENSITY_MEDIUM")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIGH">{translate.getText("INTENSITY_HIGH")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIIT">{translate.getText("INTENSITY_HIIT")}</IonSelectOption>
                            </IonSelect>
                        </IonCol>

                    </IonRow>
                    <IonRow style={{justifyContent:"center"}}>
                        <IonButton type="submit" data-testid="modifySubmit">{translate.getText("MODIFY")}</IonButton>
                    </IonRow>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default ActivityEditForm