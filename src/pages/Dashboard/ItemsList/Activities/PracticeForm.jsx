import React, {useEffect, useState} from "react";
import {IonCol, IonDatetime, IonLabel, IonRow, IonSelect, IonSelectOption} from "@ionic/react";
import PratiqueUtil from "./Practice";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css"

const PracticeForm = (props) => {
    const [intensity, setIntensity] = useState("INTENSITY_LOW")
    const [name, setName] = useState('')
    const [time, setTime] = useState('00:00')
    const [errors, setErrors] = useState({})

    const divId = "PracticeForm" + (props.practice ? props.practice.id : "Add")

    const beforeSubmit = (e) => {
        e.preventDefault()

        let [hour, minute] = time.split(":")
        let formValid = true
        let errorsFound = {}

        if ((parseInt(hour) * 60 + parseInt(minute)) === 0) {
            formValid = false
            errorsFound["time"] = translate.getText("TIME_ERROR")
        }
        if (name.length === 0) {
            formValid = false
            errorsFound["name"] = translate.getText("NAME_ERROR")
        }

        if (formValid) {
            props.onSubmitAction({name, time: (parseInt(hour) * 60 + parseInt(minute)), intensity})

            setName('')
            setTime(0)
            setIntensity("INTENSITY_LOW")

            PratiqueUtil.accor(divId)
        }
        else {
            setErrors({...errorsFound})
        }

        return formValid
    }



    return (
        <div id={divId} className='popUpWindow' onClick={() => PratiqueUtil.accor(divId)}>
            <div className='popUpWindow-inner-small' onClick={(e) => e.stopPropagation()}>
                <IonLabel><h1 className='activityTitle' >{(props.practice ? translate.getText("MODIFY_ACTIVITY") : translate.getText("ADD_ACTIVITY"))}</h1></IonLabel>
                <form onSubmit={beforeSubmit}>
                    <br/>
                    <IonRow>
                        <input style={{textAlign: "left"}} className="inputFormActivity" type='text' placeholder="Nom de l'activité"
                               value={name} onChange={(e) => setName(e.target.value)}/>
                        <span style={{ color: "red" }}>{errors["name"]}</span>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='8'>
                            <IonLabel>{translate.getText("EXP_REPORT_DURATION")}</IonLabel>
                        </IonCol>
                        <IonCol size='4'>
                            <IonDatetime className="inputFormActivity"
                                         cancelText={translate.getText("CANCEL")}
                                         doneText="OK"
                                         displayFormat="HH:mm"
                                         value={time}
                                         onIonChange={e => setTime(e.detail.value)}/>
                        </IonCol>
                        <span style={{ color: "red" }}>{errors["time"]}</span>
                    </IonRow>
                    <br/>
                    <IonRow>
                        <IonCol size='8'>
                            <IonLabel>{translate.getText("INTENSITY")}</IonLabel>
                        </IonCol>
                        <IonCol size='4'>
                            <IonSelect value={intensity} onIonChange={e => setIntensity(e.detail.value)}>
                                <IonSelectOption value="INTENSITY_LOW">{translate.getText("INTENSITY_LOW")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_MEDIUM">{translate.getText("INTENSITY_MEDIUM")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIGH">{translate.getText("INTENSITY_HIGH")}</IonSelectOption>
                                <IonSelectOption value="INTENSITY_HIIT">{translate.getText("INTENSITY_HIIT")}</IonSelectOption>
                            </IonSelect>
                        </IonCol>

                    </IonRow>
                    <IonRow style={{justifyContent:"center"}}>
                        <input type="submit" value="Ajouter"/>
                    </IonRow>
                </form>
            </div>
        </div>
    )
}

export default PracticeForm