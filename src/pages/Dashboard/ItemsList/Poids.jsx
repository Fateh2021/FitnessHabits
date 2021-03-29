import React, { useState, useEffect } from "react"
import * as firebase from 'firebase'
import { IonInput, IonLabel, IonItem, IonAvatar, IonIcon } from '@ionic/react';

import '../../../pages/Tab1.css';

const Poids = (props) => {

  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
  const [dailyPoids, setDailyPoids] = useState(props.poids.dailyPoids);
  const [poids, setPoids] = useState(props.poids);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyPoids(props.poids.dailyPoids);
  }, [props.poids.dailyPoids])

  useEffect(() => {
    setPoids(props.poids);
  }, [props.poids])

  const handleChange = event => {
    const dailPoids = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.poids.dailyPoids = dailPoids;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setDailyPoids(dailPoids);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleRouteToConfigurationPoids = () => {
    console.log(window.location.href);
    window.location.href = '/configurationPoids';
  }

  return (
    <div>
      <IonItem className="divTitre9">
        <IonAvatar slot="start" onClick={handleRouteToConfigurationPoids}>
          <img src="/assets/Poids.jpg" alt="" />
        </IonAvatar>
        <IonLabel><h2 color="warinig"><b>Poids</b></h2></IonLabel>
        <IonInput className='inputTextGly' type="number" value={dailyPoids} onIonChange={handleChange}> </IonInput>
        <IonIcon className="arrowDashItem" />
      </IonItem>
    </div>
  );
}
export default Poids;
