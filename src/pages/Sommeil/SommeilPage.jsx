import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBack, add } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";
import firebase from "firebase";

import BoutonAlertes from "./BoutonAlertes";
import Graphique from "./Graphique";
import HeuresTotales from "./HeuresTotales";
import ListeSommeils from "./ListeSommeils";
import "./Sommeil.css";
import AjoutPeriodeForm from "./AjoutPeriodeForm";

const SommeilPage = (props) => {
  const [showListModal, setShowListModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const history = useHistory();

  return (
    <IonPage className="page">
      <IonModal isOpen={showListModal} class="modal-sommeil">
        <ListeSommeils></ListeSommeils>
        <IonButton color="success" onClick={() => setShowListModal(false)}>
          Fermer
        </IonButton>
      </IonModal>

      <IonModal isOpen={showAddModal} class="modal-sommeil">
        <AjoutPeriodeForm></AjoutPeriodeForm>
        <IonButton color="success" onClick={() => setShowAddModal(false)}>
          Fermer
        </IonButton>
      </IonModal>

      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonButton onClick={() => history.goBack()}>
              <IonIcon color="light" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Sommeil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <BoutonAlertes></BoutonAlertes>
        <Graphique></Graphique>
        <HeuresTotales></HeuresTotales>
        <ListeSommeils></ListeSommeils>
      </IonContent>

      <IonFooter>
        <IonRow class="boutonsBas">
          <IonButton
            color="primary"
            shape="round"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter
            <IonIcon icon={add}></IonIcon>
          </IonButton>
          <IonButton
            color="medium"
            shape="round"
            onClick={() => setShowListModal(true)}
          >
            Voir toute la liste
          </IonButton>
        </IonRow>
      </IonFooter>
    </IonPage>
  );
};
export default SommeilPage;
