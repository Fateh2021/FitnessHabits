import React, { useState } from 'react';
import { IonList, IonListHeader, IonLabel } from '@ionic/react';
import ConfigurationNotificationCarte from "./configurationNotificationCarte";

const ConfigurationNotificationCarteListe = ({ listeNotificationObject }) => {
  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Notifications</IonLabel>
      </IonListHeader>
      {listeNotificationObject.map((object, index) => <ConfigurationNotificationCarte notificationObject={object} key={index} />)}
    </IonList>
  )
}

export default ConfigurationNotificationCarteListe;
