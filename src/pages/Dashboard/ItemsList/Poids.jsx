import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { IonInput, IonText,IonButton,IonGrid, IonContent, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonRow, IonItemDivider} from '@ionic/react';
import {arrowDropdownCircle, star, trash, create,addCircle,removeCircle } from 'ionicons/icons';
import '../../../pages/Tab1.css';
import '../../../pages/poids.css';

const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
  }
}

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
        <IonInput className='poidsActuelReadOnly' type="number" value={dailyPoids} onIonChange={handleChange} readonly> </IonInput>
        <IonIcon className="arrowDashItem"  icon={arrowDropdownCircle} onClick={() => accor("accordeonPoids")}/>
      </IonItem>
      <div id="accordeonPoids" className="accordeonPoids">
          <IonItem lines="none" className="ionTableau">
            <IonGrid>
              <IonRow class="rowPoids">
                <IonCol className="poids-text-md">
                    <span><b>Poids actuel</b></span>  <span className="poids-text-sm">173 lbs</span>                   
                </IonCol>
                <IonCol className="poids-text-md">
                  <span><b>Date cible</b></span><span className="poids-text-sm" >2021-01-01</span> 
                </IonCol>
              </IonRow>
              <IonRow class="rowPoids">
                <IonCol className="poids-text-md">
                  <span><b>Poids cible</b></span> <span className="poids-text-sm">153 lbs</span>                   
                </IonCol>
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          
                {/* <IonItem className="divTitre11" key={123}>
                  <IonRow></IonRow>
                  <IonCol size="3">
                  <IonLabel className="nameDscripDashboard"><h2><b>{"test"}</b></h2></IonLabel>      
                  </IonCol>
                  <IonButton className="trashButton" color="danger" size="small">
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {dailyPoids} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small">
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small">
                    <IonIcon  icon={trash} />
                  </IonButton>
                </IonItem> */}
                
          
          
          {/* {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashAlcool) => saveItem(itemDashAlcool)}/>}    */}
        </div>        
    </div>    
  );
}
export default Poids;
