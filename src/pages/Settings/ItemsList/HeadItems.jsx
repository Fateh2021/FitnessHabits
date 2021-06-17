import React from 'react';
import { IonRow, IonCol, IonItem, IonIcon, IonLabel} from '@ionic/react';
import { star } from 'ionicons/icons';
import '../../../pages/Tab1.css';


const HeadItems = () => {

  return (    
    <IonItem className="descripItem">     
    <IonRow>
      <IonCol size="1">
        <IonIcon  className="target" icon={star}/></IonCol>
      <IonCol size="3">
        <IonLabel className = 'description'><h3>Description</h3></IonLabel></IonCol>
      <IonCol size="2" >
        <IonLabel className = 'taillePortion'><h3>Taille</h3></IonLabel>
      </IonCol>
      <IonCol size="2" >
        <IonLabel className = 'uniteMesure'><h3>Unité</h3></IonLabel>
      </IonCol>
      <IonCol size="4" >
      <div>
        <img className="" src="/assets/Triangle.png" alt="" />   
      </div>
      </IonCol>
    </IonRow>                     
  </IonItem>        
  );
}
export default HeadItems;