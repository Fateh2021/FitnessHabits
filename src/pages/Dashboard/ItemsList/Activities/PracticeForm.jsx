import React, {useEffect, useState} from "react";
import {IonButton, IonCol, IonDatetime, IonLabel, IonRow, IonSelect, IonSelectOption} from "@ionic/react";
import PratiqueUtil from "./Practice";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css"

const PracticeForm = (props) => {
    const [intensity, setIntensity] = useState("INTENSITY_LOW")
    const [name, setName] = useState('')
    const [time, setTime] = useState('00:00')
    const [errors, setErrors] = useState({})

    const divId = "PracticeForm" + (props.practice ? props.practice.id : "Add")

    const handleValidation = () => {
        let errorsFound = {}
        let [hour, minute] = time.split(":")

        if ((parseInt(hour) * 60 + parseInt(minute)) === 0) {
            errorsFound["time"] = translate.getText("TIME_ERROR")
        }
        if (name.length === 0) {
            errorsFound["name"] = translate.getText("NAME_ERROR")
        }
        return errorsFound
    }

    const beforeSubmit = (e) => {
        e.preventDefault()
        let [hour, minute] = time.split(":")
        let formValid = handleValidation()

        if (Object.keys(formValid).length === 0) {
            props.onSubmitAction({name, time: (parseInt(hour) * 60 + parseInt(minute)), intensity})
            resetForm()
        }
        setErrors(formValid)
    }

    const resetForm = () => {
        setName('')
        setTime('00:00')
        setIntensity("INTENSITY_LOW")
        setErrors({})
        PratiqueUtil.accor(divId)
    }

    return (
        <div id={divId} className='popUpWindow' onClick={resetForm}>
            <div className='popUpWindow-inner-small' onClick={(e) => {
                e.stopPropagation()
            }}>
                <IonLabel><h1 className='activityTitle' >{(props.practice ? translate.getText("MODIFY_ACTIVITY") : translate.getText("ADD_ACTIVITY"))}</h1></IonLabel>
                <form onSubmit={beforeSubmit}>
                    <br/>
                    <IonRow>
                        <input style={{textAlign: "left"}} className="inputFormActivity" type='text' placeholder="Nom de l'activité"
                               value={name}
                               onChange={(e) => {
                                   setName(e.target.value)
                                   handleValidation()
                                }}/>
                        <span style={{ color: "red" }}>{errors["name"]}</span>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='4'>
                            <IonLabel>{translate.getText("EXP_REPORT_DURATION")}</IonLabel>
                        </IonCol>
                        <IonCol size='8'>
                            <IonDatetime className="inputFormActivity"
                                         cancelText={translate.getText("CANCEL")}
                                         doneText="OK"
                                         displayFormat="HH:mm"
                                         value={time}
                                         onIonChange={e =>  {
                                             setTime(e.detail.value)
                                             handleValidation()
                                         }}/>
                        </IonCol>
                        <span style={{ color: "red" }}>{errors["time"]}</span>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='8'>
                            <IonLabel>{translate.getText("INTENSITY")}</IonLabel>
                        </IonCol>
                        <IonCol size='4'>
                            <IonSelect value={intensity} onIonChange={e => {
                                setIntensity(e.detail.value)
                                handleValidation()
                            }}>
                                <IonSelectOption value="INTENSITY_LOW">{translate.getText("INTENSITY_LOW")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_MEDIUM">{translate.getText("INTENSITY_MEDIUM")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIGH">{translate.getText("INTENSITY_HIGH")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIIT">{translate.getText("INTENSITY_HIIT")}</IonSelectOption>
                            </IonSelect>
                        </IonCol>

                    </IonRow>
                    <IonRow style={{justifyContent:"center"}}>
                        <IonButton type="submit">{translate.getText("SUPPL_ADD_SELECT")}</IonButton>
                    </IonRow>
                </form>
            </div>
        </div>
    )
}

export default PracticeForm