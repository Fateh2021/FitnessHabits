import { IonButton, IonIcon, IonRow } from "@ionic/react";
import React from "react";
import { add } from "ionicons/icons";

function BoutonsBas() {
  return (
    <IonRow class="boutonsBas">
      <IonButton color="primary" shape="round">
        Ajouter
        <IonIcon icon={add}></IonIcon>
      </IonButton>
      <IonButton color="medium" shape="round">
        Voir toute la liste
      </IonButton>
    </IonRow>
  );
}

export default BoutonsBas;
