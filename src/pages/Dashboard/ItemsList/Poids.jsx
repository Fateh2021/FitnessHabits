import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import { IonInput, IonText,IonButton,IonGrid, IonContent, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonRow, IonItemDivider} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';
import '../../../pages/Tab1.css';
import '../../../pages/poids.css';
import TableauPoids from "../../Poids/configuration/TableauPoids"
import * as poidsService from "../../Poids/configuration/poidsService"


const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
  }
}

const Poids = (props) => {
  const [unitePoids, setUnitePoids] = useState("");
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});;
  const [dailyPoids, setDailyPoids] = useState(props.poids.dailyPoids);
  const [poids, setPoids] = useState(props.poids);

  useEffect(() => {
    setDailyPoids(props.poids.dailyPoids);
  }, [props.poids.dailyPoids])

  useEffect(() => {
    setPoids(props.poids);
  }, [props.poids])

  useEffect(() => {
    poidsService.initPrefPoids()
    setUnitePoids(poidsService.getDailyPoids)
    // const userUID = localStorage.getItem('userUid');
    // let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
    // preferencesPoidsRef.once("value").then(function(snapshot) {
    //     if (snapshot.val() != null) {
    //       setUnitePoids(snapshot.val().unitePoids);
    //       if (snapshot.val().unitePoids == "LBS") {
    //         props.poids.dailyPoids = props.poids.dailyPoids * 2.2
    //       }
    //     }
    //   })
  }, [])


  const handleChange = event => {
    let dailyPoids = event.target.value;

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.poids.dailyPoids = dailyPoids;
    dashboard.poids.datePoids = new Date()
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setDailyPoids(dailyPoids);

    if (unitePoids == "LBS") {
      dashboard.poids.dailyPoids = ((dailyPoids / 2.2).toFixed(2))
    }
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleRouteToConfigurationPoids = () => {
    window.location.href = '/configurationPoids';
  }

  return (
    <div style={{padding:0}}>
      <IonItem className="divTitre9" lines="none">
        <IonAvatar slot="start" onClick={handleRouteToConfigurationPoids}>
          <img src="/assets/Poids.jpg" alt="" />
        </IonAvatar>
        <IonLabel>
        <h2 color="warning"><b>Poids</b></h2>
        </IonLabel>
        <IonInput className='poidsActuelReadOnly' type="number" value={dailyPoids} onIonChange={handleChange}> </IonInput>
        <IonIcon className="arrowDashItem"  icon={arrowDropdownCircle} onClick={() => accor("accordeonPoids")}/>
      </IonItem>
      <div id="accordeonPoids" className="accordeonPoids">
          <TableauPoids ></TableauPoids>
        </div>        
    </div>    
  );
}
export default Poids;
