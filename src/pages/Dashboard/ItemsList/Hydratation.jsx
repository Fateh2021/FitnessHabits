import React, {useState, useEffect} from 'react';
import { IonItem, IonIcon, IonLabel, IonInput, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import Hydrate from '../Hydrate'
import * as firebase from 'firebase'

import '../../../pages/Tab1.css';

const Hydratation = (props) => {
  
  const [dailyTarget, setDailyTarget] = useState(props.hydratation.dailyTarget);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.hydratation.dailyTarget);
  }, [props.hydratation.dailyTarget])

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const handleDailyTargetChange = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' };
    setDailyTarget({ ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' });
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.hydratation.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  return (
    <div>
      {/* Entête hydratation */}
      <IonItem className="divTitre1">
        <IonAvatar slot="start">
          <img src="/assets/Hydratation.jpeg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Hydratation</b></h2>
        </IonLabel>
        <IonInput className='inputTextGly' readonly color="danger" value={""}></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV1")} />
      </IonItem>

      {/* Détails hydratation */}
      <div id="myDIV1">
        {/* Items hydratation */}
        <Hydrate hydrates={props.hydratation.hydrates} />
      </div>
    </div>             
  );
}
export default Hydratation;