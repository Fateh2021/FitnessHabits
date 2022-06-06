import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle} from '@ionic/react';

class SommeilModal extends React.Component {

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>MODAL SOMMEIL</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>INSCRIRE DONNÉES SOMMEIL - À faire</p>
      </IonContent>
    </>
  };

}

export default SommeilModal;