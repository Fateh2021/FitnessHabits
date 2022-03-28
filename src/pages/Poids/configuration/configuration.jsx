import React, { useState } from 'react';
import { IonCard, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import HeaderPoids from "./header";
import InitialisationPoids from "./Initialisation";
import * as translate from "../../../translate/Translator";

// nous avons nettoyer tous ce qui ne touchait pas la page initilisation,
// car la section configuration des notifications étaient tout simplement une coquille vide
// et ne servait à rien selon nos analyses.
const Configuration = (props) => {
  return (
    <ion-app>
      <HeaderPoids url="/dashboard" />
      <ion-content class="ion-padding" overflow-scroll="true">
        <ion-tabs>
          <ion-tab tab="Initialisation">
            <InitialisationPoids />
          </ion-tab>
        </ion-tabs>
      </ion-content>
    </ion-app>
  )
}

export default Configuration;
