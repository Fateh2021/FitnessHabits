import React from 'react';
import { IonItem, IonIcon, IonLabel, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle,} from 'ionicons/icons';
// import {Supp} from '../../Data/Supp';
// import uuid from 'react-uuid';

import '../../../pages/Tab1.css';

//Open items Div
const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
    
  }

const Supplement = () => {

  return (
    <div>
      {/* Entête suppléments */}
      <IonItem className="divTitre3">
        <IonAvatar slot="start">
          <img src="/assets/Supp.jpeg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Suppléments et médicaments</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV6")} />
      </IonItem>
                  
      {/* Entête alcool */}
      <div>
        <div id="myDIV6"></div>
      </div>
    </div>       
  );
}
export default Supplement;