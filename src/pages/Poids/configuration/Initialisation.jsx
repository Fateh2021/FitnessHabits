import React, { useState , useEffect} from 'react';
import firebase from 'firebase'
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent, IonDatetime, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import "../../poids.css";
import * as translate from "../../../translate/Translator";
import * as poidsService from "../../Poids/configuration/poidsService"

import moment from "moment"
import { pause } from 'ionicons/icons';

const DIFF_UNITE_POIDS = 2.2;
//obtenir initialisation
var arrPoidFirst = 0.0;
var preferencesPoidUnite = localStorage.getItem('prefUnitePoids');
         
const Initialisation = () => {

const redirectDashboard = () => {
  window.location.href = "/dashboard"
}

function formatDate (date) {
  return moment(date).format('YYYY-MM-DD');
}

const userUID = localStorage.getItem('userUid');

// Récupération des informations de la préférence par rapport au poids (unite)
let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids");

// Récupération des informations de la préférence par rapport au poids(donnees)
let poidsRef = firebase.database().ref('dashboard/' + userUID)
  poidsRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
  
  var graphData = []
  if (snapshot.val() != null) {
  // On doit comprendre à quoi sert la variable _
    for (const [_,value] of Object.entries(snapshot.val())) {
        if (value.poids.datePoids !== undefined) {
            let datePoids = formatDate(value.poids.datePoids)
            let poids = poidsService.formatPoids(value.poids.dailyPoids)
            graphData.push ({x: datePoids, y: poids})
        }
    }
    graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);
  }
  if(graphData.length > 0)
    arrPoidFirst = ((graphData[0].y));
  //const [e,v] =  Object.entries(arrPoidFirst)
  //console.log(`initialisation :  ${arrPoidFirst}`);
  console.log(`initialisation :  ${ arrPoidFirst }`);
  localStorage.setItem('dataPoids',arrPoidFirst);
  
});

useEffect(() => {
  preferencesPoidsRef.once("value").then(function(snapshot) {
    if (snapshot.val() !== null) {
      var ini = snapshot.val().poidsInitial;
      let ci = snapshot.val().poidsCible;
      console.log(`initial dans BD ${ini}`)
      if(ini == null || ini == 0.00) ini = arrPoidFirst;
      console.log(`initial dans re-inii ${ini}`)
      setUnitePoids(snapshot.val().unitePoids);
      if (snapshot.val().unitePoids === "LBS") {
        preferencesPoidUnite = "LBS";
        ini *= DIFF_UNITE_POIDS;
        ci *= DIFF_UNITE_POIDS;

      } 
      setPoidsInitial(parseFloat(ini).toFixed(2));
      setPoidsCible(parseFloat(ci).toFixed(2));
      setDateCible(snapshot.val().dateCible)
    }
  })
},[])

/*
const [poidsInitial, setPoidsInitial] = useState(`${arrPoidFirst}`);
const [poidsCible, setPoidsCible] = useState(`${arrPoidFirst*0.9}`);
const [unitePoids, setUnitePoids] = useState(preferencesPoidUnite);
*/

const [poidsInitial, setPoidsInitial] = useState("");
const [poidsCible, setPoidsCible] = useState("");
const [unitePoids, setUnitePoids] = useState("");


const [dateCible, setDateCible] = useState("");

const handlePoidsInitialChange = (value) => {
  setPoidsInitial(value)
}

const handlePoidsCibleChange = (value) => {
  setPoidsCible(value)
}

const handleUnitePoidsChange = (e) => {
  let value = e.detail.value
  let OldUnitePoids = unitePoids;
  setUnitePoids(value);
  const dashboard = JSON.parse(localStorage.getItem('dashboard'));
  if (OldUnitePoids === "KG" && value === "LBS") {
    setPoidsCible((poidsCible * DIFF_UNITE_POIDS).toFixed(2))
    setPoidsInitial((poidsInitial * DIFF_UNITE_POIDS).toFixed(2))
  } else if (OldUnitePoids === "LBS" && value === "KG") {
    setPoidsCible((poidsCible / DIFF_UNITE_POIDS).toFixed(2))
    setPoidsInitial((poidsInitial / DIFF_UNITE_POIDS).toFixed(2))
  }
  
  localStorage.setItem('dashboard', JSON.stringify(dashboard));
}

