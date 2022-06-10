import { IonRow, IonText } from "@ionic/react";
import React, { useState } from "react";
import "./Sommeil.css";

function HeuresTotales() {
  const [heuresTotales, setHeuresTotales] = useState(0);

  return (
    <IonRow>
      <IonText className="heuresTotales">
        Heures totales de sommeil : {heuresTotales} H
      </IonText>
    </IonRow>
  );
}

export default HeuresTotales;
