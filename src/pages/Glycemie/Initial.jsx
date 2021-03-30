import firebaseDb from "../../firebaseConfig"
import React, { useState, useEffect } from 'react'

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonFab,
  IonFabButton
} from "@ionic/react";

import { add, arrowBack, closeCircleOutline } from "ionicons/icons";
import './style.css';

const Initial = () => {

  
  var [glycemie, setGlycemie] = useState({})

  // Reading from db
  useEffect(() => {
    firebaseDb.child('NotificationGlycemie').on('value', snapshot => {
        if (snapshot.val() != null)
            setGlycemie({
            ...snapshot.val()
        })
        snapshot.forEach(function (childSnapshot) {
    });

    })
  }, [])

  return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Notifications glycémie</IonTitle>
                </IonToolbar>

            <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                <IonFabButton href="/dashboard" size="small">
                    <IonIcon icon={arrowBack} />
                </IonFabButton>
            </IonFab>
        </IonHeader>

        <IonContent>

          {
            Object.keys(glycemie).map(e => {
              return <IonCard key={e}>
                <div>
                  <IonCardContent>

                        <div class="heure" name="heure">{new Date(glycemie[e].heure).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>

                        <div class="contenu" name="notifierAvant">Notifier avant {new Date(glycemie[e].notifierAvant).toLocaleTimeString([], {minute:'2-digit'})} min</div>

                        <div class="contenu" name="jour">{glycemie[e].jour.join("  ")}</div>

                        <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                            <IonFabButton class="removeButton" size="small" onClick={() => {firebaseDb.database.ref('NotificationGlycemie/' + e).remove()}} href="/glycemie">
                                <IonIcon icon={closeCircleOutline} />
                            </IonFabButton>
                        </IonFab>

                  </IonCardContent>
                </div>

              </IonCard>

            })
          }
        </IonContent>

        <IonFab vertical="bottom" horizontal="center" slot="fixed" >
            <IonFabButton href="/glycemieAjout"><IonIcon icon={add}/></IonFabButton>
        </IonFab>

      </IonPage>
  );
};
export default Initial;