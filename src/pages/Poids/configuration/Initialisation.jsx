import React, { useState , useEffect} from 'react';
import firebase from 'firebase'
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent, IonDatetime, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import "../../poids.css";
import * as translate from "../../../translate/Translator";
import * as poidsService from "../../Poids/configuration/poidsService"

import moment from "moment"

const DIFF_UNITE_POIDS = 2.2;
const userUID = localStorage.getItem('userUid'); // Récupération du userID

// Au moment d'afficher la page, nous allons afficher l'information qui se trouve dans «preferencesPoids» du profil de l'utilisateur
const Initialisation = () => {

// Retour à la page principale de l'application
const redirectDashboard = () => {
  window.location.href = "/dashboard"
}

function formatDate (date) {
  return moment(date).format('YYYY-MM-DD');
}

var preferencesPoidUnite = localStorage.getItem('prefUnitePoids');

const [poidsInitial, setPoidsInitial] = useState("");
const [poidsCible, setPoidsCible] = useState("");
const [dateCible, setDateCible] = useState("");
const [unitePoids, setUnitePoids] = useState("");

const handlePoidsInitialChange = (value) => {
  setPoidsInitial(value)
}

const handlePoidsCibleChange = (value) => {
  setPoidsCible(value)
}

const handleDateCibleChange = (value) => {
  setDateCible(value);
};

const handleUnitePoidsChange = (e) => {
  let value = e.detail.value
  let OldUnitePoids = unitePoids; // On récupère l'ancienne unité de poids
  setUnitePoids(value);

  if (OldUnitePoids === "KG" && value === "LBS") {
    setPoidsCible((poidsCible * DIFF_UNITE_POIDS).toFixed(2))
    setPoidsInitial((poidsInitial * DIFF_UNITE_POIDS).toFixed(2))
  } else if (OldUnitePoids === "LBS" && value === "KG") {
    setPoidsCible((poidsCible / DIFF_UNITE_POIDS).toFixed(2))
    setPoidsInitial((poidsInitial / DIFF_UNITE_POIDS).toFixed(2))
  }
}

// Récupération des informations initiale et cible du client pour les afficher
let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids");
useEffect(() => {
  preferencesPoidsRef.once("value").then(function(snapshot) {
    if (snapshot.val() !== null) {
      var ini = snapshot.val().poidsInitial;
      var ci = snapshot.val().poidsCible;
      // Nous devons mettre des valeurs de 0 si elle n'éxiste pas encore...
      if (ini == null){
        ini = 0;
      }

      if (ci == null){
        ci = 0;
      }

      setUnitePoids(snapshot.val().unitePoids);
      // Si le type unité de poids est en livre, nous devons faire x 2.2 (DIFF_UNITE_POIDS)
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

// Event qui viendra remettre aux valeurs de départ soit null pour tous les champs sauf le type de poids qui doit etre par défaut KG
const handleReinitialisation = () => {
	setPoidsCible("0.00");
  setUnitePoids(preferencesPoidUnite); // On met par défaut KG, maintenant à la demande de Sylvie
  setDateCible("");
	// Récupération de la première donnée par rapport au poids, comme nous avons fait un reset des informations de base.
	// Déplacement de la récupération de l'info du poids via firebase ici, car ailleurs la BD est callé plusieurs fois.
  let poidsRef = firebase.database().ref('dashboard/' + userUID)
  poidsRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
    var graphData = []
    if (snapshot.val() != null) {
      for (const [_,value] of Object.entries(snapshot.val())) {
          if (value.poids.datePoids !== undefined) {
              let datePoids = formatDate(value.poids.datePoids)
              let poids = poidsService.formatPoids(value.poids.dailyPoids)
              graphData.push ({x: datePoids, y: poids})
          }
      }
      // Triage pour avoir les informations de la plus vieille date à la plus récente
      graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);
    }

    if(graphData.length > 0){
      // Récupération de la première valeur que le user a saisie à ses début avec l'application
      setPoidsInitial(parseFloat(graphData[0].y).toFixed(2));
    } else {
      setPoidsInitial("0.00");
    }
  });
}

// Event qui viendra confirmer les informations sur les objectifs de l'utilisateur
const handlerConfirmation = () => {
  let pi = 0.0, pc = 0.0;
	// Si l'utilisateur omet de saisir ses informations de base, il devra saisir les champs manquant
  if (poidsInitial != 0 && poidsCible != 0 && unitePoids !== "" && dateCible !== ""){
    pi = poidsInitial;
    pc = poidsCible;
    // On stock les informations en KG dans la BD
    if (unitePoids === "LBS") {
      pi = (poidsInitial / DIFF_UNITE_POIDS).toFixed(2)
      pc = (poidsCible / DIFF_UNITE_POIDS).toFixed(2)
    }
    let preferencesPoids = {poidsInitial: pi, poidsCible : pc, unitePoids: unitePoids, dateCible: dateCible}
    poidsService.setPrefUnitePoids(unitePoids)
    firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);
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

