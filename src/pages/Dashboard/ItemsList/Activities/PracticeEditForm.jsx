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

const PracticeEditForm = (props) => {
    const [currentDate, minDate] = PratiqueUtil.getCurrentMinDate()

    const [date, setDate] = useState(props.practice.date)
    const [intensity, setIntensity] = useState(props.practice.intensity)
    const [name, setName] = useState(props.practice.name)
    const [duration, setDuration] = useState(PratiqueUtil.formatHourMinute(props.practice.duration))
    const [time, setTime] = useState(PratiqueUtil.formatHourMinute(props.practice.time))

    /*
      Prepare values before submission. 
      Convert the time and duration into integers.
      Reset form after submission.
    */
    const beforeSubmit = (e) => {
        e.preventDefault()
        let [durationHour, duratioMinute] = duration.split(":")
        let [timeHour, timeMinute] = time.split(":")

        props.onSubmitAction({
            id: props.practice.id,
            name,
            time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
            duration: (parseInt(durationHour) * 60 + parseInt(duratioMinute)),
            intensity,
            date
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
        <IonModal className='activity-modal-small' data-testid={"modifyForm" + props.practice.id}
                  isOpen={props.isOpen} onDidDismiss={resetForm}>
            <IonContent className='activity-content'>
                <IonLabel data-testid="modifyTitle"><h1 className='activityTitle' >{translate.getText("MODIFY_ACTIVITY")}</h1></IonLabel>
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
                            <IonLabel data-testid="modifyDate">{translate.getText("DATE_TITLE")}</IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                            <IonDatetime className="inputFormActivity"
                                data-testid="dateValue"
                                displayFormat="YYYY-MM-DD"
                                min={minDate}
                                max={currentDate}
                                value={date}
                                onIonChange={(e) => { setDate(e.detail.value)}}
                                required={true}
                            />
                        </IonCol>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='4'>
                            <IonLabel data-testid="modifyTime">{translate.getText("EXP_REPORT_TIME")}</IonLabel>
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

export default PracticeEditForm