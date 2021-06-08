import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { arrowDropleftCircle, arrowDroprightCircle, arrowDropdownCircle, settings} from 'ionicons/icons';
import {
  IonContent, IonList, IonPage, IonTabBar, IonIcon, IonTabButton, IonLabel, IonFooter,
  IonGrid, IonCol, IonRow, IonAlert, IonItem, IonAvatar, IonInput
} from '@ionic/react';
import Profil from './Profil/Profil';
import NourrGras from './ItemsList/Nourriture/NourrGras'
import NourriProteines from './ItemsList/Nourriture/NourriProteines'
import NourriLegumes from './ItemsList/Nourriture/NourriLegumes'
import NourrCereales from './ItemsList/Nourriture/NourrCereales'

import Hydratation from './ItemsList/Hydratation';
import Glycemie from './ItemsList/Glycemie'
import Supplements from "./ItemsList/Supplements";
import Toilettes from "./ItemsList/Toilettes";
import Activities from "./ItemsList/Activities";
import Sommeil from "./ItemsList/Sommeil";
import Alcool from "./ItemsList/Alcool";
import Poids from "./ItemsList/Poids"
import DefaultDashboard from './DefaultDashboard'
import FormatDate from '../../DateUtils'

import '../Tab1.css';
import Home from "../Footer/Home";
import Export from "../Footer/Export";

