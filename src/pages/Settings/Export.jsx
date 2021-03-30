import * as firebase from 'firebase'
import React, { useState, useEffect } from 'react';
import {
  IonList, IonTabBar, IonGrid, IonTabButton, IonRow, IonCol, IonHeader, IonIcon,
  IonLabel, IonFooter, IonContent, IonPage, IonAlert, IonItem, IonAvatar, IonRadioGroup, IonRadio, IonListHeader, IonCheckbox, IonItemDivider, IonButton
} from '@ionic/react';
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

const Settings = (props) => {

  //Open items Div
  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block" : divElt.style.display = "none";
    }
  }

  const [showAlert6, setShowAlert6] = useState(false);
  const [showAlert7, setShowAlert7] = useState(false);

  const [checked, setChecked] = useState(false);

  const [settings, setSettings] = useState({
    hydratation: {
      dailyTarget: {
        value: 0,
        unit: ''
      },
      hydrates: DefaultSettings.hydrates
    },

    alcool: {
      dailyTarget: {
        value: 0,
        unit: ''
      },
      alcools: DefaultSettings.alcools
    },

    gras: {
      dailyTarget: {
        value: 0,
        unit: ''
      },
      gras: DefaultSettings.gras
    },

    proteines: {
      dailyTarget: {
        value: 0,
        unit: ''
      },
      proteines: DefaultSettings.proteines
    },

    legumes: {
      dailyTarget: {
        value: 0,
        unit: ''
      },
      legumes: DefaultSettings.legumes
    },

    cereales: {
      dailyTarget: {
        value: 0,
        unit: ''
      },
      cereales: DefaultSettings.cereales
    },
  });

  //Variable indiquant quel mode d'exportation a été sélectionner
  // #TODO : Construire un énum dédié
  // "pdf" => PDF
  // "csv" => CSV
  // "hybride" => PDF et CSV
  var exportMode = "pdf"

  //Variable indiquant quels données l'utilisateur souhaite exporter
  // #TODO : Rendre la liste adaptative en récupérant ces infos avec le profil utilisateur
  var dataSelected = ["hydratation", "alcool", "supplements", "nourriture", "glycémie", "poids", "toilettes", "sommeil", "activities"]

  const [selected, setSelected] = useState('csv');

  // load the current settings from the local storage if it exists, otherwise load it from the DB
  useEffect(() => {
    const localSettings = localStorage['settings'];
    if (localSettings) {
      const sets = addMissingSettings(JSON.parse(localSettings));
      localStorage.setItem('settings', JSON.stringify(sets));
      setSettings(JSON.parse(localSettings));
      //console.log("Loading Settings From localStorage..."+localStorage.getItem('settings'));
      console.log("Loading Settings From localStorage 1st time..." + JSON.stringify(settings.gras));
    } else {
      const userUID = localStorage.getItem('userUid');
      console.log("Loading Settings From DB...");
      firebase.database().ref('settings/' + userUID)
        .once("value", (snapshot) => {
          const sets = snapshot.val();
          console.log("settings ::" + JSON.stringify(sets));
          if (sets) {
            if (!(sets.hydratation.hydrates)) {
              sets.hydratation.hydrates = [];
            }
            if (!(sets.alcool.alcools)) {
              sets.alcool.alcools = []
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
        dailyTarget: {
          value: 0,
          unit: ''
        },
        hydrates: DefaultSettings.hydrates
      };
    }

    if (!settings.alcool) {
      settings.alcool = {
        dailyTarget: {
          value: 0,
          unit: ''
        },
        alcools: DefaultSettings.alcools
      };
    }

    if (!settings.gras) {
      settings.gras = {
        dailyTarget: {
          value: 0,
          unit: ''
        },
        gras: DefaultSettings.gras
      };

    }

    if (!settings.proteines) {
      settings.proteines = {
        dailyTarget: {
          value: 0,
          unit: ''
        },
        proteines: DefaultSettings.proteines
      };

    }

    if (!settings.legumes) {
      settings.legumes = {
        dailyTarget: {
          value: 0,
          unit: ''
        },
        legumes: DefaultSettings.legumes
      };

    }

    if (!settings.cereales) {
      settings.cereales = {
        dailyTarget: {
          value: 0,
          unit: ''
        },
        cereales: DefaultSettings.cereales
      };

    }

    return settings;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonTabBar slot="bottom" color="light">
          <IonTabButton tab="" href="/dashboard">
            <IonIcon className="arrowDashItem" icon={arrowDropleftCircle} />
          </IonTabButton>
          <IonTabButton tab="menu" href="/sidbar">
            <IonLabel className="headerTitle">Exportation</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" >
            <IonIcon className="targetProfil " icon={globe} />
          </IonTabButton>
        </IonTabBar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItemDivider>Sélection des données à exporter</IonItemDivider>
          <IonItem>
            <IonLabel>Activités physiques</IonLabel>
            <IonCheckbox checked={dataSelected.includes("activities")} onIonChange={
              e => {
                const index = dataSelected.indexOf("activities");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("activities");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Nourriture</IonLabel>
            <IonCheckbox checked={dataSelected.includes("nourriture")} onIonChange={
              e => {
                const index = dataSelected.indexOf("nourriture");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("nourriture");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Hydratation</IonLabel>
            <IonCheckbox checked={dataSelected.includes("hydratation")} onIonChange={
              e => {
                const index = dataSelected.indexOf("hydratation");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("hydratation");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Suppléments</IonLabel>
            <IonCheckbox checked={dataSelected.includes("supplements")} onIonChange={
              e => {
                const index = dataSelected.indexOf("supplements");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("supplements");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Sommeil</IonLabel>
            <IonCheckbox checked={dataSelected.includes("sommeil")} onIonChange={
              e => {
                const index = dataSelected.indexOf("sommeil");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("sommeil");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Poids</IonLabel>
            <IonCheckbox checked={dataSelected.includes("poids")} onIonChange={
              e => {
                const index = dataSelected.indexOf("poids");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("poids");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Glycémie</IonLabel>
            <IonCheckbox checked={dataSelected.includes("glycémie")} onIonChange={
              e => {
                const index = dataSelected.indexOf("glycémie");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("glycémie");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Alcool</IonLabel>
            <IonCheckbox checked={dataSelected.includes("alcool")} onIonChange={
              e => {
                const index = dataSelected.indexOf("alcool");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("alcool");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>
          <IonItem>
            <IonLabel>Toilettes</IonLabel>
            <IonCheckbox checked={dataSelected.includes("toilettes")} onIonChange={
              e => {
                const index = dataSelected.indexOf("toilettes");
                if (index > -1) {
                  dataSelected.splice(index, 1);
                } else {
                  dataSelected.push("toilettes");
                }
                console.log(dataSelected)
              }
            } />
          </IonItem>

          <IonRadioGroup value={selected} onIonChange={e => {
            setSelected(e.detail.value)
            exportMode = e.detail.value
            console.log(exportMode)
          }
          }>
            <IonListHeader>
              <IonLabel>Format exportation</IonLabel>
            </IonListHeader>

            <IonItem>
              <IonLabel>CSV</IonLabel>
              <IonRadio slot="start" value="csv" />
            </IonItem>

            <IonItem>
              <IonLabel>PDF</IonLabel>
              <IonRadio slot="start" value="pdf" />
            </IonItem>

            <IonItem>
              <IonLabel>CSV et PDF</IonLabel>
              <IonRadio slot="start" value="hybride" />
            </IonItem>
          </IonRadioGroup>

        </IonList>

        <IonButton expand="block" onClick={() => {
          //#TODO : Ajouter la fonction gérant la création de fichier et envoi
          const userUID = localStorage.getItem('userUid');


          var bilan = compilerBilanPDF(dataSelected);

          console.log(bilan);
          
          console.log("Demande d'exporation");
        }
        }>Exporter</IonButton>

      </IonContent>

      <IonFooter>
        <IonTabBar slot="bottom" color="light">
          <IonTabButton tab="" href="/dashboard">
            <IonIcon color="warning" className="target" icon={home} />
            <IonLabel className="text"><h3>Home</h3></IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </IonPage>
  );

  function recupererHydratation() {
    var retour = "Hydratation: \n";
    var hydratation = JSON.parse(localStorage.getItem('dashboard')).hydratation.hydrates;
    hydratation.forEach(data => {
      //console.log( data.name);
      retour = retour + " " + data.name + ": " + data.qtte + " " + data.unit + "\n";
    });
    return retour;

  }

  function recupererAlcools() {
    var retour = "Alcool: \n";
    var alcool = JSON.parse(localStorage.getItem('dashboard')).alcool.alcools;
    alcool.forEach(data => {
      //console.log( data.name);
      retour = retour + " " + data.name + ": " + data.qtte + " " + data.unit + "\n";
    });
    return retour;

  }

  function recupererActivite() {
    var retour = "Activites: \n";
    var activite = JSON.parse(localStorage.getItem('dashboard')).activities;

    retour = retour + " " + activite.heure + "h " + activite.minute + " min\n";

    return retour;
  }

  function recupererNourriture() {
    var retour = "Nourriture: \n";
    var nourriture = JSON.parse(localStorage.getItem('dashboard')).nourriture;
    if (nourriture.globalConsumption == "0") {
      return retour + " NO DATA FOUND IN NOURRITURE \n";
    } else {
      return nourriture.globalConsumption;
    }
  }

  function recupererSommeil() {
    var retour = "Sommeil: \n";
    var sommeil = JSON.parse(localStorage.getItem('dashboard')).sommeil;

    retour = retour + " " + sommeil.heure + "h " + sommeil.minute + " min\n";

    return retour;
  }

  function recupererToilettes() {
    var retour = "Toilettes: \n";
    var toilettes = JSON.parse(localStorage.getItem('dashboard')).toilettes;

    retour = retour + " Feces: " + toilettes.feces + "\n Urine: " + toilettes.urine + "\n";

    return retour;
  }

  function recupererGlycemie() {
    var retour = "Glycemie: \n";
    var glycemie = JSON.parse(localStorage.getItem('dashboard')).glycemie.dailyGlycemie;

    retour = retour + glycemie + "\n";

    return retour;
  }

  function recupererPoids() {
    var retour = "Poids: \n";
    var poids = JSON.parse(localStorage.getItem('dashboard')).poids.dailyPoids;

    retour = retour + poids + "\n";

    return retour;

  }

  function recupererSupplements() {
    var retour = "Supplements: \n";
    var supplement = JSON.parse(localStorage.getItem('dashboard')).supplement;
    if (supplement == undefined) {
      retour = retour + "Les supplements ne sont pas encore implémentés\n"
    } else {
      retour = retour + supplement + "\n";
    }

    return retour;

  }

  function compilerBilanPDF(dataSelected) {
    
    var date = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    })
    var retour = "BILAN PDF en date du " + date +  "\n \n";
    dataSelected.forEach(data => {
      switch (data) {
        case "hydratation":
          var hydratation = recupererHydratation();
          retour = retour + hydratation + "\n";
          break;
        case "activities":
          var activite = recupererActivite();
          retour = retour + activite + "\n";
          break;
        case "nourriture":
          var nourriture = recupererNourriture();
          retour = retour + nourriture + "\n";
          break;
        case "sommeil":
          var sommeil = recupererSommeil();
          retour = retour + sommeil + "\n";
          break;
        case "toilettes":
          var toilettes = recupererToilettes();
          retour = retour + toilettes + "\n";
          break;
        case "alcool":
          var alcool = recupererAlcools();
          retour = retour + alcool + "\n";
          break;
        case "glycémie":
          var glycemie = recupererGlycemie();
          retour = retour + glycemie + "\n";
          break;
        case "poids":
          var poids = recupererPoids();
          retour = retour + poids + "\n";
          break;
        case "supplements":
          var supplements = recupererSupplements();
          retour = retour + supplements + "\n";
          break;

        default:
          break;
      }
    });

    return retour;
  }

}
export default Settings;