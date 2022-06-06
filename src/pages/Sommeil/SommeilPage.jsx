import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import BoutonAlertes from "./BoutonAlertes";
import BoutonsBas from "./BoutonsBas";
import Graphique from "./Graphique";
import HeuresTotales from "./HeuresTotales";
import ListeSommeils from "./ListeSommeils";
import "./Sommeil.css";

const SommeilPage = (props) => {
  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonButton>
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
        <BoutonsBas></BoutonsBas>
      </IonFooter>
    </IonPage>
  );
};
export default SommeilPage;
