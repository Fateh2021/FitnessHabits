import { IonGrid, IonList } from "@ionic/react";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import ElementSommeil from "./ElementSommeil";
import "./Sommeil.css";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

function ListeSommeils() {
  const [elementsSommeil, setElementsSommeil] = useState([]);

  const getSleepPeriods = async () => {
    let sleepPeriods;
    await db.once("value").then((snapshot) => {
      sleepPeriods = snapshot.val();
    });

    if (sleepPeriods != null) {
      let elementsSommeilTmp = [];
      for (const [key, value] of Object.entries(sleepPeriods)) {
        elementsSommeilTmp.push(
          <ElementSommeil key={key} info={value}></ElementSommeil>
        );
      }
      setElementsSommeil(elementsSommeilTmp);
    }
  };

  useEffect(() => {
    getSleepPeriods();
  }, []);

  return <IonGrid class="list-modal">{elementsSommeil}</IonGrid>;
}

export default ListeSommeils;
