import React, { useState, useEffect } from "react";
import firebase from "firebase";
import * as poidsService from "../../Poids/configuration/poidsService"
import * as translate from "../../../translate/Translator";

import {
  IonInput,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar
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

  useEffect(() => {
    setDailyPoids(prefPoids == 'LBS' ? props.poids.dailyPoids * 2.2 : props.poids.dailyPoids);
  }, [props.poids.dailyPoids]);

  useEffect(() => {
    poidsService.initPrefPoids();
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
  }, []);

	// Capture de l'éventement si unite de préférence du poids change
  const handleUnitePoidsChange = (event) => {
    let newUnitePoids = event.target.value;
    poidsService.setPrefUnitePoids(newUnitePoids);
    let oldUnitePoids = unitePoids;
    setUnitePoids(newUnitePoids);
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    if (oldUnitePoids === "KG" && newUnitePoids === "LBS") {
      dashboard.poids.dailyPoids = (dashboard.poids.dailyPoids * 2.2).toFixed(2);      
    }

    setDailyPoids(dashboard.poids.dailyPoids);
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

    dashboard.poids.dailyPoids = poidsService.formatToKG(poidsDaily);
    dashboard.poids.datePoids = new Date();
    localStorage.setItem("dashboard", JSON.stringify(dashboard));

    setDailyPoids(poidsDaily);
    if (unitePoids == "LBS") {
      dashboard.poids.dailyPoids = (poidsDaily / 2.2).toFixed(2);
    }

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

  // La fonction qui calcul IMC en fonction de la taille et le poids
  var CalculImc = () => {
    taille = taille / 100;
    var p = dailyPoids;

    //var IMC;
    var indicateur_IMC;
    if (unitePoids == "LBS") {

      p = (p / 2.2).toFixed(2);
      indicateur_IMC = p / (taille * taille);
    } else {
      indicateur_IMC = dailyPoids / (taille * taille);
    }
    return indicateur_IMC.toFixed(2);

  };

  // Récupération de la valeur IMC calculée à l'intérieur de la fonction
  var IMC = CalculImc();

  const handleRouteToConfigurationPoids = () => {
    window.location.href = "/configurationPoids";
  };

  return (
    <div>
      <IonItem className="divTitre9" lines="none">
        <IonAvatar class="icone" slot="start" onClick={handleRouteToConfigurationPoids}>
          <img data-testid = "img_sauter" src="/assets/Poids.jpg" alt="" />
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
            value={(IMC == Infinity? "": IMC)}
            data-testid = "IMC_value" 
            className="IMC"
            readonly
            onIonChange={handleIMCChange}  
            
          ></IonInput>
        </div>
          <IonInput
            data-testid = "poids_input"  
            className="input poidsActuel"
            value={dailyPoids}              
            onIonChange={handleChange}
            aria-label="weight"
            title="Daily weight"      
          ></IonInput>

        <select data-testid = "select" className="input" value={unitePoids} onChange={handleUnitePoidsChange} >
          <option value="LBS">LBS</option>
          <option value="KG">KG</option>
        </select>

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