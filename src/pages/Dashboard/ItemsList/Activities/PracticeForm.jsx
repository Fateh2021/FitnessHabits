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

const PracticeForm = (props) => {
    var currentDate = new Date()
    var offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - (offset * 60 * 1000))
    currentDate = currentDate.toISOString().split('T')[0]

    const [date, setDate] = useState(props.practice ? props.practice.date : currentDate)
    const [intensity, setIntensity] = useState(props.practice ? props.practice.intensity : "INTENSITY_LOW")
    const [name, setName] = useState(props.practice ? props.practice.name : '')
    const [duration, setDuration] = useState(props.practice ? PratiqueUtil.formatHourMinute(props.practice.duration) : '00:00')
    const [time, setTime] = useState(props.practice ? PratiqueUtil.formatHourMinute(props.practice.time) : '00:00')

    const beforeSubmit = (e) => {
        e.preventDefault()
        let [durationHour, duratioMinute] = duration.split(":")
        let [timeHour, timeMinute] = time.split(":")

        if (props.practice) {
            props.onSubmitAction({
                id: props.practice.id,
                name,
                time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
                duration: (parseInt(durationHour) * 60 + parseInt(duratioMinute)),
                intensity,
                date
            })
        }
        else {
            props.onSubmitAction({
                name,
                time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
                duration: (parseInt(durationHour) * 60 + parseInt(duratioMinute)),
                intensity,
                date
            })
        }
        resetForm()
    }

    const resetForm = () => {
        if (!props.practice) {
            setName('')
            setDate(currentDate)
            setDuration('00:00')
            setTime('00:00')
            setIntensity("INTENSITY_LOW")
        }
        props.onDidDismiss(false)
    }

    return (
        <IonModal className='activity-modal-small' data-testid={(props.practice ? "modifyForm" + props.practice.id : "addForm")}
                  isOpen={props.isOpen} onDidDismiss={resetForm}>
            <IonContent className='activity-content'>
                <IonLabel data-testid="modifyTitle"><h1 className='activityTitle' >{(props.practice ? translate.getText("MODIFY_ACTIVITY") : translate.getText("ADD_ACTIVITY"))}</h1></IonLabel>
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
                                min="1970-01-01"
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
                                      onIonChange={e =>  {setTime(e.detail.value) }}
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
                                      onIonChange={e =>  {setDuration(e.detail.value) }}
                                      required={true}
                                      min={"00:00"}
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
                        <IonButton type="submit" data-testid="modifySubmit">{(props.practice ? translate.getText("MODIFY") : translate.getText("ADD"))}</IonButton>
                    </IonRow>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default PracticeForm