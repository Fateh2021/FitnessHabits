import {
  IonButton,
  IonCol,
  IonDatetime,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import "./Sommeil.css";
import { add } from "ionicons/icons";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

function AjoutPeriodeForm() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [startDate, setStartDate] = useState(yesterday);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState("");
  const [nbAwoken, setNbAwoken] = useState(0);
  const [mood, setMood] = useState("");

  let addPeriod = () => {
    let doc = {
      startDate: startDate.toISOString(),
      startTime: startTime,
      endDate: endDate.toISOString(),
      endTime: endTime,
      mood: mood,
      nbAwoken: nbAwoken,
    };
    console.log(doc);
    db.push(doc);
  };

  return (
    <form className="page">
      <IonGrid>
        <IonItem className="ajout-item">
          <IonCol>
            <IonLabel className="ajout-label-nbrFois">Endormi le</IonLabel>
            <IonDatetime
              presentation="date"
              value={startDate.toDateString()}
              onIonChange={(e) => setStartDate(new Date(e.target.value))}
            ></IonDatetime>
          </IonCol>
          <IonCol></IonCol>
          <IonCol>
            <IonLabel className="ajout-label-nbrFois">Endormi à</IonLabel>
            <IonInput
              value={startTime}
              onIonChange={(e) => setStartTime(e.target.value)}
              type="time"
            ></IonInput>
          </IonCol>
        </IonItem>
        <IonItem className="ajout-item">
          <IonCol>
            <IonLabel className="ajout-label-nbrFois">Réveillé le</IonLabel>
            <IonDatetime
              presentation="date"
              value={endDate.toDateString()}
              onIonChange={(e) => setEndDate(new Date(e.target.value))}
            ></IonDatetime>
          </IonCol>
          <IonCol></IonCol>
          <IonCol>
            <IonLabel className="ajout-label-nbrFois">Réveillé à</IonLabel>
            <IonInput
              value={endTime}
              onIonChange={(e) => setEndTime(e.target.value)}
              type="time"
            ></IonInput>
          </IonCol>
        </IonItem>
        <IonItem className="ajout-item">
          <IonCol>
            <IonLabel className="ajout-label-nbrFois">
              Durant cette période,
              <br /> je me suis réveillé
            </IonLabel>
          </IonCol>
          <IonCol>
            <IonInput
              value={nbAwoken}
              onIonChange={(e) => setNbAwoken(e.target.value)}
              min="0"
              type="number"
            ></IonInput>
          </IonCol>
          <IonCol>
            <IonLabel>fois</IonLabel>
          </IonCol>
        </IonItem>
        <IonItem className="ajout-item">
          <IonLabel className="ajout-label-nbrFois">
            État d'esprit au réveil
          </IonLabel>
          <IonSelect
            value={mood}
            onIonChange={(e) => setMood(e.target.value)}
            placeholder="État d'esprit"
          >
            <IonSelectOption value="HAPPY">Heureux</IonSelectOption>
            <IonSelectOption value="ANGRY">En colère</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonRow className="ion-justify-content-center">
          <IonButton
            className="bouton-ajouter"
            color="primary"
            shape="round"
            onClick={() => addPeriod()}
          >
            Ajouter
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </IonRow>
      </IonGrid>
    </form>
  );
}

export default AjoutPeriodeForm;
