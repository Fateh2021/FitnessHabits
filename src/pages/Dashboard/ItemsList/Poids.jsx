import React, { useState, useEffect } from "react";
import firebase from "firebase";
import * as poidsService from "../../Poids/configuration/poidsService"
import * as translate from "../../../translate/Translator";

import {
  IonInput,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { arrowDropdownCircle } from "ionicons/icons";
import "../../../pages/Tab1.css";
import "../../../pages/poids.css";
import TableauPoids from "../../Poids/configuration/TableauPoids";

const accor = (divId) => {
  const divElt = document.getElementById(divId);
  if (divElt) {
    divElt.style.display =  !divElt.style.display || divElt.style.display === "none"? "block": "none";
  }
};

const Poids = (props) => {
  // Ajout de cette variable dans le but de vérifier quel était la préférence d'affichage du poids.
  var prefPoids = localStorage.getItem("prefUnitePoids");
  const [unitePoids, setUnitePoids] = useState(prefPoids);
  const [currentDate, ] = useState({ startDate: new Date() });
  var [dailyPoids, setDailyPoids] = useState(props.poids.dailyPoids);
  var [taille, setTaille] = useState("");
  var [imc, setImc] = useState("");

  useEffect(() => {
    poidsService.initPrefPoids()
    const userUID = localStorage.getItem("userUid");
    let preferencesPoidsRef = firebase
      .database()
      .ref("profiles/" + userUID + "/preferencesPoids");
    preferencesPoidsRef.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setUnitePoids(snapshot.val().unitePoids);
      }
    });
    var taille_l = firebase.database().ref("profiles/" + userUID);
    taille_l.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setTaille(snapshot.val().size);
      }
    });

    var poids = firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear());
    poids.once("value").then(function(snapshot) {
      if(snapshot.val() != null) {
        setDailyPoids(snapshot.val().poids.dailyPoids);        
        CalculImc();
      }
    });

  }, []);

  const handleUnitePoidsChange = (e) => {
    let value = e.detail.value;
    poidsService.setPrefUnitePoids(value)
    let old_poids = unitePoids;
    let new_poids = 0;
    setUnitePoids(value);
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    if (old_poids === "KG" && value === "LBS") {      
      new_poids = poidsService.formatPoids(dashboard.poids.dailyPoids);
      setDailyPoids(new_poids);
    } else if (old_poids === "LBS" && value === "KG") {
      new_poids = poidsService.formatToKG(dashboard.poids.dailyPoids);
      setDailyPoids(new_poids);
    }

    localStorage.setItem("dashboard", JSON.stringify(dashboard));
    CalculImc();
  };

	// Capture de l'éventement si IMC change
  const handleIMCChange = (event) => {
    let change_IMC = event.target.value;
    /* Pour éviter d'avoir des alerts pendant le changement du poids. Exemple 90 pourrait être remplacer pour 85,
       mais pour y arriver, il faut retirer la valeur et saisir 8 et 5 pour 85. Comme c'est plus que 10,
       il fait appel à la fonction afin de valider si l'IMC a changé de catégorie.
    */
    if (change_IMC > 10) {
      poidsService.verifier_changement_IMC(change_IMC);
    }

  }

	// Capture de l'éventement si le dailyPoids change
  const handleChange = (event) => {
    let poidsDaily = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    dashboard.poids.dailyPoids = poidsDaily;
    dashboard.poids.datePoids = new Date();
    localStorage.setItem("dashboard", JSON.stringify(dashboard));

    setDailyPoids(poidsDaily);
    CalculImc();

    const userUID = localStorage.getItem("userUid");
    firebase
      .database()
      .ref(
        "dashboard/" +
          userUID +
          "/" +
          currentDate.startDate.getDate() +
          (currentDate.startDate.getMonth() + 1) +
          currentDate.startDate.getFullYear()
      )
      .update(dashboard);      
  };

  var CalculImc = () => {
    taille = taille / 100;
    var indicateur_IMC;

    if (unitePoids == "LBS") {
      indicateur_IMC = ((dailyPoids / 2.2).toFixed(2)) / (taille * taille);
    } else {
      indicateur_IMC = dailyPoids / (taille * taille);
    }

    var r_val = indicateur_IMC.toFixed(2);   
    setImc(r_val); 
    return r_val;
  };

  const handleRouteToConfigurationPoids = () => {
    window.location.href = "/configurationPoids";
  };

  return (
    <div>
      <IonItem className="divTitre9" lines="none">
        <IonAvatar class="icone" slot="start" onClick={handleRouteToConfigurationPoids}>
          <img src="/assets/Poids.jpg" alt="" />
        </IonAvatar>{" "}
        <IonLabel classeName="titrePoids" style={{ width: 60 }}>
          <h2 color="warning">
	        <b>{translate.getText("POIDS_NOM_SECTION")}</b>
          </h2>
        </IonLabel>
        <div className="titreImc">
          <IonLabel>
            <h2 className="IMC" style={{ marginLeft: 13 }}>
              <b>{translate.getText("POIDS_IMC_ACCRONIME")}</b>
            </h2>
          </IonLabel>
          <IonInput
            value={imc}
            type="number"
            className="IMC"
            readonly
            //onIonChange={handleIMCChange}              
          ></IonInput>
        </div>
        <IonInput
          className="poidsActuelReadOnly"
          value={dailyPoids}              
          onIonChange={handleChange}          
        ></IonInput>

        <IonSelect
          className="unitePoids"
          value={unitePoids}
          okText={translate.getText("POIDS_PREF_CHOISIR")}
          cancelText={translate.getText("POIDS_PREF_ANNULER")}
          onIonChange={handleUnitePoidsChange}
        >
          <IonSelectOption value="LBS">LBS</IonSelectOption>
          <IonSelectOption value="KG">KG</IonSelectOption>
        </IonSelect>
     
        <IonIcon
          className="arrowDashItem"
          icon={arrowDropdownCircle}
          onClick={() => accor("accordeonPoids")}
        />
      </IonItem>
      <div id="accordeonPoids" className="accordeonPoids">
        <TableauPoids></TableauPoids>
      </div>
    </div>
  );
};
export default Poids;
