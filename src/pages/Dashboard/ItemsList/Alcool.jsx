import React from "react"

import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';

import '../../Tab1.css';

const Alcool = () => {
  
  return (
  <div>
    <IonItem className="divTitre8">
      <IonAvatar slot="start">
        <img src="/assets/Alcool.jpg" alt=""/>
      </IonAvatar>
      <IonLabel><h2><b>Alcool</b></h2></IonLabel>
      <IonInput className='inputTextGly' readonly color="danger" value={""}></IonInput>
      <div className="arrowButton">  
      <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={""}/>
      </div>
    </IonItem>          
    <div id="myDIV8">
      <IonItem>     
        <IonRow>
          <IonCol size="6">
            <IonLabel className = 'joggingTitle'><h3>Vin blanc</h3></IonLabel>
          </IonCol>
          <IonCol size="6" >
            <IonInput className='inputTextActivities' color="danger" value={""} placeholder="______"  onIonChange={""}></IonInput>  
          </IonCol>
        </IonRow>
      </IonItem>          
    </div>
  </div>  
  );
}
export default Alcool;