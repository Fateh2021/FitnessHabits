import React, { useState, useEffect } from "react";
import * as weightService from "./configuration/weightService"
import * as translate from "../../translate/Translator";
import { IonInput, IonIcon, IonLabel, IonItem, IonButton, IonModal, IonContent, IonSelect, IonSelectOption, IonDatetime } from "@ionic/react";
import { calendar, time} from "ionicons/icons";
import "../Tab1.css";
import "../weight.css";


// Variables in Firebase remains in French for now with a translation in comment
const WeightInput = (props) => {
  // Ajout de cette variable dans le but de vérifier quel était la préférence d'affichage du poids.
  var prefWeight = localStorage.getItem("prefUnitePoids");
  const [unitWeight, setUnitWeight] = useState(prefWeight);
  const [popoverDate, setPopoverDate] = useState(weightService.formatDate(new Date()));
  const [popoverTime, setPopoverTime] = useState(popoverDate);
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [newDailyWeight, setNewDailyWeight] = useState(props.dailyWeight);

  useEffect(() => {
    setNewDailyWeight(parseFloat(props.dailyWeight).toFixed(1));
  }, [props.dailyWeight]);

  useEffect(() => {
    weightService.initPrefWeight();
    setUnitWeight(localStorage.getItem("prefUnitePoids"));

    weightService.initPrefDate();
    let format = localStorage.getItem("prefDateFormat");
    format = format.replace(/y/gi, 'Y');
    format = format.replace(/L/gi, 'M');
    format = format.replace(/d/gi, 'D');
    setDateFormat(format);
  }, []);

  useEffect(() => {
    let format = weightService.getPrefDate();;
    format = format.replace(/y/gi, 'Y');
    format = format.replace(/L/gi, 'M');
    format = format.replace(/d/gi, 'D');
    setDateFormat(format);
  }, [props.formatedCurrentDate]);

	// Capture of the vent if the weight preference unit changes
  const handleUnitWeightChange = (event) => {
    let newUnitWeight = event.target.value;
    weightService.setPrefUnitWeight(newUnitWeight);
    let oldUnitWeight = unitWeight;
    setUnitWeight(newUnitWeight);

    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    var weightAdjust = 0;
    if (oldUnitWeight === "KG" && newUnitWeight === "LBS") {
      weightAdjust = dashboard.poids.dailyPoids * 2.2;
    } else {
      weightAdjust = dashboard.poids.dailyPoids;
    }
		// Then we reduce to one decimal point but using parseFloat to use toFixed
    props.setDailyWeight(parseFloat(weightAdjust).toFixed(1));
    setNewDailyWeight(parseFloat(weightAdjust).toFixed(1));
  };

  const handleCloseModal = () => {
    props.setShowInputWeight(false);
    setNewDailyWeight(props.dailyWeight);
  }

  return (
    <IonModal isOpen={props.showInputWeight} id="input-weight-modal" onDidDismiss={handleCloseModal}>
      <IonContent>
          <IonItem className="no-focus">
            <IonLabel className="new-weight">
              {translate.getText("WEIGHT_NEW")}
            </IonLabel>
            <IonInput
            value={newDailyWeight}
            className="input-weight"
            type="tel"
            maxlength={5}
            onIonChange={ev => setNewDailyWeight(ev.detail.value)}
            
            /*data-testid = "poids_input"  
            aria-label="weight"
            title="Daily weight"*/
            ></IonInput>
            <IonSelect  data-testid = "select" value={unitWeight} interface="popover" onIonChange={handleUnitWeightChange} >
              <IonSelectOption  value="LBS">LBS</IonSelectOption >
              <IonSelectOption  value="KG">KG</IonSelectOption >
            </IonSelect >
          </IonItem>
          <IonItem>                        
              <IonDatetime
                className="date-format"
                value={popoverDate}
                display-format={dateFormat}
                style={{ color: "black" }}
                onIonChange={ev => setPopoverDate(weightService.formatDate(ev.detail.value))}
              />
              <IonIcon className="date-icon" icon={calendar} />
              
              <IonDatetime
                className="time-format"
                value={popoverTime}
                display-format="HH:mm"
                style={{ color: "black" }}
                onIonChange={ev => setPopoverTime(ev.detail.value)}
              />
              <IonIcon className="date-icon" icon={time} />
              
          </IonItem>
        <IonButton id="input-weight-button" shape="round" expand="block" onClick={() => props.onSubmit(newDailyWeight)}>{translate.getText("WEIGHT_ADD")}</IonButton>
      </IonContent>
    </IonModal>
  );
};
export default WeightInput;
