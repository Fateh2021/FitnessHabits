import React, { useState , useEffect} from 'react';
import firebase from 'firebase'
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent, IonDatetime, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import "../../weight.css";
import * as translate from "../../../translate/Translator";
import * as weightService from "../../weight/configuration/weightService"

import moment from "moment"

const WEIGHT_UNIT_DEF = 2.2;
const userUID = localStorage.getItem('userUid'); // Récupération du userID

// Au moment d'afficher la page, nous allons afficher l'information qui se trouve dans «preferencesweight» du profil de l'utilisateur
const Initialisation = () => {

// Retour à la page principale de l'application
const redirectDashboard = () => {
  window.location.href = "/dashboard"
}

function formatDate (date) {
  return moment(date).format('YYYY-MM-DD');
}

var prefWeightUnit = localStorage.getItem('prefweightUnit');

const [initialWeight, setInitialWeight] = useState("");
const [targetWeight, setTargetWeight] = useState("");
const [targetDate, setTargetDate] = useState("");
const [weightUnit, setWeightUnit] = useState("");

const handleinitialWeightChange = (value) => {
  setInitialWeight(value)
}

const handletargetWeightChange = (value) => {
  setTargetWeight(value)
}

const handletargetDateChange = (value) => {
  setTargetDate(value);
};

const handleweightUnitChange = (e) => {
  let value = e.detail.value
  let OldweightUnit = weightUnit; // On récupère l'ancienne unité de weight
  setWeightUnit(value);

  if (OldweightUnit === "KG" && value === "LBS") {
    setTargetWeight((targetWeight * WEIGHT_UNIT_DEF).toFixed(2))
    setInitialWeight((initialWeight * WEIGHT_UNIT_DEF).toFixed(2))
  } else if (OldweightUnit === "LBS" && value === "KG") {
    setTargetWeight((targetWeight / WEIGHT_UNIT_DEF).toFixed(2))
    setInitialWeight((initialWeight / WEIGHT_UNIT_DEF).toFixed(2))
  }
}

// Récupération des informations initiale et cible du client pour les afficher
let preferencesweightRef = firebase.database().ref('profiles/' + userUID + "/preferencesweight");
useEffect(() => {
  preferencesweightRef.once("value").then(function(snapshot) {
    if (snapshot.val() !== null) {
      var ini = snapshot.val().initialWeight;
      var ci = snapshot.val().targetWeight;
      // Nous devons mettre des valeurs de 0 si elle n'éxiste pas encore...
      if (ini == null){
        ini = 0;
      }

      if (ci == null){
        ci = 0;
      }

      setWeightUnit(snapshot.val().weightUnit);
      // Si le type unité de weight est en livre, nous devons faire x 2.2 (WEIGHT_UNIT_DEF)
      if (snapshot.val().weightUnit === "LBS") {
        prefWeightUnit = "LBS";
        ini *= WEIGHT_UNIT_DEF;
        ci *= WEIGHT_UNIT_DEF;
      }

      setInitialWeight(parseFloat(ini).toFixed(2));
      setTargetWeight(parseFloat(ci).toFixed(2));
      setTargetDate(snapshot.val().targetDate)
    }
  })
},[])

// Event qui viendra remettre aux valeurs de départ soit null pour tous les champs sauf le type de weight qui doit etre par défaut KG
const handleReinitialisation = () => {
	setTargetWeight("0.00");
  setWeightUnit(prefWeightUnit); // On met par défaut KG, maintenant à la demande de Sylvie
  setTargetDate("");
	// Récupération de la première donnée par rapport au weight, comme nous avons fait un reset des informations de base.
	// Déplacement de la récupération de l'info du weight via firebase ici, car ailleurs la BD est callé plusieurs fois.
  let weightRef = firebase.database().ref('dashboard/' + userUID)
  weightRef.orderByChild("weight/dailyweight").once("value").then(function(snapshot){
    var graphData = []
    // J'ai retiré la validation si le retour de fireball contenait ou pas des données pour enlever un code smell
    // Si le résultat est null, le graphique restera null et mettra 0 comme valeur par défault
    for (const [_,value] of Object.entries(snapshot.val())) {
        if (value.weight.dateWeight !== undefined) {
            let dateWeight = formatDate(value.weight.dateWeight)
            let weight = weightService.formatweight(value.weight.dailyweight)
            graphData.push ({x: dateWeight, y: weight})
        }
    }
    // Triage pour avoir les informations de la plus vieille date à la plus récente
    graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);

    if(graphData.length > 0){
      // Récupération de la première valeur que le user a saisie à ses début avec l'application
      setInitialWeight(parseFloat(graphData[0].y).toFixed(2));
    } else {
      setInitialWeight("0.00");
    }
  });
}

