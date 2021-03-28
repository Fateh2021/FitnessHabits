import React, {useState, useEffect} from "react"
import * as firebase from 'firebase'
import DatePicker from 'react-datepicker';
import { arrowDropleftCircle, arrowDroprightCircle, today, arrowDropdownCircle, } from 'ionicons/icons';
import { IonContent, IonList, IonPage, IonTabBar, IonIcon, IonTabButton, IonLabel, IonFooter, 
  IonGrid, IonCol, IonRow, IonAlert, IonItem, IonAvatar, IonInput}  from '@ionic/react';
import {home, settings, save} from 'ionicons/icons';
import Profil from './Profil/Profil';
import Hydratation from './ItemsList/Hydratation';
import Nourriture from './ItemsList/Nourriture/Nourriture';
import NourrGras from './ItemsList/Nourriture/NourrGras'
import NourrCereales from './ItemsList/Nourriture/NourrCereales'
import NourriLegumes from './ItemsList/Nourriture/NourriLegumes'
import NourriProteines from './ItemsList/Nourriture/NourriProteines'
import Glycemie from './ItemsList/Glycemie'
import Supplements from "./ItemsList/Supplements";
import Toilettes from "./ItemsList/Toilettes";
import Activities from "./ItemsList/Activities";
import Sommeil from "./ItemsList/Sommeil";
import Alcool from "./ItemsList/Alcool";
import Poids from "./ItemsList/Poids"
import DefaultDashboard from './DefaultDashboard'

import '../Tab1.css';

