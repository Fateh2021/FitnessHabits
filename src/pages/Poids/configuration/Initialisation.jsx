import React, { useState } from 'react';
import { IonSelectOption, IonSelect, IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonGrid, IonCol } from '@ionic/react';

const InitialisationPoids = (props) => {
  const [poidsInitial, setPoidsInitial] = useState("10");
  const [poidsCible, setPoidsCible] = useState("10");
  const [unite, setUnite] = useState("KG");

  return (
    <>
      <IonCard>
        <IonCardContent>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Paramètre</IonLabel>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Unité</IonLabel>
              {/* <IonSelect slot="end" value={unite} placeholder="Select One" onIonChange={e => setUnite(e.target.value)}>
                <IonSelectOption value="female">KG</IonSelectOption>
                <IonSelectOption value="male">LB</IonSelectOption>
              </IonSelect> */}
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
    </>
  )
}

export default InitialisationPoids;
