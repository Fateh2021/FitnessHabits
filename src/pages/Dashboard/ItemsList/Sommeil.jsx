import React, { useEffect, useState } from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';

import '../../Tab1.css';

const Sommeil = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
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
          <span className="text-white"><b>8 heures</b></span>
        </div>

        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => setIsOpen(!isOpen)} />


      </IonItem>

      {isOpen &&
        <IonItem className="bg-sommeil" >
          <IonRow>
            <IonCol size="12">
              <IonLabel><b className="text-white">Durée</b></IonLabel>
            </IonCol>
          </IonRow>
        </IonItem>
      }

    </div>
  );
}
export default Sommeil;