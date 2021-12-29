import React, { useState, useEffect } from "react";
import firebase from "firebase";
import * as poidsService from "../../Poids/configuration/poidsService"
import * as translate from "../../../translate/Translator";

import {
  IonInput,
  IonText,
  IonButton,
  IonGrid,
  IonContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar,
  IonCol,
  IonRow,
  IonItemDivider,
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
    !divElt.style.display || divElt.style.display === "none"
      ? (divElt.style.display = "block")
      : (divElt.style.display = "none");
  }
};

const Poids = (props) => {
  const [unitePoids, setUnitePoids] = useState("KG");
  const [currentDate, setCurrentDate] = useState({ startDate: new Date() });
  var [dailyPoids, setDailyPoids] = useState(props.poids.dailyPoids);
  const [poids, setPoids] = useState(props.poids);
  var [taille, setTaille] = useState("");

  useEffect(() => {
    setDailyPoids(props.poids.dailyPoids);
  }, [props.poids.dailyPoids]);

  useEffect(() => {
    setPoids(props.poids);
  }, [props.poids]);

  useEffect(() => {
    poidsService.initPrefPoids()
    const userUID = localStorage.getItem("userUid");
    let preferencesPoidsRef = firebase
      .database()
      .ref("profiles/" + userUID + "/preferencesPoids");
    preferencesPoidsRef.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setUnitePoids(snapshot.val().unitePoids);
        if (snapshot.val().unitePoids == "LBS") {
          props.poids.dailyPoids = props.poids.dailyPoids * 2.2;
        }
      }
    });
    // setUnitePoids(poidsService.getPrefUnitePoids())
    var taille = firebase.database().ref("profiles/" + userUID);
    taille.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setTaille(snapshot.val().size);
      }
    });
  }, []);

  const handleUnitePoidsChange = (e) => {
    let value = e.detail.value;
    poidsService.setPrefUnitePoids(value)
    let OldUnitePoids = unitePoids;
    setUnitePoids(value);
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

    if (OldUnitePoids == "KG" && value == "LBS") {
      dashboard.poids.dailyPoids = (dashboard.poids.dailyPoids * 2.2).toFixed(
        2
      );
      setDailyPoids((dailyPoids * 2.2).toFixed(2));
    } else if (OldUnitePoids == "LBS" && value == "KG") {
      dashboard.poids.dailyPoids = (dashboard.poids.dailyPoids / 2.2).toFixed(
        2
      );
      setDailyPoids((dailyPoids / 2.2).toFixed(2));
    }
    localStorage.setItem("dashboard", JSON.stringify(dashboard));
    CalculImc();
  };

  const handleChange = (event) => {
    let dailyPoids = event.target.value;

    const dashboard = JSON.parse(localStorage.getItem("dashboard"));
    const prefUnitePoids = localStorage.getItem('prefUnitePoids');

    dashboard.poids.dailyPoids = poidsService.formatToKG(dailyPoids);
    dashboard.poids.datePoids = new Date();
    localStorage.setItem("dashboard", JSON.stringify(dashboard));
    setDailyPoids(dailyPoids);
    if (unitePoids == "LBS") {
      dashboard.poids.dailyPoids = (dailyPoids / 2.2).toFixed(2);
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
  var CalculImc = () => {
    taille = taille / 100;
    var p = dailyPoids;
    var IMC;
    if (unitePoids == "LBS") {
      p = (p / 2.2).toFixed(2);
      IMC = p / (taille * taille);
    } else {
      IMC = dailyPoids / (taille * taille);
    }
    return IMC.toFixed(2);
  };
  const IMC = CalculImc();

  const handleRouteToConfigurationPoids = () => {
    window.location.href = "/configurationPoids";
  };

  return (
    <div>
      <IonItem className="divTitre9" lines="none">
        <IonAvatar slot="start" onClick={handleRouteToConfigurationPoids}>
          <img src="/assets/Poids.jpg" alt="" />
        </IonAvatar>{" "}
        <IonLabel classeName="titrePoids" style={{ width: 60 }}>
          <h2 color="warning">
            <b>Poids</b>
          </h2>
        </IonLabel>
        <div className="titreImc">
          <IonLabel>
            <h2 style={{ marginLeft: 10 }} className="IMC">
              <b>IMC</b>
            </h2>
          </IonLabel>
          <IonInput
            value={IMC}
            type="number"
            className="IMC"
            readonly
          ></IonInput>
        </div>
        <IonInput
          className="poidsActuelReadOnly"
          type="number"
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
