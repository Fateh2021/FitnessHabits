import {
  IonButton,
  IonButtons,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import { arrowDropleft, arrowDropright, calendar } from "ionicons/icons";
import React from "react";

function Graphique() {
  return (
    <IonGrid>
      <IonRow className="graphButtons">
        <IonRow>
          <IonButtons>
            <IonButton>
              <IonIcon icon={arrowDropleft}></IonIcon>
            </IonButton>
            <IonButton>
              <IonIcon icon={arrowDropright}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonRow>
        <IonButton fill="clear">
          <IonIcon icon={calendar}></IonIcon>
        </IonButton>
        <IonText className="graphCible">Cible | 00:00</IonText>
      </IonRow>

      <IonRow className="graph">
        <IonText>Graphique</IonText>
      </IonRow>

      <IonRow className="graphButtons">
        <IonButton color="medium" shape="round" size="small">
          Semaine
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          Mois
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          Trimestre
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          Semestre
        </IonButton>
        <IonButton color="medium" shape="round" size="small">
          Année
        </IonButton>
      </IonRow>
    </IonGrid>
  );
}

export default Graphique;
