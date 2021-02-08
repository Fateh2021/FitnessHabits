import React, {useState, useEffect} from "react"
import * as firebase from 'firebase'
import { IonContent, IonList, IonPage, IonTabBar, IonIcon, IonTabButton, IonLabel, IonFooter, IonAlert}  from '@ionic/react';
import {home, settings, save} from 'ionicons/icons';
import Profil from './Profil/Profil';
import DateTime from '../Time/DateTime';
import Hydratation from './ItemsList/Hydratation';
import Nourriture from './ItemsList/Nourriture';
import Glycemie from './ItemsList/Glycemie'
import Supplements from "./ItemsList/Supplements";
import Toilettes from "./ItemsList/Toilettes";
import Activities from "./ItemsList/Activities";
import Sommeil from "./ItemsList/Sommeil";
import Alcool from "./ItemsList/Alcool";
import Poids from "./ItemsList/Poids"
import DefaultDashboard from './DefaultDashboard'

import '../Tab1.css';

const Dashboard = () => {

 //Open items Div
 const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
  }
 }

  const [showAlert6, setShowAlert6] = useState(false);
  const [dashboard, setDashboard] = useState({
    hydratation: {
      dailyTarget:{
        value:0,
        unit:''
      },
      hydrates:DefaultDashboard.hydrates
    },

  });

  //load the current settings from the local storage if it exists, otherwise load it from the DB
    useEffect(() => {
      const localDashboard = localStorage['dashboard'];
      if (localDashboard) {
      //  const sets = addMissingDashboard(JSON.parse(localDashboard));
        localStorage.setItem('dashboard', JSON.stringify(dashboard));
        setDashboard(JSON.parse(localDashboard));
        console.log("Loading Dashboard From localStorage 1st time..."+JSON.stringify(dashboard));
      } else {
          const userUID = localStorage.getItem('userUid');
          console.log("Loading Dashboard From DB...");
          firebase.database().ref('dashboard/'+userUID)
          .once("value", (snapshot) => {
              const sets = snapshot.val();
              console.log("dashboard ::"+JSON.stringify(sets));
              if (sets) {
                //const updatedSets = addMissingDashboard(sets);
                localStorage.setItem('dashboard', JSON.stringify(dashboard));
                setDashboard(dashboard);
                console.log("DB else ::::::::::::::"+JSON.stringify(dashboard));
              } else {
                localStorage.setItem('dashboard', JSON.stringify(dashboard));
                console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
              }              
          });
      }
  }, []);

  const addMissingDashboard = (dashboard) => {
    if (!dashboard.hydratation) {
      dashboard.hydratation = {
        dailyTarget:{
          value:0,
          unit:''
        },
        hydrates:DefaultDashboard.hydrates
      };
    }
  }

  return (
    <IonPage>            
      <Profil> </Profil>        
      <IonContent >
        <div className="datePickerPage" >   
          <DateTime/> 
        </div> 
        <IonList>
          <Hydratation hydratation={dashboard.hydratation}/> 
          <Nourriture/> 
          <Supplements/> 
          <Glycemie/>
          <Toilettes/>
          <Activities/> 
          <Sommeil/> 
          <Alcool/> 
          <Poids/> 
        </IonList>      
      </IonContent>

      <IonFooter>
          <IonAlert
            isOpen={showAlert6}
            onDidDismiss={() => setShowAlert6(false)}
            cssClass='my-custom-class'
            header={'Confirmez le format des données à exporter'}
            inputs={[
              {
                name: 'checkbox1',
                type: 'checkbox',
                label: 'PDF',
                value: 'value1',
                checked: true
              },
              {
                name: 'checkbox2',
                type: 'checkbox',
                label: 'CSV',
                value: 'value2'
              },
            ]}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  console.log('Confirm Ok');
                }
              }
            ]}
          />
          <IonTabBar slot="bottom" color="light">
            <IonTabButton tab="" href="/dashboard">
              <IonIcon color="warning" className="target" icon={home}/>
              <IonLabel className="text"><h3>Home</h3></IonLabel>
            </IonTabButton>
            <IonTabButton onClick={() => setShowAlert6(true)} tab="tab1">
              <IonIcon color="warning" className="save" icon={save}/>
              <IonLabel className="text"><h3>Exporter</h3></IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/settings">
              <IonIcon color="warning" className="target" icon={settings}/>
              <IonLabel className="text"><h3>Cibler</h3></IonLabel>
            </IonTabButton>
          </IonTabBar>
      </IonFooter>
    </IonPage>
  
  );
}
export default Dashboard;