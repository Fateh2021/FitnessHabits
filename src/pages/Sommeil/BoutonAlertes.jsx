import { IonButton, IonIcon, IonRow, IonText } from "@ionic/react";
import { notifications } from "ionicons/icons";
import React from "react";
import "./Sommeil.css";

function BoutonAlertes() {
  return (
    <IonRow className="notificationRow">
      <IonText>Paramétrer les alertes: </IonText>
      <IonButton color="medium" shape="circle">
        <IonIcon slot="icon-only" icon={notifications}></IonIcon>
      </IonButton>
    </IonRow>
  );
}

export default BoutonAlertes;
