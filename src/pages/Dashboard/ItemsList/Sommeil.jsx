import React, { useEffect, useState } from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton, IonDatetime, IonGrid, IonSelect, IonSelectOption } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';

import '../../Tab1.css';

const Sommeil = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
  const [selectedDateDebut, setSelectedDateDebut] = useState("23:00");
  const [selectedDateFin, setSelectedDateFin] = useState("07:00");
  const [heure, setHeure] = useState(props.heures);
  const [minute, setMinute] = useState(props.minutes);
  const [sommeil, setSommeil] = useState(props.sommeil);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setHeure(props.heures);
  }, [props.heures])

  useEffect(() => {
    setMinute(props.minutes);
  }, [props.minutes])

  useEffect(() => {
    setSommeil(props.sommeil);
  }, [props.sommeil])

  const handleChangeHeure = event => {
    const activitiesHeure = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.sommeil.heure = activitiesHeure;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setHeure(activitiesHeure);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleChangeMinute = event => {
    const activitiesMinute = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.sommeil.minute = activitiesMinute;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setMinute(activitiesMinute);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  return (
    <div>
      <IonItem className="divTitre7">

        <IonAvatar slot="start">
          <img src="/assets/Sommeil3.png" alt="" />
        </IonAvatar>
        <IonLabel><b className="text-white">Sommeil</b></IonLabel>

        <div>
          <span className="input-sommeil"><b>8 heures</b></span>
        </div>

        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => setIsOpen(!isOpen)} />


      </IonItem>

      {isOpen &&
        <IonItem className="bg-sommeil" >

          <IonGrid>

            {/* ROW 1 */}
            <IonRow className="ion-text-center">

              {/* ENDORMI À */}
              <IonCol size="6">
                <IonRow>
                  <IonCol size="12">
                    <IonLabel><b className="text-white">Endormi à</b></IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonDatetime className="input-sommeil" displayFormat="HH:mm" value={selectedDateDebut} onIonChange={e => setSelectedDateDebut(e.detail.value)}></IonDatetime>
                  </IonCol>
                </IonRow>
              </IonCol>

              {/* Éveillé À */}
              <IonCol size="6">
                <IonRow>
                  <IonCol size="12">
                    <IonLabel><b className="text-white">Éveillé à</b></IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonDatetime className="input-sommeil" displayFormat="HH:mm" value={selectedDateFin} onIonChange={e => setSelectedDateFin(e.detail.value)}></IonDatetime>
                  </IonCol>
                </IonRow>
              </IonCol>

            </IonRow>

            {/* ROW 2 */}
            <IonRow className="text-white ion-justify-content-center ion-align-items-center">

              <span>
                <IonLabel>Je me suis réveillé</IonLabel>
              </span>
              <IonInput style={{ maxWidth: "40px", color: "black" }} className='input-sommeil ion-text-center ion-margin' type="number" value={0} onIonChange={() => console.log("INPUT")}></IonInput>
              <span>fois.</span>

            </IonRow>

            <IonRow>

              {/* Select */}
              <IonCol size="8">
                <IonSelect style={{minWidth:"100%"}} className="input-sommeil" value={null} placeholder="État d'esprit au réveil" onIonChange={() => console.log("SELECT")}>
                  <IonSelectOption value="repose">Reposé</IonSelectOption>
                  <IonSelectOption value="heureux">Heureux</IonSelectOption>
                  <IonSelectOption value="fatigue">Fatigué</IonSelectOption>
                  <IonSelectOption value="colere">En Colère</IonSelectOption>
                </IonSelect>
              </IonCol>

              <IonCol className="ion-align-items-center ion-text-center">
                <IonButton className="btn-rounded" onClick={() => console.log("SAVE")}><b>SAVE</b></IonButton>
              </IonCol>

            </IonRow>

          </IonGrid>

        </IonItem>
      }

    </div>
  );
}
export default Sommeil;