// Event qui viendra confirmer les informations sur les objectifs de l'utilisateur
const handlerConfirmation = () => {
  let pi = 0.0, pc = 0.0;
	// Si l'utilisateur omet de saisir ses informations de base, il devra saisir les champs manquant
  if (initialWeight != 0 && targetWeight != 0 && weightUnit !== "" && targetDate !== ""){
    pi = initialWeight;
    pc = targetWeight;
    // On stock les informations en KG dans la BD
    if (weightUnit === "LBS") {
      pi = (initialWeight / WEIGHT_UNIT_DEF).toFixed(2)
      pc = (targetWeight / WEIGHT_UNIT_DEF).toFixed(2)
    }
    let preferencesweight = {initialWeight: pi, targetWeight : pc, weightUnit: weightUnit, targetDate: targetDate}
    weightService.setPrefweightUnit(weightUnit)
    firebase.database().ref('profiles/' + userUID + "/preferencesweight").update(preferencesweight);
    redirectDashboard();
  } else {
      alert("Attention, veuiller saisir les informations manquantes !")
  }
}

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <IonItemGroup>
            <IonItemDivider>

              <IonLabel slot="start">{translate.getText("weight_PREF_UNITE_weight")}</IonLabel>
            {/*<IonSelect slot ="end" value={weightUnit} okText={translate.getText("weight_PREF_CHOISIR")} cancelText={translate.getText("weight_PREF_ANNULER")} onIonChange={e => handleweightUnitChange(e)}>
*/}
              <IonSelect data-testid = "pop_up_unite" slot ="end" value={weightUnit} okText={translate.getText("weight_PREF_CHOISIR")} cancelText={translate.getText("weight_PREF_ANNULER")} onIonChange={e => handleweightUnitChange(e)}>
                <IonSelectOption value="LBS">LBS</IonSelectOption>
                <IonSelectOption value="KG">KG</IonSelectOption>
              </IonSelect>

            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("weight_PREF_weight_INITIAL")}</IonLabel>
              <IonInput class="ion-text-right" slot="end" value={initialWeight} onIonChange={e => handleinitialWeightChange(e.target.value)}></IonInput>
              <IonText class="ion-text-left" style={{margin: 5}} slot="end">{weightUnit}</IonText>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("weight_PREF_weight_CIBLE")}</IonLabel>
              <IonInput class="ion-text-right" slot="end" value={targetWeight} onIonChange={e => handletargetWeightChange(e.target.value)}></IonInput>
              <IonText class="ion-text-left" style={{margin: 5}} slot="end">{weightUnit}</IonText>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("weight_PREF_DATE_CIBLE")}</IonLabel>
              <IonDatetime
                monthShortNames = {translate.getText("ABBREVIATION_MOIS")}
                slot="end"
                displayFormat="MMM DD, YYYY"
                placeholder="Choisir une date"
                max="2099-10-31"
                value={targetDate}
                onIonChange={(e) => handletargetDateChange(e.target.value)}
              ></IonDatetime>
            </IonItemDivider>
          </IonItemGroup>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={handleReinitialisation}>{translate.getText("weight_PREF_REINITIALISER")}</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={handlerConfirmation}>{translate.getText("weight_PREF_CONFIRMER")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      </IonContent>
  )
}

export default Initialisation;

