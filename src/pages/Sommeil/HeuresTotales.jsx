import { IonRow, IonText } from "@ionic/react";
import React, { useState } from "react";
import "./Sommeil.css";
import * as translate from "../../translate/Translator";

function HeuresTotales() {
  const [heuresTotales, setHeuresTotales] = useState(0);

  return (
    <IonRow>
      <IonText className="heuresTotales">
        {translate.getText("TOTAL_SLEEP")} : {heuresTotales}
      </IonText>
    </IonRow>
  );
}

export default HeuresTotales;
