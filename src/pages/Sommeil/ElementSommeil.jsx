import { IonItem, IonText } from "@ionic/react";
import React from "react";
import "./Sommeil.css";

function ElementSommeil(props) {
  return (
    <ion-row class="modal-data">
      <ion-col>
        <IonText color="dark" class="data-time">
          De <b>{props.info.start}</b> à{" "}
          <b>
            {props.info.end} - réveillé {props.info.mood}
          </b>
        </IonText>
        <br />
        <IonText color="dark" class="data-text">
          Durant cette période, je me suis réveillé {props.info.nbAwoken} fois.
        </IonText>
        <br />
        <IonText color="dark" class="data-date">
          {props.info.day} / {props.info.month} / {props.info.year}
        </IonText>
        <div class="hr"></div>
      </ion-col>
    </ion-row>
  );
}

export default ElementSommeil;
