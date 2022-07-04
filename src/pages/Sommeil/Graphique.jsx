import {
  IonButton,
  IonButtons,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import { arrowDropleft, arrowDropright, calendar } from "ionicons/icons";
import React, { useState } from "react";
import * as translate from "../../translate/Translator";

function Graphique() {
  const [cible, setCible] = useState("00:00");

  return (
    <IonGrid>
      <IonRow className="graphButtons">
        <IonRow>
          <IonButtons>
            <IonButton>
              <IonIcon icon={arrowDropleft}></IonIcon>
            </IonButton>
            <IonButton>
              <IonIcon icon={arrowDropright}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonRow>
        <IonButton fill="clear">
          <IonIcon icon={calendar}></IonIcon>
        </IonButton>
        <IonText className="graphCible">
          {translate.getText("TARGET")} | {cible}
        </IonText>
      </IonRow>

      <IonRow className="graph">
        <IonText></IonText>
      </IonRow>

      <div class="hr-modal-title-back">
        <div class="hr-modal-title-front"></div>
      </div>

      <IonRow className="graphButtons">
        <IonButton color="medium" shape="round" size="small">
          {translate.getText("WEIGHT_WEEK")}
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          {translate.getText("WEIGHT_MONTH")}
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          {translate.getText("WEIGHT_QUARTER")}
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          {translate.getText("WEIGHT_SEMESTER")}
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          {translate.getText("WEIGHT_YEAR")}
        </IonButton>
      </IonRow>
    </IonGrid>
  );
}

export default Graphique;
