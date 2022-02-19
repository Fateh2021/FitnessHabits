import React, { useState , useEffect} from 'react';
import firebase from 'firebase'
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent, IonDatetime, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import "../../poids.css";
import * as translate from "../../../translate/Translator";
import * as poidsService from "../../Poids/configuration/poidsService"

const DIFF_UNITE_POIDS = 2.2;
         
const Initialisation = () => {

	const redirectDashboard = () => {
		window.location.href = "/dashboard"
	}

  const userUID = localStorage.getItem('userUid');

  // Récupération des informations de la préférence par rapport au poids
  let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")

  useEffect(() => {
    preferencesPoidsRef.once("value").then(function(snapshot) {
      if (snapshot.val() != null) {

        setUnitePoids(snapshot.val().unitePoids);
        if (snapshot.val().unitePoids == "LBS") {
          setPoidsInitial((parseFloat(snapshot.val().poidsInitial) * DIFF_UNITE_POIDS).toFixed(2));
          setPoidsCible((parseFloat(snapshot.val().poidsCible) * DIFF_UNITE_POIDS ).toFixed(2));
        } else {
          setPoidsInitial(parseFloat(snapshot.val().poidsInitial).toFixed(2));
          setPoidsCible(parseFloat(snapshot.val().poidsCible).toFixed(2));
        }
        setDateCible(snapshot.val().dateCible)
      }
    })
  },[])

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
    if (OldUnitePoids == "KG" && value == "LBS") {
      setPoidsCible((poidsCible * DIFF_UNITE_POIDS).toFixed(2))
      setPoidsInitial((poidsInitial * DIFF_UNITE_POIDS).toFixed(2))
    } else if (OldUnitePoids == "LBS" && value == "KG") {
      setPoidsCible((poidsCible / DIFF_UNITE_POIDS).toFixed(2))
      setPoidsInitial((poidsInitial / DIFF_UNITE_POIDS).toFixed(2))
    }
    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
  }

  const handleDateCibleChange = (value) => {
    setDateCible(value);
  };

  const handleReinitialisation = () => {
    setPoidsInitial("0.00");
    setPoidsCible("0.00");
    setUnitePoids("");
    setDateCible("")
  }

  const handlerConfirmation = () => {
  // Si l'utilisateur omet de saisir ses informations de base, il devra saisir les champs manquant
    if (poidsInitial != 0 && poidsCible != 0 && unitePoids != "" && dateCible != ""){
        let pi = poidsInitial;
        let pc = poidsCible;
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

