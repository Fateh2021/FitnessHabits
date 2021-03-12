import React, {useState, useEffect} from 'react';
import { IonItem, IonIcon, IonLabel, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle,} from 'ionicons/icons';
import * as firebase from 'firebase'

import '../../../pages/Tab1.css';

//Open items Div
const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
    
  }

const FormatDate = (props) => {

  const [dateFormat, setDateFormat] = useState(props.dateFormat);

  // update state on prop change
  useEffect(() => {
    setDateFormat(props.dateFormat);
  }, [props.dateFormat])

  const handleDateFormatChanged = event => {
    const userUID = localStorage.getItem('userUid');
    const { value } = event.target;
    setDateFormat(value);
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.dateFormat = value;
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("handleDateFormatChanged -- updatedDateFormat ::"+ value);
    console.log("handleDateFormatChanged -- settings ::"+JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

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
          <span>Sélectionnez un format de date</span>
            {/* todo: load les options selon la langue from DB ? */}                     
            <select id="materialSelectFormatDate" name="dateFormat" value={dateFormat} onChange={handleDateFormatChanged}>
            <option value=""></option>
            <option value="MM-JJ-AAAA">MM-JJ-AAAA (format Américain ou Anglais) ex: 02-16-2021</option>
            <option value="JJ-MM-AAAA">JJ-MM-AAAA (format Français) ex: 16-02-2021</option>
            <option value="AAAA-MM-JJ">AAAA-MM-JJ (format International) ex: 2021-02-16</option>
            <option value="AAAA-mmm-JJ">AAAA-mmm-JJ (International dont le mois est lettré) ex: 2021-fev-16</option>
            <option value="JJ-mmm-AAAA">JJ-mmm-AAAA (Français avec mois lettré) - 16-fev-2021</option>
          </select>   
        </div>
      </div>
    </div>       
  );
}
export default FormatDate;