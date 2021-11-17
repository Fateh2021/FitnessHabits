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
import * as translate from '../../../translate/Translator'


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

  const [checked, setChecked] = useState(false);
  const [boxEveryDay, setBoxEveryDay] = useState(false);
  const [posoValue, setPosoValue] = useState("");
  const inputChangeHandler = () => {
    setBoxEveryDay(!boxEveryDay);
    setChecked(!checked);
  };

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      !divElt.style.display || divElt.style.display === "none"
        ? (divElt.style.display = "block")
        : (divElt.style.display = "none");
    }
  };

  function everydayTrue(v){
    v.detail.value === "day" ? setBoxEveryDay(true) :  setBoxEveryDay(false);
    setPosoValue(v.detail.value);
  }


  // block pour avoir l'input pour ajouter des formats
  let [showSelectFormat, setShow] = useState(true);

  const inputAdd = (v) =>{
    if(v.detail.value === "ajouter"){
      setShow(false);
    }else{
      setShow(true);
    }
  };

  function IonSelectDose(props){
    if(props.cond){
      return(
        <IonSelect
                  value={""}
                  placeholder={translate.getText("SUPPL_FORMAT")}
                  className="inputSuppConsom"
                  id="suppSelect"
                  onIonChange={v => inputAdd(v)}
        >
                  <IonSelectOption value="ajouter">{translate.getText("SUPPL_ADD_SELECT")}</IonSelectOption>
                  <IonSelectOption value="gelule">{translate.getText("SUPPL_FORME_CAPSULE")}</IonSelectOption>
                  <IonSelectOption value="comprime">{translate.getText("SUPPL_FORME_TABLET")}</IonSelectOption>
                  <IonSelectOption value="goutte">{translate.getText("SUPPL_FORME_DROP")}</IonSelectOption>
                  <IonSelectOption value="sirop">{translate.getText("SUPPL_FORME_SYROP")}</IonSelectOption>
        </IonSelect>
      )
    }else{
      return (
        <>
        
        <IonInput className="inputSuppConsom"></IonInput>
        <IonButton onClick={() => addFormatToDb()}> OK </IonButton>
        <IonButton onClick={() => setShow(true)}>{translate.getText("SUPPL_CANCEL")}</IonButton>
        
        </>
      )
    }
  }


  //Todo
  function addFormatToDb(format){

    //a la fin faire
    setShow(true);
  }

  return (
    <div>
      <IonItem className="divTitre3">
        <IonAvatar slot="start">
          <img src="/assets/Supp.jpeg" alt="" />
        </IonAvatar>
        <IonLabel>
          <h2>
            <b>{translate.getText("SUPPL_TITLE")}</b>
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
                <b>{translate.getText("SUPPL_ADD")}</b>
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
                <IonLabel color="light">{translate.getText("SUPPL_NOM")}</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_DOSE")}</IonLabel>
                <IonInput className="inputSuppConsom" id="inputDose"></IonInput>
                <IonSelectDose cond={showSelectFormat}></IonSelectDose>
              </IonItem>
              <IonList>
                <IonRadioGroup>
                  <IonItem>
                    <IonLabel color="light">{translate.getText("SUPPL_SUPPPLEMENT")}</IonLabel>
                    <ion-radio slot="start" value="supplement"></ion-radio>
                  </IonItem>
                  <IonItem>
                    <IonLabel color="light">{translate.getText("SUPPL_MEDICAMENT")}</IonLabel>
                    <ion-radio slot="start" value="medicament"></ion-radio>
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_DATE_DEBUT")}</IonLabel>
                <IonDatetime
                  value="2021-10-01T15:43:40.394Z"
                  display-timezone="utc"
                ></IonDatetime>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_DATE_FIN")}</IonLabel>
                <IonDatetime
                  value="2021-12-10T15:43:40.394Z"
                  display-timezone="utc"
                ></IonDatetime>
              </IonItem>
              <IonItem>
                <IonLabel slot="start" color="light">
                {translate.getText("SUPPL_ACTIVE")}
                </IonLabel>
                <IonToggle name="actif" color="success" checked></IonToggle>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_POSOLOGY")}</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
                <IonLabel color="light">{translate.getText("SUPPL_DOSE_BY")}</IonLabel>
                <IonInput className="inputSuppConsom"></IonInput>
                <IonSelect
                  value={posoValue}
                  placeholder={translate.getText("SUPPL_FORMAT")}
                  className="inputSuppConsom"
                  onIonChange={ v => everydayTrue(v) }
                >
                  <IonSelectOption value="hours">{translate.getText("SUPPL_HOURS")}</IonSelectOption>
                  <IonSelectOption value="day">{translate.getText("SUPPL_DAY")}</IonSelectOption>
                  <IonSelectOption value="week">{translate.getText("SUPPL_WEEK")}</IonSelectOption>
                  <IonSelectOption value="month">{translate.getText("SUPPL_MONTH")}</IonSelectOption>
                  
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_EVERY_DAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  slot="start"
                  checked={boxEveryDay}
                  onIonChange={inputChangeHandler}
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_MONDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_TUESDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_WEDNESDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_THURSDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_FRIDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_SATURDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_SUNDAY")}</IonLabel>
                <IonCheckbox
                  color="primary"
                  checked={checked}
                  slot="start"
                ></IonCheckbox>
              </IonItem>
              <IonListHeader>
                <IonLabel color="light">{translate.getText("SUPPL_HOURS")}</IonLabel>
              </IonListHeader>
              <IonList>
                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_MORNING")}</IonLabel>
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
                  <IonLabel color="light">{translate.getText("SUPPL_HALF_DAY")}</IonLabel>
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
                  <IonLabel color="light">{translate.getText("SUPPL_NIGHT")}</IonLabel>
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
                <IonButton color="success">{translate.getText("SUPPL_SAVE")}</IonButton>
                <IonButton color="danger">{translate.getText("SUPPL_CANCEL")}</IonButton>
              </IonItem>
            </IonList>
          </div>
          <IonItem className="trashButton" color="danger">
            <IonAvatar slot="start">
              <img src="/assets/suppl/resumen.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>
                <b>{translate.getText("SUPPL_LIST")}</b>
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
                <b>{translate.getText("SUPPL_DISPLAY_GAPS")}</b>
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
