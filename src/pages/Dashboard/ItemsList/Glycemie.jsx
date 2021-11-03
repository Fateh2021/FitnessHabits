import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { IonInput, IonLabel, IonItem, IonAvatar, IonRow, IonIcon, IonCol } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';

import '../../../pages/Tab1.css';
import Graphe from "../../GrapheGlycemie/graphe";

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

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block" : divElt.style.display = "none";
    }
  }

  const [reloadGraph, setReloadGraph] = useState(false)

  return (
    <div>
      <IonItem className="divTitre4" >
        <IonAvatar slot="start">
          <img src="/assets/Gly.jpg" alt="" />
        </IonAvatar>
        <IonLabel>
          <h2><b>Glycémie</b></h2>
        </IonLabel>
        <IonInput className='inputTextGly' type="number" value={dailyGlycemie} onIonChange={handleChange}></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => {accor("myDIVGlycemie"); setReloadGraph(true)}} />
      </IonItem>
      <div id="myDIVGlycemie" style={{ display: 'none'}}>
        <IonItem >
          <Graphe reloadGraph={reloadGraph}/>
        </IonItem>
      </div>
    </div>
  );
}
export default Glycemie;