import React, {useState, useEffect} from 'react';
import { IonRow, IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle, star} from 'ionicons/icons';
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
    setDailyTarget({ ...dailyTarget, [name]: value });
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.hydratation.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("handleDailyTargetChange -- updatedDailyTarget ::"+JSON.stringify(updatedDailyTarget));
    console.log("handleDailyTargetChange -- settings ::"+JSON.stringify(settings));
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
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV1")} />
      </IonItem>

      {/* Détails hydratation */}
      <div id="myDIV1">
        <IonItem className="descripItem">     
          <IonRow>
            <IonCol size="1">
              <IonIcon  className="target" icon={star}/></IonCol>
            <IonCol size="3">
              <IonLabel className = 'description'><h3>Description</h3></IonLabel></IonCol>
            <IonCol size="2" >
              <IonLabel className = 'taillePortion'><h3>Taille</h3></IonLabel>
            </IonCol>
            <IonCol size="2" >
              <IonLabel className = 'uniteMesure'><h3>Unité</h3></IonLabel>
            </IonCol>
            <IonCol size="4" >
              <div className="triangle">
                <div className="triangleText1"><b>Gras</b></div>
                <div className="triangleText2"><b>Prot</b></div>
                <div className="triangleText3"><b>Fib</b></div>
                <div className="triangleText4"><b>Gluc</b></div>         
              </div>    
            </IonCol>
          </IonRow>                     
        </IonItem>
              
        {/* Items hydratation */}
        <Hydrate hydrates={props.hydratation.hydrates} />
      
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type = "number" name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChange}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonItem>
        </IonRadioGroup>  
      </div>
    </div>            
  );
}
export default Hydratation;