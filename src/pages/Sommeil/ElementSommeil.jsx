import { IonItem, IonText } from "@ionic/react";
import React from "react";
import "./Sommeil.css";
import * as translate from "../../translate/Translator";

function ElementSommeil(props) {
  let d = new Date(props.info.startDate);

  return (
    <ion-row class="modal-data">
      <ion-col>
        <IonText color="dark" class="data-time">
          {translate.getText("DE")} <b>{props.info.startTime}</b>{" "}
          {translate.getText("A")}{" "}
          <b>
            {props.info.endTime} - {translate.getText("STATE_OF_MIND")} :{" "}
            {translate.getText(props.info.mood)}
          </b>
        </IonText>
        <br />
        <IonText color="dark" class="data-text">
          {translate.getText("I_WOKE_UP")} {props.info.nbAwoken}{" "}
          {translate.getText("TIMES")}
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