const Dashboard = (props) => {
  const [showAlert6, setShowAlert6] = useState(false);
  const [toDay, setToDaye] = useState({startDate: new Date()});
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});
  const [localday, setLocalday] = useState({startDate: new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  })});

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const [dashboard, setDashboard] = useState({
    hydratation: {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0,
        },
        hydrates:DefaultDashboard.hydrates
      },
      alcool: {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0,
        },
        alcools:DefaultDashboard.alcools
      },
      nourriture:{
        globalConsumption:0,
      },
      gras: {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        grass:DefaultDashboard.gras
      },
      proteines: {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        proteines:DefaultDashboard.proteines
      },
      legumes: {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        legumes:DefaultDashboard.legumes
      },
      cereales: {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        cereales:DefaultDashboard.cereales
      },
    glycemie : {
      dailyGlycemie:0,
    },
    poids : {
      dailyPoids:0,
    },
    toilettes : {
      feces:0,
      urine:0
    },
    sommeil : {
      heure:0,
      minute:0
    },
    activities : {
      heure:0,
      minute:0
    },
  });

  const addMissingDashboard = (dashboard) => {
    if (!dashboard.hydratation) {
      dashboard.hydratation = {
          dailyTarget:{
            value:0,
            unit:'',
            globalConsumption:0,
          },
          hydrates:DefaultDashboard.hydrates
        }       
    }
    if (!dashboard.alcool) {
      dashboard.alcool = {
          dailyTarget:{
            value:0,
            unit:'',
            globalConsumption:0,
          },
          alcools:DefaultDashboard.alcools
        }       
    }
    if (!dashboard.nourriture) {
      dashboard.nourriture = {
          globalConsumption:0
        }
    }
    if (!dashboard.gras) {
      dashboard.gras = {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        grass:DefaultDashboard.gras     
      };
    }
    if (!dashboard.proteines) {
      dashboard.proteines = {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        proteines:DefaultDashboard.proteines     
      };
    }
    if (!dashboard.legumes) {
      dashboard.legumes = {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        legumes:DefaultDashboard.legumes    
      };
    }
    if (!dashboard.cereales) {
      dashboard.cereales = {
        dailyTarget:{
          value:0,
          unit:'',
          globalConsumption:0
        },
        cereales:DefaultDashboard.cereales   
      };
    }

    if (! dashboard.glycemie) {
        dashboard.glycemie = {
          dailyGlycemie : 0,
        }
    }
    if (! dashboard.poids) {
      dashboard.poids = {
        dailyPoids : 0,
      }
    }
    if (!dashboard.toilettes){
      dashboard.toilettes = {
      feces:0,
      urine:0
      }
    } 
    if (!dashboard.sommeil){
      dashboard.sommeil = {
        heure:0,
        minute:0
      }
    }
    if (!dashboard.activities){
      dashboard.activities = {
        heure:0,
        minute:0
      }
    }
    return dashboard;
  }
 
  //load the current settings from the local storage if it exists, otherwise load it from the DB
    useEffect(() => {
      const localDashboard = localStorage['dashboard'];
      console.log("Loading Dashboard test..."+JSON.stringify(dashboard));
      if (localDashboard) {
        const sets = addMissingDashboard(JSON.parse(localDashboard));
        localStorage.setItem('dashboard', JSON.stringify(sets));
        setDashboard(JSON.parse(localDashboard));
        console.log("Loading Dashboard From localStorage 1st time..."+JSON.stringify(dashboard));
      } else {
        const userUID = localStorage.getItem('userUid');
        console.log("Loading Dashboard From DB...");
        firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
        .once("value", (snapshot) => {
          const sets = snapshot.val();
          console.log("sets::"+JSON.stringify(sets));
          if (sets) {
            if(!(sets.hydratation.hydrates)){
              sets.hydratation.hydrates = [];
            }
            if(!(sets.alcool.alcools)){
              sets.alcool.alcools=[]
            }
            const updatedSets = addMissingDashboard(sets);
            localStorage.setItem('dashboard', JSON.stringify(updatedSets));
            setDashboard(updatedSets);
            console.log("DB if ::::::::::::::"+JSON.stringify(dashboard));
          } else {
            localStorage.setItem('dashboard', JSON.stringify(dashboard));
            console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
          }              
        });
      }
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('settings/' + userUID).once('value', (snapshot) => {
          const data = snapshot.val();
          const language = data["langue"];
          if (language) {
            localStorage.setItem("userLanguage", language);
          }

      });  
  }, []);

  return (
    <IonPage>            
      <Profil> </Profil>        
      <IonContent >
        <div className="datePickerPage" >   
      <IonGrid>
        <IonRow>
          <IonCol size="2">
            <IonTabButton >
              <IonIcon className="buttonTimeLeft" icon={arrowDropleftCircle} onClick={""}/>
            </IonTabButton> 
          </IonCol>
          <IonCol></IonCol>
          <IonCol>
            <DatePicker className="datePicker"
              selected={ currentDate.startDate}
              dateFormat="MM-dd-yyyy"
              readOnly/> 
          </IonCol>
          <IonCol></IonCol>
          <IonCol size="2">
            <IonTabButton>
              <IonIcon  className="buttonTimeRight" icon={arrowDroprightCircle}  onClick={""}/>
            </IonTabButton>
          </IonCol>
        </IonRow>  
      </IonGrid> 
        </div> 
        <IonList>
          <Hydratation 
            hydrate={dashboard.hydratation} hydrates={dashboard.hydratation.hydrates} 
            currentDate ={currentDate} globalConsumption = {dashboard.hydratation.dailyTarget.globalConsumption}/> 
          <div>
            <IonItem className="divTitre2">
              <IonAvatar slot="start"><img src="/assets/nutrition.jpg" alt=""/></IonAvatar>
              <IonLabel><h2><b>Nourriture</b></h2></IonLabel>
              <IonInput className='inputTextGly' readonly value={""}></IonInput>
              <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
            </IonItem>            
          </div>

          <Supplements /> 
          <Glycemie glycemie = {dashboard.glycemie} currentDate ={currentDate}/>
          <Toilettes toilettes = {dashboard.toilettes} currentDate = {currentDate}/>
          <Activities heures={dashboard.activities.heure} minutes={dashboard.activities.minute} currentDate ={currentDate} sommeil={dashboard.activities}/> 
          <Sommeil heures={dashboard.sommeil.heure} minutes={dashboard.sommeil.minute} currentDate ={currentDate} sommeil={dashboard.sommeil}/> 
          <Alcool alcool={dashboard.alcool} alcools={dashboard.alcool.alcools} globalConsumption = {dashboard.alcool.dailyTarget.globalConsumption} currentDate ={currentDate}/> 
          <Poids poids = {dashboard.poids} currentDate ={currentDate}/> 
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
