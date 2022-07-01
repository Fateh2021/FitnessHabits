import { IonItem, IonText } from "@ionic/react";
import React from "react";
import "./Sommeil.css";

function ElementSommeil(props) {
  let d = new Date(props.info.startDate);
  console.log(props.info);

  return (
    <ion-row class="modal-data">
      <ion-col>
        <IonText color="dark" class="data-time">
          De <b>{props.info.startTime}</b> à{" "}
          <b>
            {props.info.endTime} - réveillé {props.info.mood}
          </b>
        </IonText>
        <br />
        <IonText color="dark" class="data-text">
          Durant cette période, je me suis réveillé {props.info.nbAwoken} fois.
        </IonText>
        <br />
        <IonText color="dark" class="data-date">
          {d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()}
        </IonText>
        <div class="hr"></div>
      </ion-col>
    </ion-row>
  );
}

export default ElementSommeil;
