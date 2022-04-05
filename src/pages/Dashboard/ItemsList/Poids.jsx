import React, { useState, useEffect } from "react";
import firebase from "firebase";
import * as poidsService from "../../Poids/configuration/poidsService"
import * as translate from "../../../translate/Translator";
import { IonInput, IonIcon, IonLabel, IonItem, IonAvatar } from "@ionic/react";
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

// Variables in Firebase remains in French for now with a translation in comment

const Poids = (props) => {
  // Ajout de cette variable dans le but de vérifier quel était la préférence d'affichage du poids.
  var prefWeight = localStorage.getItem("prefUnitePoids");
  const [unitWeight, setUnitWeight] = useState(prefWeight);
  const [currentDate, ] = useState({ startDate: new Date() });
  var [dailyWeight, setDailyWeight] = useState(props.poids.dailyPoids);
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
  const userUID = localStorage.getItem("userUid");

  useEffect(() => {
    var tmp = 0;
    if (prefWeight == "LBS") {
      tmp = props.poids.dailyPoids * 2.2;
    } else {
      tmp = props.poids.dailyPoids;
    }

    setDailyWeight(parseFloat(tmp).toFixed(1));
  }, [props.poids.dailyPoids]);

  useEffect(() => {
    poidsService.initPrefWeight();
    let preferencesPoidsRef = firebase.database().ref("profiles/" + userUID + "/preferencesPoids");
    preferencesPoidsRef.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setUnitWeight(snapshot.val().unitePoids);
      }
    });

    var size_from_BD = firebase.database().ref("profiles/" + userUID);
    size_from_BD.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setSize(snapshot.val().size);
      }
    });

    setBMI(poidsService.calculation_BMI(size, poidsService.formatToKG(dailyWeight)));
  });

	// Capture of the vent if the weight preference unit changes
  const handleUnitWeightChange = (event) => {
    let newUnitWeight = event.target.value;
    poidsService.setPrefUnitWeight(newUnitWeight);
    let oldUnitWeight = unitWeight;
    setUnitWeight(newUnitWeight);

    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    var weightAdjust = 0;
    if (oldUnitWeight === "KG" && newUnitWeight === "LBS") {
      weightAdjust = dashboard.poids.dailyPoids * 2.2;
    } else {
      weightAdjust = dashboard.poids.dailyPoids;
    }
		// Then we reduce to one decimal point but using parseFloat to use toFixed
    setDailyWeight(parseFloat(weightAdjust).toFixed(1));
  };

	// Capture de l'éventement si le dailyPoids change
  const handleChange = (event) => {
    let new_dailyWeight = event.detail.value;
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

		dashboard.poids.dailyPoids = poidsService.formatToKG(new_dailyWeight);
    dashboard.poids.datePoids = new Date();
    localStorage.setItem("dashboard", JSON.stringify(dashboard));

		setDailyWeight(new_dailyWeight);
		// On utilise directement la valeur qu'on a sauvé dans le localstorage du dashboard
		setBMI(poidsService.calculation_BMI(size, dashboard.poids.dailyPoids));

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

  // Capture de l'éventement si IMC change
  const handleBMIChange = (event) => {
    let BMI_Change = event.target.value;
    /* Pour éviter d'avoir des alerts pendant le changement du poids. Exemple 90 pourrait être remplacer pour 85,
       mais pour y arriver, il faut retirer la valeur et saisir 8 et 5 pour 85. Comme c'est plus que 10,
       il fait appel à la fonction afin de valider si l'IMC a changé de catégorie.
    */
    if (BMI_Change > 10) {
      poidsService.check_BMI_change(BMI_Change);
    }
  }

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
	        <b>{translate.getText("WEIGHT_NAME_SECTION")}</b>
          </h2>
        </IonLabel>
        <div className="titreImc">
          <IonLabel>
            <h2 className="IMC" style={{ marginLeft: 13 }}>
              <b>{translate.getText("WEIGHT_BMI_ACRONYM")}</b>
            </h2>
          </IonLabel>
          <IonInput
            value={BMI == "Infinity" ? "" : BMI}
            data-testid = "IMC_value" 
            className="IMC"
            aria-label="imc"
            readonly
            onIonChange={handleBMIChange}  
            
          ></IonInput>
        </div>
          <IonInput
            data-testid = "poids_input"  
            className="input poidsActuel"
            value={dailyWeight}
            onIonChange={handleChange}
            aria-label="weight"
            title="Daily weight"
          ></IonInput>

        <select data-testid = "select" className="input" value={unitWeight} onChange={handleUnitWeightChange} >
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