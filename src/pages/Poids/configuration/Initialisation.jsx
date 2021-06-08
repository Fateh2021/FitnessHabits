import React, { useState } from 'react';
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent } from '@ionic/react';

const Initialisation = (props) => {
  const [poidsInitial, setPoidsInitial] = useState("10");
  const [poidsCible, setPoidsCible] = useState("10");

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Paramètre</IonLabel>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Unité</IonLabel>
              <IonButton class="dayButton" size="small" shape="round" >KG</IonButton>
              <IonButton class="dayButton" size="small" shape="round" >LBS</IonButton>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Poids initial</IonLabel>
              <IonInput slot="end" value={poidsInitial} onChange={e => setPoidsInitial(e.target.value)}></IonInput>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Poids ciblé</IonLabel>
              <IonInput slot="end" value={poidsCible} onChange={e => setPoidsCible(e.target.value)}></IonInput>
            </IonItemDivider>
          </IonItemGroup>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton shape="round" expand="block">REINITIALISER</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton shape="round" expand="block">CONFIRMER</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      </IonContent>
  )
}

export default Initialisation;
