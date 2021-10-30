import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { IonInput, IonLabel, IonItem, IonAvatar } from '@ionic/react';

import '../../../pages/Tab1.css';

const Glycemie = (props) => {

  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
  const [dailyGlycemie, setDailyGlycemie] = useState(props.glycemie.dailyGlycemie);
  const [glycemie, setGlycemie] = useState(props.glycemie);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyGlycemie(props.glycemie.dailyGlycemie);
  }, [props.glycemie.dailyGlycemie])

  useEffect(() => {
    setGlycemie(props.glycemie);
  }, [props.glycemie])

  const handleChange = event => {
    const dailGly = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.glycemie.dailyGlycemie = dailGly;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setDailyGlycemie(dailGly);
    const userUID = localStorage.getItem('userUid');
    var date = currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear();
    firebase.database().ref('dashboard/' + userUID + "/" + date).update(dashboard);
  }

  return (
    <div>
      <IonItem className="divTitre4" >
        <IonAvatar slot="start">
          <img src="/assets/Gly.jpg" alt="" />
        </IonAvatar>
        <a href="/grapheGlycemie">
          <IonLabel>
            <h2><b>Glycémie</b></h2>
          </IonLabel>
        </a>
        <IonInput className='inputTextGly' type="number" value={dailyGlycemie} onIonChange={handleChange}></IonInput>
      </IonItem>
    </div>
  );
}
export default Glycemie;