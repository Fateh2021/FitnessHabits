import React, {useState} from "react"
import { IonInput, IonLabel, IonItem, IonAvatar, IonIcon} from '@ionic/react';

import '../../../pages/Tab1.css';

const Glycemie = () => {

  const [poids, setPoids] = useState();

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }    
  }

  return (
    <div>
      <IonItem className="divTitre4">
      <IonAvatar slot="start">
        <img src="/assets/Gly.jpg" alt=""/>
      </IonAvatar>
      <IonLabel>
        <h2><b>Glycémie</b></h2>
      </IonLabel>
        <IonInput className='inputTextGly' placeholder="" onIonChange={e => setPoids(e.detail.value)}><h3></h3></IonInput> 
        <IonIcon className="arrowDashItem"/>
    </IonItem>
    </div>   
  );
}
export default Glycemie;