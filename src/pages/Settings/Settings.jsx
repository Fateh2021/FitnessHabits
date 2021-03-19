import * as firebase from 'firebase'
import React, {useState, useEffect}  from 'react';
import { IonList,IonTabBar, IonGrid, IonTabButton, IonRow, IonCol, IonHeader, IonIcon,
         IonLabel,IonFooter, IonContent, IonPage, IonAlert, IonItem, IonAvatar, } from '@ionic/react';
import { save, home, arrowDropleftCircle, arrowDropdownCircle, globe} from 'ionicons/icons';
import Hydratation from './ItemsList/Hydratation'
import BoissonAlcool from './ItemsList/BoissonAlcool' 
import NourriGras from './ItemsList/Nourriture/NourriGras' 
import NourriLegumes from './ItemsList/Nourriture/NourriLegumes'
import NourriProteines from './ItemsList/Nourriture/NourriProteines'
import NourriCereales from './ItemsList/Nourriture/NourriCereales'
import Supplements from './ItemsList/Supplements'
import DefaultSettings from './DefaultSettings'

import '../Tab1.css';

const Settings =(props) =>{

 //Open items Div
 const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
  }
 }

  const [showAlert6, setShowAlert6] = useState(false);
  const [settings, setSettings] = useState({
    hydratation: {
      dailyTarget:{
        value:0,
        unit:''
      },
      hydrates:DefaultSettings.hydrates
    },

    alcool: {
      dailyTarget:{
        value:0,
        unit:''
      },
      limitConsom: {
        notifications: false,
        educAlcool: true,
        weeklyTarget: 0,
        dailyTarget: 0,
        sobrietyDays: 7,
        notificationMessage: "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite |. C'est juste un rappel..."
      },
      alcools:DefaultSettings.alcools
    },

      gras: {
        dailyTarget:{
          value:0,
          unit:''
        },
        gras:DefaultSettings.gras
      },

      proteines: {
        dailyTarget:{
          value:0,
          unit:''
        },
        proteines:DefaultSettings.proteines
      },

      legumes: {
        dailyTarget:{
          value:0,
          unit:''
        },
        legumes:DefaultSettings.legumes
      },

      cereales: {
        dailyTarget:{
          value:0,
          unit:''
        },
        cereales:DefaultSettings.cereales
      },
  });

  // load the current settings from the local storage if it exists, otherwise load it from the DB
    useEffect(() => {
      const localSettings = localStorage['settings'];
      if (localSettings) {
        const sets = addMissingSettings(JSON.parse(localSettings));
        localStorage.setItem('settings', JSON.stringify(sets));
        setSettings(JSON.parse(localSettings));
        //console.log("Loading Settings From localStorage..."+localStorage.getItem('settings'));
        console.log("Loading Settings From localStorage 1st time..."+JSON.stringify(settings.gras));
      } else {
          const userUID = localStorage.getItem('userUid');
          console.log("Loading Settings From DB...");
          firebase.database().ref('settings/'+userUID)
          .once("value", (snapshot) => {
            const sets = snapshot.val();
            console.log("settings ::"+JSON.stringify(sets));
            if (sets) {
              if(!(sets.hydratation.hydrates)){
                sets.hydratation.hydrates = [];
              }
              if(!(sets.alcool.alcools)){
                sets.alcool.alcools=[]
              }
              const updatedSets = addMissingSettings(sets);
              localStorage.setItem('settings', JSON.stringify(updatedSets));
              setSettings(updatedSets);
            } else {
              localStorage.setItem('settings', JSON.stringify(settings));
            }              
          });
      }
  }, []);

  const addMissingSettings = (settings) => {
    if (!settings.hydratation) {
      settings.hydratation = {
        dailyTarget:{
          value:0,
          unit:''
        },
        hydrates:DefaultSettings.hydrates
      };
    }

    if (!settings.alcool) {
      settings.alcool = {
        dailyTarget:{
          value:0,
          unit:''
        },
        limitConsom : {
          notifications: false,
          educAlcool: true,
          weeklyTarget: 0,
          dailyTarget: 0,
          sobrietyDays: 7,
          notificationMessage: "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite |. C'est juste un rappel..."
        },
        alcools:DefaultSettings.alcools
      };
    }

    if (!settings.gras) {
        settings.gras = {
          dailyTarget:{
            value:0,
            unit:''
          },
          gras:DefaultSettings.gras     
        };

      }

      if (!settings.proteines) {
        settings.proteines = {
          dailyTarget:{
            value:0,
            unit:''
          },
          proteines:DefaultSettings.proteines     
        };

      }

      if (!settings.legumes) {
        settings.legumes = {
          dailyTarget:{
            value:0,
            unit:''
          },
          legumes:DefaultSettings.legumes    
        };

      }

      if (!settings.cereales) {
        settings.cereales = {
          dailyTarget:{
            value:0,
            unit:''
          },
          cereales:DefaultSettings.cereales   
        };

      }

    return settings;
  }

  return (      
    <IonPage>
      <IonHeader>
        <IonTabBar slot="bottom" color="light">
          <IonTabButton tab="" href="/dashboard">
            <IonIcon className="arrowDashItem" icon={arrowDropleftCircle}/>
          </IonTabButton>   
          <IonTabButton tab="menu" href="/sidbar">
            <IonLabel className="headerTitle">Paramètres</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" >
            <IonIcon className="targetProfil " icon={globe}/>
          </IonTabButton>  
        </IonTabBar>           
      </IonHeader>

      <IonContent>
        <IonGrid >
          <IonRow className="">
            <IonCol ></IonCol>                      
            <IonCol size="4">
              <img src="/assets/Logo.png" alt="" />
            </IonCol>
            <IonCol ></IonCol>
          </IonRow>
        </IonGrid>               
        <IonList>       
        <Hydratation hydratation={settings.hydratation}/>
        <div>
          <IonItem className="divTitre2">
            <IonAvatar slot="start"><img src="/assets/nutrition.jpg" alt=""/></IonAvatar>
            <IonLabel><h2><b>Nourriture</b></h2></IonLabel>
            <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
          </IonItem>
          
          <div id="myDIV22">
            <IonList id = "listNourriture">
            <NourriGras gras = {settings.gras}/>
            <NourriProteines proteines = {settings.proteines}/>
            <NourriLegumes legumes = {settings.legumes}/> 
            <NourriCereales cereales = {settings.cereales}/>
            </IonList>
          </div>
          
        </div>
        <Supplements/>  
        <BoissonAlcool alcool={settings.alcool}/>         
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
          <IonTabButton>
          </IonTabButton>
          <IonTabButton onClick={() => setShowAlert6(true)} tab="tab1">
            <IonIcon color="warning" className="save" icon={save}/>
            <IonLabel className="text"><h3>Exporter</h3></IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </IonPage>   
  ); 
}
export default Settings;