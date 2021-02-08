import React from "react"
import { IonIcon, IonInput, IonLabel, IonItem, IonAvatar} from '@ionic/react';

import '../../Tab1.css';

const Poids = () => {

  return (
    <div>
      <IonItem className="divTitre9">
        <IonAvatar slot="start">
          <img src="/assets/Poids.jpg" alt=""/>
        </IonAvatar>
        <IonLabel><h2 color="warinig"><b>Poids</b></h2></IonLabel>
          <IonInput className='inputTextGly' value={""} placeholder="" onIonChange={""}></IonInput>
          <IonIcon className="arrowDashItem"/>
        </IonItem>
      <div id="myDIV9">

      </div>   
    </div>   
  );
}
export default Poids;