import React from "react"
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';

import '../../Tab1.css';

const Supplements = () => {

  return (
    <div>
      <IonItem className="divTitre3">
        <IonAvatar slot="start">
          <img src="/assets/Supp.jpeg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Suppléments</b></h2>
        </IonLabel>
        <IonInput className='inputTextGly' readonly color="danger" value={""}></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={console.log("Open Supplements")}/>
      </IonItem>
      <div id="myDIV3">
        <IonItem>     
          <IonRow>
            <IonCol size="6">
              <IonLabel className = 'joggingTitle'><h3>B12</h3></IonLabel>
            </IonCol>
            <IonCol size="6" >
              <IonInput className='inputTextActivities' color="danger" value={""} placeholder="______" onIonChange={""}></IonInput>  
            </IonCol>
          </IonRow>
        </IonItem>
      </div>
    </div>
  );
}
export default Supplements;