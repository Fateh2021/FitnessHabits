import React, { Fragment, useState } from 'react';
import { IonToggle, IonRow, IonButton, IonCard, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonGrid, IonCol } from '@ionic/react';

const handleRouterPageConfigNotification = () => {
  window.location.href = '/configurationNotification';
}

const ConfigurationNotificationCarte = ({ notificationObject }) => {
  const [notification, setNotification] = useState(notificationObject);
  const jourNotification = notification.jours.map((value, index) => <IonLabel color="primary" key={index}>{value}</IonLabel>);
  return (
    <Fragment>
      <IonCard onClick={handleRouterPageConfigNotification}>
        <IonCardContent>
          <IonList>
            <IonListHeader lines="inset">
              <IonLabel>Notification {notification.index}</IonLabel>
              <IonToggle checked={notification.actif} onIonChange={e => setNotification({ ...notification, actif: e.target.value })} />
            </IonListHeader>
            <IonItem lines="full">
              <IonLabel color="primary">
                <h3>{notification.temps}</h3>
              </IonLabel>
            </IonItem>
            <IonItem lines="none">
              {jourNotification}
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>
    </Fragment>
  )
}

export default ConfigurationNotificationCarte;
