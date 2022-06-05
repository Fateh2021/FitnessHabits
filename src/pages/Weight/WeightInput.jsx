import React, { useState, useEffect } from "react";
import * as weightService from "./configuration/weightService"
import * as translate from "../../translate/Translator";
import { IonInput, IonIcon, IonLabel, IonItem, IonButton, IonModal, IonContent, IonSelect, IonSelectOption, IonDatetime, IonItemGroup } from "@ionic/react";
import { calendar, time} from "ionicons/icons";
import "../Tab1.css";
import "../weight.css";


// Variables in Firebase remains in French for now with a translation in comment
const WeightInput = (props) => {
  // Ajout de cette variable dans le but de vérifier quelle était la préférence d'affichage du poids.
  var prefWeight = localStorage.getItem("prefUnitePoids");
  const [unitWeight, setUnitWeight] = useState(prefWeight);
  const [popoverDate, setPopoverDate] = useState(weightService.formatDate(props.currentDate.startDate));
  var [newDailyWeight, setNewDailyWeight] = useState(props.dailyWeight);

  useEffect(() => {
    setNewDailyWeight(parseFloat(props.dailyWeight).toFixed(1));
  }, [props.dailyWeight]);

  useEffect(() => {
    setPopoverDate(weightService.formatDate(props.currentDate.startDate));
  }, [props.currentDate]);

	// Capture of the vent if the weight preference unit changes
  const handleUnitWeightChange = (event) => {
    let newUnitWeight = event.detail.value;
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
    props.adjustUnit(newUnitWeight);
    setNewDailyWeight(parseFloat(weightAdjust).toFixed(1));
  };

  const handleCloseModal = () => {
    props.setShowInputWeight(false);
    setNewDailyWeight(props.dailyWeight);
    setPopoverDate(weightService.formatDate(props.currentDate.startDate));
  }

  const beforeModalPresent = () => {
    let newTime = (new Date()).getTime();
    let time = weightService.toDate(popoverDate);
    time.setTime(newTime);
    setPopoverDate(weightService.formatDate(time))
  }

  return (
    <IonModal data-testid = "modal" isOpen={props.showInputWeight} id="input-weight-modal" 
              onDidDismiss={handleCloseModal} onWillPresent={beforeModalPresent}>
      <IonContent>
          <IonItemGroup className="weight-date">
            <IonLabel className="new-weight">
              {translate.getText("WEIGHT_NEW")}
            </IonLabel>

            <IonItem className="input-weight-item">
              <IonInput
              value={newDailyWeight}
              className="input-weight"
              type="tel"
              maxlength={5}
              onIonChange={ev => setNewDailyWeight(ev.detail.value)}   
              data-testid = "weight"  
              ></IonInput>
            </IonItem>
            
            <IonSelect className="weight-type" data-testid = "select" value={unitWeight} interface="popover" onIonChange={handleUnitWeightChange} >
              <IonSelectOption  value="LBS">LBS</IonSelectOption >
              <IonSelectOption  value="KG">KG</IonSelectOption >
            </IonSelect>
            
          </IonItemGroup>
          <IonItemGroup className="weight-date">                        
              <IonItem>
                <IonDatetime
                  className="date-format"
                  value={popoverDate}
                  display-format={props.dateFormat}
                  monthShortNames={translate.getText("ABBREVIATION_MONTH")}
                  style={{ color: "black" }}
                  onIonChange={ev => setPopoverDate(ev.detail.value)}
                  data-testid = "date" 
                />
                <IonIcon className="date-icon" icon={calendar} />
              </IonItem>

              <IonItem>
                <IonDatetime
                  className="time-format"
                  value={popoverDate}
                  display-format="HH:mm"
                  style={{ color: "black" }}
                  onIonChange={ev => setPopoverDate(ev.detail.value)}
                  data-testid = "time" 
                />
                <IonIcon className="date-icon" icon={time} />
              </IonItem>
          </IonItemGroup>
        <IonButton 
          data-testid = "add" id="input-weight-button" shape="round" expand="block" 
          onClick={() => props.onSubmit(newDailyWeight)}>{translate.getText("WEIGHT_ADD")}
        </IonButton>
      </IonContent>
    </IonModal>
  );
};
export default WeightInput;
