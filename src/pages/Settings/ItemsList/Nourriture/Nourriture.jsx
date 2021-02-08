import React from 'react';
import {IonItem, IonList, IonAvatar, IonLabel, IonIcon} from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';

 //Open items Div
 const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
  }
 }

const Nourriture = (props) => {

  return (

    <div>
      <IonItem className="divTitre2">
        <IonAvatar slot="start"><img src="/assets/nutrition.jpg" alt=""/></IonAvatar>
        <IonLabel><h2><b>Nourriture</b></h2></IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
      </IonItem>
      <div id="myDIV22">
      <IonList>
        {/* <NourriGras gras={gras}/> */}
      {/*  <NourriLegumes/>
        <NourriProteines/>
        <NourriCereales/> */}
      </IonList>
      </div>
    </div>
          
  );
}
export default Nourriture;