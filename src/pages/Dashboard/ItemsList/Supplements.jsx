import React, { useEffect, useState } from "react";
import firebase from "firebase";
import {
  IonInput,
  IonList,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar,
  IonSelectOption,
  IonSelect,
  IonRadioGroup,
  IonListHeader,
  IonDatetime,
  IonToggle,
  IonCheckbox,
} from "@ionic/react";
import { arrowDropdownCircle } from "ionicons/icons";

import "../../Tab1.css";

const Supplements = (props) => {
  const [supplements, setSupplements] = useState(0);
  const [toDay, setToDaye] = useState({ startDate: new Date() });
  const [currentDate, setCurrentDate] = useState({ startDate: new Date() });
  const [formatedCurrentDate, setFormatedCurrentDate] = useState("");
  const [localday, setLocalday] = useState({
    startDate: new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
  });

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      !divElt.style.display || divElt.style.display === "none"
        ? (divElt.style.display = "block")
        : (divElt.style.display = "none");
    }
  };

  return (
    <div>
      <IonItem className="divTitre3">
        <IonAvatar slot="start">
          <img src="/assets/Supp.jpeg" alt="" />
        </IonAvatar>
        <IonLabel>
          <h2>
            <b>Suppléments</b>
          </h2>
        </IonLabel>
        <IonInput
          className="inputTextGly"
          readonly
          color="danger"
          value={""}
        ></IonInput>
        <IonIcon
          className="arrowDashItem"
          icon={arrowDropdownCircle}
          onClick={() => accor("myDIVSuppl")}
        />
      </IonItem>
      <div id="myDIVSuppl">
        <IonList>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/plus.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>
                <b>Ajouter suppléments/médicaments</b>
              </h2>
            </IonLabel>
            <IonIcon
              className="arrowDashItem"
              icon={arrowDropdownCircle}
              onClick={() => accor("myDIVAjoutSupp1")}
            />
          </IonItem>
          <div id="myDIVAjoutSupp1">
            <IonList>
              <IonItem>
                <IonLabel color="light">Nom</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Dose</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
                <IonSelect
                  value={""}
                  placeholder="Format"
                  className="inputSuppConsom"
                >
                  <IonSelectOption value="gelule">Gélule</IonSelectOption>
                  <IonSelectOption value="comprime">Comprimé</IonSelectOption>
                  <IonSelectOption value="goutte">Goutte</IonSelectOption>
                  <IonSelectOption value="sirop">Sirop</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonList>
                <IonRadioGroup>
                  <IonItem>
                    <IonLabel color="light">Supplément</IonLabel>
                    <ion-radio slot="start" value="supplement"></ion-radio>
                  </IonItem>
                  <IonItem>
                    <IonLabel color="light">Medicament</IonLabel>
                    <ion-radio slot="start" value="medicament"></ion-radio>
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              <IonItem>
                <IonLabel color="light">Date de debut</IonLabel>
                <IonDatetime
                  value="2021-10-01T15:43:40.394Z"
                  display-timezone="utc"
                ></IonDatetime>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Date de fin</IonLabel>
                <IonDatetime
                  value="2021-12-10T15:43:40.394Z"
                  display-timezone="utc"
                ></IonDatetime>
              </IonItem>
              <IonItem>
                <IonLabel slot="start" color="light">
                  Actif
                </IonLabel>
                <IonToggle name="actif" color="success" checked></IonToggle>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Posologie</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
                <IonLabel color="light">Dose par</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
                <IonSelect
                  value={""}
                  placeholder="Format"
                  className="inputSuppConsom"
                >
                  <IonSelectOption value="gelule">Gélule</IonSelectOption>
                  <IonSelectOption value="comprime">Comprimé</IonSelectOption>
                  <IonSelectOption value="goutte">Goutte</IonSelectOption>
                  <IonSelectOption value="cuillereCafe">
                    Cuillère à café
                  </IonSelectOption>
                  <IonSelectOption value="cuillereSoupe">
                    Cuillère à soupe
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Lundi</IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Mardi</IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Mercredi</IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Jeudi</IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Vendredi</IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">
                  Samedi
                </IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">Dimanche</IonLabel>
                <IonCheckbox color="primary" checked slot="start"></IonCheckbox>
              </IonItem>
              <IonListHeader>
                <IonLabel color="light">Heures</IonLabel>
              </IonListHeader>
              <IonList>
                <IonItem>
                  <IonLabel color="light">Matin</IonLabel>
                  <IonDatetime
                    display-format="h:mm A"
                    picker-format="h:mm A"
                    value="1990-02-19T11:00Z"
                  ></IonDatetime>
                  <IonDatetime
                    display-format="h:mm A"
                    picker-format="h:mm A"
                    value="1990-02-19T14:00Z"
                  ></IonDatetime>
                </IonItem>
                <IonItem>
                  <IonLabel color="light">Midi</IonLabel>
                  <IonDatetime
                    display-format="h:mm A"
                    picker-format="h:mm A"
                    value="1990-02-19T17:00Z"
                  ></IonDatetime>
                  <IonDatetime
                    display-format="h:mm A"
                    picker-format="h:mm A"
                    value="1990-02-19T19:00Z"
                  ></IonDatetime>
                </IonItem>
                <IonItem>
                  <IonLabel color="light">Soir</IonLabel>
                  <IonDatetime
                    display-format="h:mm A"
                    picker-format="h:mm A"
                    value="1990-02-19T00:00Z"
                  ></IonDatetime>
                  <IonDatetime
                    display-format="h:mm A"
                    picker-format="h:mm A"
                    value="1990-02-19T03:00Z"
                  ></IonDatetime>
                </IonItem>
              </IonList>
              <IonItem>
                <IonButton color="success">Enregistrer</IonButton>
                <IonButton color="danger">Annuler</IonButton>
              </IonItem>
            </IonList>
          </div>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/resumen.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>
                <b>Lister suppléments/médicaments</b>
              </h2>
            </IonLabel>
            <IonIcon
              className="arrowDashItem"
              icon={arrowDropdownCircle}
              onClick={""}
            />
          </IonItem>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/ecart.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>
                <b>Afficher les écarts</b>
              </h2>
            </IonLabel>
            <IonIcon
              className="arrowDashItem"
              icon={arrowDropdownCircle}
              onClick={""}
            />
          </IonItem>
        </IonList>
      </div>
    </div>
  );
};
export default Supplements;
