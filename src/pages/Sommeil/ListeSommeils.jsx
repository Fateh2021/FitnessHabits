import { IonGrid, IonList } from "@ionic/react";
import firebase from "firebase";
import React, { useEffect, useImperativeHandle, useState } from "react";
import ElementSommeil from "./ElementSommeil";
import "./Sommeil.css";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

const ListeSommeils = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refresh: () => {
      getSleepPeriods();
    },
  }));

  const [elementsSommeil, setElementsSommeil] = useState([]);

  const getSleepPeriods = async () => {
    let sleepPeriods;
    await db.once("value").then((snapshot) => {
      sleepPeriods = snapshot.val();
    });

    if (sleepPeriods != null) {
      let elementsSommeilTmp = [];
      let sleepPeriodsList = Object.entries(sleepPeriods).reverse();
      for (const [key, value] of sleepPeriodsList) {
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
});

export default ListeSommeils;
