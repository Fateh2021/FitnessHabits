import React from 'react';
import { IonItem, IonIcon, IonLabel, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle,} from 'ionicons/icons';
// import uuid from 'react-uuid';

import '../../../pages/Tab1.css';

//Open items Div
const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
    
  }

const FormatDate = () => {

  return (
    <div>
      {/* Entête Formats de dates */}
      <IonItem className="divTitre7">
        <IonAvatar slot="start">
          {/* todo: change picture */}
          <img src="/assets/Imgtime.png" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Format des dates</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV10")} />
      </IonItem>
                  
      {/* Entête Formats de dates */}
      <div>
        <div id="myDIV10">
          {/* todo: load l'instruction selon la langue from DB ? */}
          <span>Sélectionnez un format de dates</span>
            {/* todo: load les options selon la langue from DB ? */}                     
            <select id="materialSelectFormatDate">
            <option value="-1"></option>
            <option value="0">MM-JJ-AAAA (format Américain ou Anglais) ex: 02-16-2021</option>
            <option value="1">JJ-MM-AAAA (format Français) ex: 16-02-2021</option>
            <option value="2">AAAA-MM-JJ (format International) ex: 2021-02-16</option>
            <option value="3">AAAA-mmm-JJ (International dont le mois est lettré) ex: 2021-fev-16</option>
            <option value="4">JJ-mmm-AAAA (Français avec mois lettré) - 16-fev-2021</option>
          </select>   
        </div>
      </div>
    </div>       
  );
}
export default FormatDate;