const handleDateCibleChange = (value) => {
  setDateCible(value);
};

const handleReinitialisation = () => {
    //arrPoidFirst == null? setPoidsInitial("0.00"): setPoidsInitial(arrPoidFirst);
    //setPoidsCible(arrPoidFirst*0.9);
    setPoidsInitial("0.00");
    setPoidsCible("0.00");

    setUnitePoids(preferencesPoidUnite);
    //setUnitePoids("");
    setDateCible("")
    //updatd BD
    let preferencesPoids = {poidsInitial: 0.0, poidsCible : 0.0, unitePoids: "KG", dateCible: null}
    poidsService.setPrefUnitePoids("KG")
    firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);
}

const handlerConfirmation = () => {
  let pi = 0.0, pc = 0.0;
// Si l'utilisateur omet de saisir ses informations de base, il devra saisir les champs manquant
  if (poidsInitial != 0 && poidsCible != 0 && unitePoids !== "" && dateCible !== ""){
    pi = poidsInitial;
    pc = poidsCible;
    if (unitePoids === "LBS") {
      pi = (poidsInitial / DIFF_UNITE_POIDS).toFixed(2)
      pc = (poidsCible / DIFF_UNITE_POIDS).toFixed(2)
    }
    //let preferencesPoids = {poidsInitial: pi, poidsCible : pc, unitePoids: unitePoids, dateCible: dateCible}
    //poidsService.setPrefUnitePoids(unitePoids)
    //firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);
    //redirectDashboard();
  } else {
      alert("Attention, veuiller saisir les informations manquantes !")
  }
  let preferencesPoids = {poidsInitial: pi, poidsCible : pc, unitePoids: unitePoids, dateCible: dateCible}
  poidsService.setPrefUnitePoids(unitePoids)
  console.log(`to BD: ${preferencesPoids}`)
  firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);
  localStorage.setItem('preferencesPoidsVaules', preferencesPoids);
  redirectDashboard();
}

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("POIDS_PREF_UNITE_POIDS")}</IonLabel>
              <IonSelect slot ="end" value={unitePoids} okText={translate.getText("POIDS_PREF_CHOISIR")} cancelText={translate.getText("POIDS_PREF_ANNULER")} onIonChange={e => handleUnitePoidsChange(e)}>
              <IonSelectOption value="LBS">LBS</IonSelectOption>
              <IonSelectOption value="KG">KG</IonSelectOption>
            </IonSelect>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("POIDS_PREF_POIDS_INITIAL")}</IonLabel>
              <IonInput class="ion-text-right" slot="end" value={poidsInitial} onIonChange={e => handlePoidsInitialChange(e.target.value)}></IonInput>
              <IonText class="ion-text-left" style={{margin: 5}} slot="end">{unitePoids}</IonText>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("POIDS_PREF_POIDS_CIBLE")}</IonLabel>
              <IonInput class="ion-text-right" slot="end" value={poidsCible} onIonChange={e => handlePoidsCibleChange(e.target.value)}></IonInput>
              <IonText class="ion-text-left" style={{margin: 5}} slot="end">{unitePoids}</IonText>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("POIDS_PREF_DATE_CIBLE")}</IonLabel>
              <IonDatetime
                monthShortNames = {translate.getText("ABBREVIATION_MOIS")}
                slot="end"
                displayFormat="MMM DD, YYYY"
                placeholder="Choisir une date"
                max="2099-10-31"
                value={dateCible}
                onIonChange={(e) => handleDateCibleChange(e.target.value)}
              ></IonDatetime>
            </IonItemDivider>
          </IonItemGroup>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={handleReinitialisation}>{translate.getText("POIDS_PREF_REINITIALISER")}</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={handlerConfirmation}>{translate.getText("POIDS_PREF_CONFIRMER")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      </IonContent>
  )
}

export default Initialisation;

