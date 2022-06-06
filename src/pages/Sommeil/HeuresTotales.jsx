import { IonRow, IonText } from "@ionic/react";
import React from "react";
import "./Sommeil.css";

function HeuresTotales() {
  return (
    <IonRow>
      <IonText className="heuresTotales">
        Heures totales de sommeil : 00 H
      </IonText>
    </IonRow>
  );
}

export default HeuresTotales;