const Dashboard = (props) => {
const [nourriture, setNourriture] = useState(0);
const [gras, setGras] = useState(0);
const [proteines, setProteines] = useState(0);
const [legumes, setLegumes] = useState(0);
const [cereales, setLCereales] = useState(0);
const [showAlert6, setShowAlert6] = useState(false);
const [toDay, setToDaye] = useState({startDate: new Date()});
const [currentDate, setCurrentDate] = useState({startDate: new Date()});
const [formatedCurrentDate, setFormatedCurrentDate] = useState("");
const [localday, setLocalday] = useState({startDate: new Date().toLocaleDateString("fr-FR", {
  year: "numeric",
  month: "numeric",
  day: "numeric"
})});

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block" : divElt.style.display = "none";
    }
  }

  const sidebarCloseHandler = () => {
    FormatDate(currentDate.startDate).then(dt => {
      setFormatedCurrentDate(dt);
    });
  }

  const [dashboard, setDashboard] = useState({
    hydratation: {
      dailyTarget: {
        value: 0,
        unit: '',
        globalConsumption: 0,
      },
      hydrates: DefaultDashboard.hydrates
    },
    alcool: {
      dailyTarget: {
        value: 0,
        unit: '',
        globalConsumption: 0,
      },
      alcools: DefaultDashboard.alcools
    },
    nourriture: {
      globalConsumption: 0,
    },
    gras: {
      dailyTarget: {
        value: 0,
        unit: '',
        globalConsumption: 0
      },
      grass: DefaultDashboard.gras
    },
    proteines: {
      dailyTarget: {
        value: 0,
        unit: '',
        globalConsumption: 0
      },
      proteines: DefaultDashboard.proteines
    },
    legumes: {
      dailyTarget: {
        value: 0,
        unit: '',
        globalConsumption: 0
      },
      legumes: DefaultDashboard.legumes
    },
    cereales: {
      dailyTarget: {
        value: 0,
        unit: '',
        globalConsumption: 0
      },
      cereales: DefaultDashboard.cereales
    },
    glycemie: {
      dailyGlycemie: 0,
    },
    poids: {
      dailyPoids: 0,
    },
    toilettes: {
      feces: 0,
      urine: 0
    },
    sommeil: {
      heure: 0,
      minute: 0
    },
    activities: {
      heure: 0,
      minute: 0
    },
  });

  const addMissingDashboard = (dashboard) => {
    if (!dashboard.hydratation) {
      dashboard.hydratation = {
        dailyTarget: {
          value: 0,
          unit: '',
          globalConsumption: 0,
        },
        hydrates: DefaultDashboard.hydrates
      }
    }
    if (!dashboard.alcool) {
      dashboard.alcool = {
        dailyTarget: {
          value: 0,
          unit: '',
          globalConsumption: 0,
        },
        alcools: DefaultDashboard.alcools
      }
    }
    if (!dashboard.nourriture) {
      dashboard.nourriture = {
        globalConsumption: 0
      }
    }
    if (!dashboard.gras) {
      dashboard.gras = {
        dailyTarget: {
          value: 0,
          unit: '',
          globalConsumption: 0
        },
        grass: DefaultDashboard.gras
      };
    }
    if (!dashboard.proteines) {
      dashboard.proteines = {
        dailyTarget: {
          value: 0,
          unit: '',
          globalConsumption: 0
        },
        proteines: DefaultDashboard.proteines
      };
    }
    if (!dashboard.legumes) {
      dashboard.legumes = {
        dailyTarget: {
          value: 0,
          unit: '',
          globalConsumption: 0
        },
        legumes: DefaultDashboard.legumes
      };
    }
    if (!dashboard.cereales) {
      dashboard.cereales = {
        dailyTarget: {
          value: 0,
          unit: '',
          globalConsumption: 0
        },
        cereales: DefaultDashboard.cereales
      };
    }

    if (!dashboard.glycemie) {
      dashboard.glycemie = {
        dailyGlycemie: 0,
      }
    }
    if (!dashboard.poids) {
      dashboard.poids = {
        dailyPoids: 0,
      }
    }
    if (!dashboard.toilettes) {
      dashboard.toilettes = {
        feces: 0,
        urine: 0
      }
    }
    if (!dashboard.sommeil) {
      dashboard.sommeil = {
        heure: 0,
        minute: 0
      }
    }
    if (!dashboard.activities) {
      dashboard.activities = {
        heure: 0,
        minute: 0
      }
    }
    return dashboard;
  }

  //load the current settings from the local storage if it exists, otherwise load it from the DB
  // useEffect(() => {
  //   const localDashboard = localStorage['dashboard'];
  //   console.log("Loading Dashboard test..." + JSON.stringify(dashboard));
  //   FormatDate(currentDate.startDate).then(dt => {
  //     setFormatedCurrentDate(dt);
  //   });
  //   if (localDashboard) {
  //     const sets = addMissingDashboard(JSON.parse(localDashboard));
  //     localStorage.setItem('dashboard', JSON.stringify(sets));
  //     setDashboard(JSON.parse(localDashboard));
  //     console.log("Loading Dashboard From localStorage 1st time..." + JSON.stringify(dashboard));
  //   } else {
  //     const userUID = localStorage.getItem('userUid');
  //     console.log("Loading Dashboard From DB...");
  //     firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear())
  //       .once("value", (snapshot) => {
  //         const sets = snapshot.val();
  //         console.log("sets::" + JSON.stringify(sets));
  //         if (sets) {
  //           if (!(sets.hydratation.hydrates)) {
  //             sets.hydratation.hydrates = [];
  //           }
  //           if (!(sets.alcool.alcools)) {
  //             sets.alcool.alcools = []
  //           }
  //           const updatedSets = addMissingDashboard(sets);
  //           localStorage.setItem('dashboard', JSON.stringify(updatedSets));
  //           setDashboard(updatedSets);
  //           console.log("DB if ::::::::::::::" + JSON.stringify(dashboard));
  //         } else {
  //           localStorage.setItem('dashboard', JSON.stringify(dashboard));
  //           console.log("DB else ::::::::::::::" + JSON.stringify(localStorage));
  //         }
  //       });

  //     }
  //     const userUID = localStorage.getItem('userUid');
  //     firebase.database().ref('language/' + userUID).once('value', (snapshot) => {
  //         const data = snapshot.val();
  //         if (data) {
  //           const language = data["langue"];
  //           if (language) {
  //             localStorage.setItem("userLanguage", language);
  //           }
  //         }
  //     });  

  // }, []);

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
          if(!(sets.gras.grass)){
            sets.gras.grass=[]
          }
          if(!(sets.proteines.proteines)){
            sets.proteines.proteines=[]
          }
          if(!(sets.legumes.legumes)){
            sets.legumes.legumes=[]
          }
          if(!(sets.cereales.cereales)){
            sets.cereales.cereales=[]
          }
          // if(!(sets.nourriture.globalConsumption)){
          //   sets.nourriture.globalConsumption=0
          // }
          //  if(!(sets.nourriture.globalConsumption)){
          // sets.nourriture.globalConsumption=sets.gras.dailyTarget.globalConsumption + sets.proteines.dailyTarget.globalConsumption
          // + sets.legumes.dailyTarget.globalConsumption + sets.cereales.dailyTarget.globalConsumption;
          // }
          // if(!(sets.gras.dailyTarget.globalConsumption)){
          //   sets.gras.dailyTarget.globalConsumption=0
          // }
          // if(!(sets.proteines.dailyGlycemie.globalConsumption)){
          //   sets.proteines.dailyGlycemie.globalConsumption=[]
          // }
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
  }, []);

  const NourritureUpdate = () =>{
    const userUID = localStorage.getItem('userUid');
    console.log("Loading Dashboard From DB...");
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
    .once("value", (snapshot) => {
      const sets = snapshot.val();
      if (sets){
        if(!(sets.hydratation.hydrates)){
          sets.hydratation.hydrates = [];
        }
        if(!(sets.alcool.alcools)){
          sets.alcool.alcools=[]
        }
        if(!(sets.gras.grass)){
          sets.gras.grass=[]
        }
        if(!(sets.proteines.proteines)){
          sets.proteines.proteines=[]
        }
        if(!(sets.legumes.legumes)){
          sets.legumes.legumes=[]
        }
        if(!(sets.cereales.cereales)){
          sets.cereales.cereales=[]
        }

        sets.nourriture.globalConsumption = sets.gras.dailyTarget.globalConsumption + sets.proteines.dailyTarget.globalConsumption
        + sets.legumes.dailyTarget.globalConsumption + sets.cereales.dailyTarget.globalConsumption;        
        const updatedSets = addMissingDashboard(sets);
        localStorage.setItem('dashboard', JSON.stringify(updatedSets));
        setDashboard(updatedSets);
        console.log("sa marche::" + sets.nourriture.globalConsumption);  
        firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(sets) 
      }else {
        // const localDashboard = localStorage['dashboard'];
        localStorage.setItem('dashboard', JSON.stringify(dashboard));
        console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
        console.log("sa marche pas::");  
      }
    })
  };
  
  const parentCallbackGras = (childData) => {  
    setGras(childData);
    NourritureUpdate();
  };

  const parentCallbackProteines = (childData) => {     
    setProteines(childData);
    NourritureUpdate();
  };

  const parentCallbackLegumes = (childData) => {  
    setLegumes(childData);
    NourritureUpdate();
  };

  const parentCallbackCereales = (childData) => {  
    setLCereales(childData);
    NourritureUpdate();
  };

  const nextDay = () => {
    const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() + 1);
    setCurrentDate({startDate: new Date(localDate)});
    setLocalday ({startDate:new Date (localDate)});
    console.log(currentDate.startDate)

      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
      .once("value", (snapshot) =>{ 
        const sets = snapshot.val();
        console.log("dataBase" + JSON.stringify (sets));
        if(!sets){
          console.log("!snapshot.val()")
          firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(
          {
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
          }
        )
        firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
        .once("value", (snapshot) =>{
          const set = snapshot.val();
          // const set = addMissingDashboard(JSON.parse(sets));
          //localStorage.setItem('dashboard', JSON.stringify(set));
          const updatedSets = addMissingDashboard(set);
          //localStorage.setItem('dashboard', JSON.stringify(updatedSets));
          setDashboard(updatedSets);        
        })  
        }
        else{
          console.log("snapshot.val()")

      if(!(sets.hydratation.hydrates)){
        sets.hydratation.hydrates = [];
      }
      if(!(sets.alcool.alcools)){
        sets.alcool.alcools=[]
      }
      if(!(sets.gras.grass)){
        sets.gras.grass=[]
      }
      if(!(sets.proteines.proteines)){
        sets.proteines.proteines=[]
      }
      if(!(sets.legumes.legumes)){
        sets.legumes.legumes=[]
      }
      if(!(sets.cereales.cereales)){
        sets.cereales.cereales=[]
      }
      const updatedSets = addMissingDashboard(sets);
      // localStorage.setItem('dashboard', JSON.stringify(updatedSets));
      setDashboard(updatedSets);
      console.log("Dashboard" + JSON.stringify(dashboard))
    }        
      })
  }

  const prevDay = () => {
    const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() - 1);
    setCurrentDate({startDate: new Date(localDate)});
    setLocalday ({startDate:new Date (localDate)});
    console.log(currentDate.startDate)

      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
      .once("value", (snapshot) =>{ 
        const sets = snapshot.val();
        console.log("dataBase" + JSON.stringify (sets));
        if(!sets){
          console.log("!snapshot.val()")
          firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(
          {
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
          }
        )
        firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
        .once("value", (snapshot) =>{
          const set = snapshot.val();
          // const set = addMissingDashboard(JSON.parse(sets));
          //localStorage.setItem('dashboard', JSON.stringify(set));
          
          const updatedSets = addMissingDashboard(set);
          //localStorage.setItem('dashboard', JSON.stringify(updatedSets));
          setDashboard(updatedSets);        
        })  
        }
        else{
          console.log("snapshot.val()")

      if(!(sets.hydratation.hydrates)){
        sets.hydratation.hydrates = [];
      }
      if(!(sets.alcool.alcools)){
        sets.alcool.alcools=[]
      }
      if(!(sets.gras.grass)){
        sets.gras.grass=[]
      }
      if(!(sets.proteines.proteines)){
        sets.proteines.proteines=[]
      }
      if(!(sets.legumes.legumes)){
        sets.legumes.legumes=[]
      }
      if(!(sets.cereales.cereales)){
        sets.cereales.cereales=[]
      }
      const updatedSets = addMissingDashboard(sets);
      // localStorage.setItem('dashboard', JSON.stringify(updatedSets));
      setDashboard(updatedSets);
      console.log("Dashboard" + JSON.stringify(dashboard))
    }        
      })
  }

  return (
    <IonPage>
      <Profil close={sidebarCloseHandler}> </Profil>
      <IonContent >
        <div className="datePickerPage" >
          <IonGrid>
            <IonRow>
              <IonCol size="2">
                <IonTabButton >
                  <IonIcon className="buttonTimeLeft" icon={arrowDropleftCircle} onClick={""} />
                </IonTabButton>
              </IonCol>
              <IonCol></IonCol>
              <IonCol style={{ textAlign: 'center' }}>
                <IonLabel className="datePicker">{formatedCurrentDate}</IonLabel>
              </IonCol>
              <IonCol></IonCol>
              <IonCol size="2">
                <IonTabButton>
                  <IonIcon className="buttonTimeRight" icon={arrowDroprightCircle} onClick={""} />
                </IonTabButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <IonList>
          <Hydratation
            hydrate={dashboard.hydratation} hydrates={dashboard.hydratation.hydrates}
            currentDate={currentDate} globalConsumption={dashboard.hydratation.dailyTarget.globalConsumption} />
          <div>
            <IonItem className="divTitre2">
              <IonAvatar slot="start"><img src="/assets/nutrition.jpg" alt=""/></IonAvatar>
              <IonLabel><h2><b>Nourriture</b></h2></IonLabel>
              <IonInput className='inputTextGly' readonly value={dashboard.nourriture.globalConsumption}></IonInput>
              <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
            </IonItem>            
          </div>

          <div id="myDIV22">
            <IonList id = "listNourriture">
            <NourrGras 
            parentCallbackGras = {parentCallbackGras.bind(this)} 
            gras={dashboard.gras} grass={dashboard.gras.grass} globalConsumption = {dashboard.gras.dailyTarget.globalConsumption} currentDate ={currentDate}/>
            <NourriProteines 
            parentCallbackProteines = {parentCallbackProteines.bind(this)}
            proteine={dashboard.proteines} proteines={dashboard.proteines.proteines} globalConsumption = {dashboard.proteines.dailyTarget.globalConsumption} currentDate ={currentDate}/>
            <NourriLegumes 
            parentCallbackLegumes = {parentCallbackLegumes.bind(this)}
            legume={dashboard.legumes} legumes={dashboard.legumes.legumes} globalConsumption = {dashboard.legumes.dailyTarget.globalConsumption} currentDate ={currentDate}/>
            <NourrCereales 
            parentCallbackCereales = {parentCallbackCereales.bind(this)}
            cereale={dashboard.cereales} cereales={dashboard.cereales.cereales} globalConsumption = {dashboard.cereales.dailyTarget.globalConsumption} currentDate ={currentDate}/>
            </IonList>
          </div>

          <Supplements />
          <Glycemie glycemie={dashboard.glycemie} currentDate={currentDate} />
          <Toilettes toilettes={dashboard.toilettes} currentDate={currentDate} />
          <Activities heures={dashboard.activities.heure} minutes={dashboard.activities.minute} currentDate={currentDate} sommeil={dashboard.activities} />
          <Sommeil heures={dashboard.sommeil.heure} minutes={dashboard.sommeil.minute} currentDate={currentDate} sommeil={dashboard.sommeil} />
          <Alcool alcool={dashboard.alcool} alcools={dashboard.alcool.alcools} globalConsumption={dashboard.alcool.dailyTarget.globalConsumption} currentDate={currentDate} />
          <Poids poids={dashboard.poids} currentDate={currentDate} />
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
            },
            {
              text: 'Ok',
              }
            ]}
          />
          
        <IonTabBar slot="bottom" color="light">
        <IonTabButton tab="tab1" href="/export">
           <Home />  
           </IonTabButton>   
           <IonTabButton tab="" href="/dashboard">
          <Export />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/settings">
            <IonIcon color="warning" className="target" icon={settings} />
            <IonLabel className="text"><h3>Cibler</h3></IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </IonPage>
  );
}
export default Dashboard;
