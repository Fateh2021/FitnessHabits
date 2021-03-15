import React, { useState } from 'react';
// import { arrowDropleftCircle } from 'ionicons/icons';
import { IonItemGroup, IonItemDivider, IonTextarea, IonInput, IonRow, IonButton, IonHeader, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonTitle, IonGrid, IonCol } from '@ionic/react';
// import { calendar, personCircle, map, informationCircle } from 'ionicons/icons';

const ConfigurationPoids = (props) => {
  const [poidsInitial, setPoidsInitial] = useState("10");
  const [poidsCible, setPoidsCible] = useState("10");
  return (
    <ion-app>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>
            Configuration
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <ion-content class="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Initialisation</IonLabel>
              </IonItemDivider>
              <IonItem>
                <IonLabel>Unité</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel slot="start">Poids initial</IonLabel>
                <IonInput slot="end" value={poidsInitial} onChange={e => setPoidsInitial(e.target.value)}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel slot="start">Poids ciblé</IonLabel>
                <IonInput slot="end" value={poidsCible} onChange={e => setPoidsCible(e.target.value)}></IonInput>
              </IonItem>
            </IonItemGroup>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonButton shape="round" expand="block">reset</IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton shape="round" expand="block">confirm</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonCard>
          <IonCardContent>
            <IonList>
              <IonListHeader lines="inset">
                <IonLabel>Notification</IonLabel>
                {/* <IonButton>Clear</IonButton> */}
              </IonListHeader>
              <IonItem lines="none">
                <IonLabel color="primary">
                  <h3>I got you babe</h3>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel color="primary">
                  <h3>I got you babe</h3>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel color="primary">
                  <h3>I got you babe</h3>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel color="primary">
                  <h3>I got you babe</h3>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </ion-content>

      <ion-footer>
        <ion-toolbar>
          <ion-title>Footer</ion-title>
        </ion-toolbar>
      </ion-footer>
    </ion-app>
  )
}

export default ConfigurationPoids;
