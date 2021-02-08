import React from "react"
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';

import '../../Tab1.css';

const Sommeil = () => {

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }   
  }
  
  return (

    <div>
      <IonItem className="divTitre7">
        <IonAvatar slot="start">
          <img src="/assets/Sommeil3.png" alt=""/>
        </IonAvatar>
        <IonLabel><h2><b>Sommeil</b></h2></IonLabel>
        <IonInput className='inputTextGly' color="danger" placeholder="" onIonChange={""}><b className="buttonTime">{""}</b></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV7")}/>
      </IonItem>
        <div id="myDIV7">
          <IonItem>
            <IonRow>
              <IonCol size="4">
                <IonLabel className = 'joggingTitle'><h3>Durée</h3></IonLabel>
              </IonCol>
              <IonCol size="5" >
                <IonInput className='inputTextActivities' color="danger" value={""} placeholder="______" onIonChange={""}></IonInput>  
              </IonCol>
            </IonRow>        
            <IonRow>
              <IonCol className="activitieCheck" size="6" >
                {/* <IonCheckbox  onIonChange={e => (setUnity('Heure'), setChecked(e.detail.checked))}/> */}
                <IonButton color="light" onClick={""}>Heure</IonButton> 
              </IonCol>
              <IonCol className="activitieCheck"  size="6" >
              <IonButton color="light" onClick={""}>Minute</IonButton> 
                {/* <IonCheckbox onIonChange={e => (setUnity('Minute'), setChecked2(e.detail.checked!), setChecked(!checked))}/> */}
                {/* <IonCheckbox checked={checked} onIonChange={e => setChecked(e.detail.checked)}/> */}
              </IonCol>
            </IonRow>
            </IonItem>
        </div>
    </div>  

  );
}
export default Sommeil;