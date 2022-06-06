import { IonItem, IonText } from "@ionic/react";
import React from "react";

function ElementSommeil(props) {
  return (
    <IonItem>
      <IonText>
        De {props.info.start} a {props.info.end} - reveille en {props.info.mood}{" "}
        <br />
        Durant cette periode, je me suis reveille {props.info.nbAwoken} <br />
        {props.info.day} / {props.info.month} / {props.info.year}
      </IonText>
    </IonItem>
  );
}

export default ElementSommeil;
