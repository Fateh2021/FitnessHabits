import React, { useState , useEffect} from 'react';
import firebase from 'firebase'
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent } from '@ionic/react';



         
const Initialisation = () => {
  const userUID = localStorage.getItem('userUid');
  let preferencesPoidsRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")

  

  useEffect(() => {
    preferencesPoidsRef.once("value").then(function(snapshot) {
      setPoidsInitial(snapshot.val().poidsInitial);
      setPoidsCible(snapshot.val().poidsCible);
      setUnitePoids(snapshot.val().unitePoids);
    })
  },[])

  const [poidsInitial, setPoidsInitial] = useState("");
  const [poidsCible, setPoidsCible] = useState("");
  const [unitePoids, setUnitePoids] = useState("");
  

  const handlePoidsInitialChange = (value) => {
    setPoidsInitial(value)
  }

  const handlePoidsCibleChange = (value) => {
    setPoidsCible(value)
  }

  const handleUnitePoidsChange = (value) => {
    setUnitePoids(value);
  }
  
  const testHandler = () => {
    let preferencesPoids = {poidsInitial: poidsInitial, poidsCible : poidsCible, unitePoids: unitePoids}
    console.log(preferencesPoids);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);
  }

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Paramètre</IonLabel>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Unité</IonLabel>
              <IonButton class="dayButton" size="small" shape="round" onClick={ () => handleUnitePoidsChange("KG") } >KG </IonButton>
              <IonButton class="dayButton" size="small" shape="round" onClick={ () => handleUnitePoidsChange("LBS")}>LBS</IonButton>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Poids initial</IonLabel>
              <IonInput slot="end" value={poidsInitial} onIonChange={e => handlePoidsInitialChange(e.target.value)}></IonInput>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">Poids ciblé</IonLabel>
              <IonInput slot="end" value={poidsCible} onIonChange={e => handlePoidsCibleChange(e.target.value)}></IonInput>
            </IonItemDivider>
          </IonItemGroup>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton shape="round" expand="block">REINITIALISER</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={testHandler}>CONFIRMER</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      </IonContent>
  )
}

export default Initialisation;

