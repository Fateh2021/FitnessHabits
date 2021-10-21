import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonInput, IonList, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';

import '../../Tab1.css';

const Supplements = (props) => {

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }    
  }

  
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
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIVSuppl")}/>
      </IonItem>
      <div id="myDIVSuppl">
        <IonList>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/resumen.png" alt=""/>
            </IonAvatar> 
            <IonLabel>
              <h2><b>Lister suppléments et médicaments</b></h2>
            </IonLabel>
            <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={""}/>
          </IonItem>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/plus.png" alt=""/>
            </IonAvatar>
            <IonLabel>
              <h2><b>Gérer suppléments et médicaments</b></h2>
            </IonLabel>
            <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={""}/>
          </IonItem>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/ecart.png" alt=""/>
            </IonAvatar>
            <IonLabel>
              <h2><b>Afficher les écarts</b></h2>
            </IonLabel>
            <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={""}/>
          </IonItem>
        </IonList>
      </div>
    </div>
  );
}
export default Supplements;