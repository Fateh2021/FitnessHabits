import React, { useState } from 'react';
// import { arrowDropleftCircle } from 'ionicons/icons';
import { IonSelectOption, IonSelect, IonToggle, IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonHeader, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonTitle, IonGrid, IonCol } from '@ionic/react';
// import { calendar, personCircle, map, informationCircle } from 'ionicons/icons';
import './configuration.css';
import notificationObject from './notificationObject';

const ConfigurationPoids = (props) => {
  const [poidsInitial, setPoidsInitial] = useState("10");
  const [poidsCible, setPoidsCible] = useState("10");
  // const [checked, setChecked] = useState(false);
  const [unite, setUnite] = useState("KG");
  const [notification, setNotification] = useState(notificationObject);
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
                <IonLabel slot="start">Unité</IonLabel>
                <IonSelect slot="end" value={unite} placeholder="Select One" onIonChange={e => setUnite(e.target.value)}>
                  <IonSelectOption value="female">KG</IonSelectOption>
                  <IonSelectOption value="male">PG</IonSelectOption>
                </IonSelect>
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
                <IonLabel>Notification {notification.index}</IonLabel>
                <IonToggle checked={notification.actif} onIonChange={e => setNotification({ ...notification, actif: e.target.value })} />
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
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton shape="round" expand="block">Supprimer</IonButton>
              </IonCol>
              <IonCol>
                <IonButton shape="round" expand="block">Ajouter</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </ion-content>

      {/* <ion-footer>*/}
      {/*  <ion-toolbar>*/}
      {/*    <ion-title color="tertiary">Notification du Poids</ion-title>*/}
      {/*  </ion-toolbar>*/}
      {/*</ion-footer>*/}
    </ion-app>
  )
}

export default ConfigurationPoids;
