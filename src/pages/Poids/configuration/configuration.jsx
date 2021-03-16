import React, { useState, useRef, useEffect } from 'react';
import { IonCard, IonGrid, IonRow, IonCol, IonButton, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonFooter } from '@ionic/react';
import './configuration.css';
import HeaderPoids from "./header";
import InitialisationPoids from "./Initialisation";
import ConfigurationNotificationCarteListe from "./configurationNotificationCarteListe";
import notificationObject from './notificationObject';

var divStyle = { width: "500px", height: "500px" };

const ConfigurationPoids = (props) => {
  const [listNotification, setListNotification] = useState([]);

  const handleAjouterNotificationOnClick = () => {
    const liste = listNotification;
    setListNotification([...liste, notificationObject]);
  }

  return (
    <ion-app>
      <HeaderPoids url="/dashboard" />
      <ion-content class="ion-padding" overflow-scroll="true">
        <ion-tabs>
          <ion-tab tab="Initialisation">
            <InitialisationPoids />
          </ion-tab>
          <ion-tab tab="Notification">
            <ConfigurationNotificationCarteListe listeNotificationObject={listNotification} />
            <IonCard>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonButton shape="round" expand="block">Supprimer</IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton shape="round" expand="block" onClick={handleAjouterNotificationOnClick}>Ajouter</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </ion-tab>

          <ion-tab-bar slot="bottom" >
            <ion-tab-button tab="Initialisation">
              <ion-label>Initialisation</ion-label>
            </ion-tab-button>
            <ion-tab-button tab="Notification">
              <ion-label>Notification</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </ion-content>
    </ion-app>
  )
}

export default ConfigurationPoids;
