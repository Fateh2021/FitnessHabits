import * as firebase from 'firebase'
import React, {useState, useEffect}  from 'react';
import { IonList,IonTabBar, IonGrid, IonTabButton, IonRow, IonCol, IonHeader, IonIcon,
         IonLabel,IonFooter, IonContent, IonPage, IonAlert, IonItem, IonAvatar, IonRadioGroup, IonRadio, IonListHeader, } from '@ionic/react';
import { save, home, arrowDropleftCircle, arrowDropdownCircle, globe, funnel } from 'ionicons/icons';
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
  const [showAlert7, setShowAlert7] = useState(false);
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
      notifications :{
        active: false
      },
      limitConsom: {
        educAlcool: true,
        weeklyTarget: 0,
        dailyTarget: 0,
        sobrietyDays: 7,
        notificationMessage: "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite. C'est juste un rappel..."
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
  
  //Variable indiquant quel mode d'exportation a été sélectionner
  // #TODO : Construire un énum dédié
  // 0 => PDF
  // 1 => CSV
  // 2 => PDF et CSV
  var exportMode = 0
  
  //Variable indiquant quels données l'utilisateur souhaite exporter
  // #TODO : Rendre la liste adaptative en récupérant ces infos avec le profil utilisateur
  var dataSelected = ["hydratation", "alcool", "nourriture", "glycémie", "poids", "toilettes", "sommeil", "activities"]

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
        notifications :{
          active: false
        },
        limitConsom : {
          educAlcool: true,
          weeklyTarget: 0,
          dailyTarget: 0,
          sobrietyDays: 7,
          notificationMessage: "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite. C'est juste un rappel..."
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
          <IonTabButton tab="settings" href="/languages">
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
              name: 'radio0',
              type: 'radio',
              label: 'PDF',
              value: 'value0',
              checked: true,
              handler: () => {
                exportMode = 0;
                console.log("Mode sélectionné 0");
              }
            },
            {
              name: 'radio1',
              type: 'radio',
              label: 'CSV',
              value: 'value1',
              handler: () => {
                exportMode = 1;
                console.log("Mode sélectionné 1");
              }
            },
            {
              name: 'radio2',
              type: 'radio',
              label: 'PDF et CSV',
              value: 'value2',
              handler: () => {
                exportMode = 2;
                console.log("Mode sélectionné 2");
              }
            }
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
        <IonAlert
        isOpen={showAlert7}
        onDidDismiss={() => setShowAlert7(false)}
        cssClass='my-custom-class'
        header={'Sélection les types de données à exporter'}
        inputs={[
          {
            name: 'check1',
            type: 'checkbox',
            label: 'Activités physiques',
            value: 'value5',
            checked: dataSelected.includes("activities"),
            handler: () => {
              const index = dataSelected.indexOf("activities");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("activities");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check2',
            type: 'checkbox',
            label: 'Nourriture',
            value: 'value6',
            checked: dataSelected.includes("nourriture"),
            handler: () => {
              const index = dataSelected.indexOf("nourriture");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("nourriture");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check3',
            type: 'checkbox',
            label: 'Hydratation',
            value: 'value7',
            checked: dataSelected.includes("hydratation"),
            handler: () => {
              const index = dataSelected.indexOf("hydratation");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("hydratation");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check4',
            type: 'checkbox',
            label: 'Suppléments',
            value: 'value8',
            checked: dataSelected.includes("supplements"),
            handler: () => {
              const index = dataSelected.indexOf("supplements");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("supplements");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check5',
            type: 'checkbox',
            label: 'Sommeil',
            value: 'value9',
            checked: dataSelected.includes("sommeil"),
            handler: () => {
              const index = dataSelected.indexOf("sommeil");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("sommeil");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check6',
            type: 'checkbox',
            label: 'Poids',
            value: 'value10',
            checked: dataSelected.includes("poids"),
            handler: () => {
              const index = dataSelected.indexOf("poids");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("poids");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check7',
            type: 'checkbox',
            label: 'Glycémie',
            value: 'value11',
            checked: dataSelected.includes("glycémie"),
            handler: () => {
              const index = dataSelected.indexOf("glycémie");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("glycémie");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check8',
            type: 'checkbox',
            label: 'Alcool',
            value: 'value12',
            checked: dataSelected.includes("alcool"),
            handler: () => {
              const index = dataSelected.indexOf("alcool");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("alcool");
              }
              console.log(dataSelected)
            }
          },
          {
            name: 'check9',
            type: 'checkbox',
            label: 'Toilettes',
            value: 'value13',
            checked: dataSelected.includes("toilettes"),
            handler: () => {
              const index = dataSelected.indexOf("toilettes");
              if (index > -1) {
                dataSelected.splice(index, 1);
              } else {
                dataSelected.push("toilettes");
              }
              console.log(dataSelected)
            }
          }
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
              dataSelected.forEach(data => {
                console.log(data);
              });
              //console.log(JSON.parse(localStorage).getItem('dashboard'))[data];
              console.log('Confirm Ok');
              setShowAlert6(true);
            }
          }
        ]}
        />
        <IonTabBar slot="bottom" color="light">
          <IonTabButton tab="" href="/dashboard">
            <IonIcon color="warning" className="target" icon={home}/>
            <IonLabel className="text"><h3>Home</h3></IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab1" href="/export">
            <IonIcon color="warning" className="save" icon={save}/>
            <IonLabel className="text"><h3>Exporter</h3></IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </IonPage>   
  ); 
  
}
export default Settings;