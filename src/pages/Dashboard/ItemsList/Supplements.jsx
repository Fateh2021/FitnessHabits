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
  IonItemGroup,
  IonItemDivider,
  IonAlert 
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

  const [moduleSupplementsEstAffiche, setModuleSupplementsEstAffiche] = useState(false);
  const [formulaireAjoutEstAffiche, setFormulaireAjoutEstAffiche] = useState(false);
  const [checked, setChecked] = useState(false);
  const [boxEveryDay, setBoxEveryDay] = useState(false);
  const [posoValue, setPosoValue] = useState("");
  const [afficherAlerteAjoutRestriction, setAfficherAlerteAjoutRestriction] = useState(false);
  const [afficherAlerteAjoutFormatDose, setAfficherAlerteAjoutFormatDose] = useState(false);
  const [formatsDose, setFormatsDose] = useState([
                                          translate.getText("SUPPL_FORME_TABLET"),
                                          translate.getText("SUPPL_FORME_CAPSULE"),
                                          translate.getText("SUPPL_FORME_SIROP"),
                                          translate.getText("SUPPL_FORME_DROP"),
                                          translate.getText("SUPPL_FORMAT_BOUTEILLE"),
                                          translate.getText("SUPPL_FORMAT_GEL"),
                                          translate.getText("SUPPL_FORMAT_INJECTION")
                                            ]);
  const [restrictions, setRestrictions] = useState([
                                          {valeur: translate.getText("SUPPL_RESTRICTION_JEUN"), estCoche: false},
                                          {valeur: translate.getText("SUPPL_RESTRICTION_MANGEANT"), estCoche: false}]);
  const [nomChoisi, setNomChoisi] = useState("");
  const [typeChoisi, setTypeChoisi] = useState("");
  const [quantiteChoisie, setQuantiteChoisie] = useState("");
  const [formatDoseChoisi, setFormatDoseChoisi] = useState("");
  const [restrictionsChoisies, setRestrictionsChoisies] = useState([]);
  const [nombreDosesChoisi, setNombreDosesChoisi] = useState("");
  const [nombreFrequenceDosesChoisie, setNombreFrequenceDosesChoisi] = useState("");
  const [frequenceDosesChoisie, setFrequenceDosesChoisie] = useState("");

  {/* Variable formulaire 2e partie*/}
  const [heuresChoisies, setHeuresChoisies] = useState([]);
  const [joursChoisis, setJoursChoisis] = useState([]);
  const [dateDebutChoisie, setDateDebutChoisie] = useState("");
  const [dateFineChoisie, setDateFinChoisie] = useState("");
  const [statutActifChoisi, setStatutActifChoisi] = useState(false);



  const inputChangeHandler = () => {
    setBoxEveryDay(!boxEveryDay);
    setChecked(!checked);
  };

  function everydayTrue(v){
    v.detail.value === "day" ? setBoxEveryDay(true) :  setBoxEveryDay(false);
    setPosoValue(v.detail.value);
    setFrequenceDosesChoisie(v.detail.value);
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
                  <IonSelectOption value="sirop">{translate.getText("SUPPL_FORME_SIROP")}</IonSelectOption>
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



  //block pour les période

  function PeriodButton(props){

    let [colorPeriod, setColorPeriod] = useState("light");

    function changeColor(){
      
      return colorPeriod === "light" ? setColorPeriod("medium") : setColorPeriod("light") ;
    }

    return <IonButton class="selectPeriod" color={colorPeriod} onClick={changeColor}>{props.name}</IonButton>

  }

  function mettreAJourRestrictionsChoisies(valeurRestriction, estCochee) {
    setRestrictions(restrictions.map(restrictionCourante => 
      {
        if(restrictionCourante.valeur === valeurRestriction) {
          restrictionCourante.estCoche = estCochee;
        }
        return restrictionCourante;
      }));

    if (estCochee) {
      setRestrictionsChoisies(restrictionsChoisiesCourantes => [...restrictionsChoisiesCourantes, valeurRestriction]);
    } else {
      setRestrictionsChoisies(restrictionsChoisies.filter(restrictionCourante => restrictionCourante !== valeurRestriction));
    }
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
        <IonInput className='inputTextGly' readonly color="danger" value={""}></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => setModuleSupplementsEstAffiche(!moduleSupplementsEstAffiche)}/>
      </IonItem>
      {moduleSupplementsEstAffiche && <div id="myDIVSuppl">
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
              onClick={ () => setFormulaireAjoutEstAffiche(!formulaireAjoutEstAffiche)}
            />
          </IonItem>
          
          {/* Première partie nouvelle version du formulaire*/}
          {true && formulaireAjoutEstAffiche && <div id="myDIVAjoutSupp1">
            <IonList>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_NOM")}</IonLabel>
                <IonInput className="inputSuppConsom"
                  value={nomChoisi} 
                  onIonChange={e => setNomChoisi(e.detail.value)}></IonInput>
              </IonItem>

              <IonItemGroup>
                <IonItemDivider>
                  <IonLabel color="light">{translate.getText("SUPPL_TYPE")}</IonLabel>
                </IonItemDivider>

                <IonRadioGroup 
                  value={typeChoisi} 
                  onIonChange={e => setTypeChoisi(e.detail.value)}>
                  <IonItem>
                    <IonLabel color="light">{translate.getText("SUPPL_SUPPPLEMENT")}</IonLabel>
                    <ion-radio slot="start" value="supplement"></ion-radio>
                  </IonItem>
                  <IonItem>
                    <IonLabel color="light">{translate.getText("SUPPL_MEDICAMENT")}</IonLabel>
                    <ion-radio slot="start" value="medicament"></ion-radio>
                  </IonItem>
                </IonRadioGroup>
              </IonItemGroup>

              <IonItemGroup>
                <IonItemDivider>
                  <IonLabel color="light">{translate.getText("SUPPL_DOSE")}</IonLabel>
                </IonItemDivider>

                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_QUANTITE")}</IonLabel>
                  <IonInput className="inputSuppConsom" 
                    id="inputDose"
                    value={quantiteChoisie} 
                    onIonChange={e => setQuantiteChoisie(e.detail.value)}></IonInput>
                </IonItem>

                <IonItem>
                  <IonSelect
                      placeholder={translate.getText("SUPPL_FORMAT")}
                      className="inputSuppConsom"
                      id="suppSelect"
                      value={formatDoseChoisi} 
                      onIonChange={e => setFormatDoseChoisi(e.detail.value)}
                    >
                      {formatsDose.map(formatDose => 
                                        <IonSelectOption value={formatDose} key={formatDose}>{formatDose}</IonSelectOption>
                                        )}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonButton
                    expand="block"
                    onClick={() => setAfficherAlerteAjoutFormatDose(true)}
                  >
                    {translate.getText("SUPPL_AJOUTER_FORMAT")}
                  </IonButton>
                  <IonAlert
                    isOpen={afficherAlerteAjoutFormatDose}
                    onDidDismiss={() => setAfficherAlerteAjoutFormatDose(false)}
                    header={translate.getText("SUPPL_NOUVEAU_FORMAT")}
                    inputs={[
                      {
                        name: "nouveauFormat",
                        type: "text"
                      }]}
                    buttons={[
                      {
                        text: translate.getText("SUPPL_CANCEL"),
                        role: "cancel",
                      },
                      {
                        text: translate.getText("SUPPL_ADD_SELECT"),
                        handler: (donneesAlerte) => {
                          setFormatsDose(formatsDoseCourants => [...formatsDoseCourants, donneesAlerte.nouveauFormat]);
                        }
                      }
                    ]}
                  />
                </IonItem>

                <IonItemDivider>
                  <IonLabel color="light">{translate.getText("SUPPL_RESTRICTION")}</IonLabel>
                </IonItemDivider>

                {restrictions.map(restriction => 
                                  <IonItem key={restriction.valeur}>
                                    <IonLabel color="light">{restriction.valeur}</IonLabel>
                                    <IonCheckbox
                                      color="primary"
                                      value={restriction.valeur}
                                      checked={restriction.estCoche}
                                      slot="start"
                                      onIonChange={e => mettreAJourRestrictionsChoisies(e.detail.value, e.detail.checked)}
                                    ></IonCheckbox>
                                  </IonItem>
                                      )}

                <IonItem>
                  <IonButton
                    expand="block"
                    onClick={() => setAfficherAlerteAjoutRestriction(true)}
                  >
                    {translate.getText("SUPPL_AJOUTER_RESTRICTION")}
                  </IonButton>
                  <IonAlert
                    isOpen={afficherAlerteAjoutRestriction}
                    onDidDismiss={() => setAfficherAlerteAjoutRestriction(false)}
                    header={translate.getText("SUPPL_NOUVELLE_RESTRICTION")}
                    inputs={[
                      {
                        name: "nouvelleRestriction",
                        type: "text"
                      }]}
                    buttons={[
                      {
                        text: translate.getText("SUPPL_CANCEL"),
                        role: "cancel"
                      },
                      {
                        text: translate.getText("SUPPL_ADD_SELECT"),
                        handler: (donneesAlerte) => {
                          setRestrictions(restrictionsCourantes => [...restrictionsCourantes, {valeur: donneesAlerte.nouvelleRestriction, estCoche: false}]);
                        }
                      }
                    ]}
                  />
                </IonItem>
              </IonItemGroup>

              <IonItemGroup>
                <IonItemDivider>
                  <IonLabel color="light">{translate.getText("SUPPL_POSOLOGY")}</IonLabel>
                </IonItemDivider>

                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_NOMBRE_DOSES")}</IonLabel>
                  <IonInput className="inputSuppConsom"
                    value={nombreDosesChoisi}
                    onIonChange={e => setNombreDosesChoisi(e.detail.value)}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_FREQUENCE_DOSES")}</IonLabel>
                  <IonInput className="inputSuppConsom"
                    value={nombreFrequenceDosesChoisie} 
                    onIonChange={e => setNombreFrequenceDosesChoisi(e.detail.value)}></IonInput>
                  <IonSelect
                    placeholder={translate.getText("SUPPL_FORMAT")}
                    className="inputSuppConsom"
                    value={frequenceDosesChoisie}
                    onIonChange={ v => everydayTrue(v) }
                  >
                    <IonSelectOption value={translate.getText("SUPPL_HOURS")}>{translate.getText("SUPPL_HOURS")}</IonSelectOption>
                    <IonSelectOption value={translate.getText("SUPPL_DAY")}>{translate.getText("SUPPL_DAY")}</IonSelectOption>
                    <IonSelectOption value={translate.getText("SUPPL_WEEK")}>{translate.getText("SUPPL_WEEK")}</IonSelectOption>
                    <IonSelectOption value={translate.getText("SUPPL_MONTH")}>{translate.getText("SUPPL_MONTH")}</IonSelectOption>
                    
                  </IonSelect>
                </IonItem>
              </IonItemGroup>
            </IonList>
          

          {/* Partie 2 */}

          <IonItemGroup>
            <IonItem>
              <IonLabel color="light">{/*TODO : à traduire*/}Heures de prise de la dose</IonLabel>
                <IonDatetime displayFormat="HH:mm" placeholder="00:00">
                </IonDatetime>
            </IonItem>
            <IonButton>
              Ajouter heure de prise
            </IonButton>
          </IonItemGroup>
          
          <IonItemGroup>
            <IonItem>
              <IonLabel color="light">{/*TODO: traduire */}Repetition</IonLabel>

              <IonSelect multiple = "true">
                <IonSelectOption value="monday">Lundi</IonSelectOption>
                <IonSelectOption value="tuesday">Mardi</IonSelectOption>
                <IonSelectOption value="wednesday">Mercredi</IonSelectOption>
                <IonSelectOption value="thursday">Jeudi</IonSelectOption>
                <IonSelectOption value="friday">Vendredi</IonSelectOption>
                <IonSelectOption value="saturday">Samedi</IonSelectOption>
                <IonSelectOption value="Sunday">Dimanche</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton>
                    Ajouter Repetition
            </IonButton>
          </IonItemGroup>

          <IonItem>
            <IonLabel color="light">{translate.getText("SUPPL_DATE_DEBUT")}</IonLabel>
              <IonDatetime
                display-timezone="utc"
                class="timeBox"
                ></IonDatetime>
                <IonIcon name="calendar" color="black" slot="end"></IonIcon>
          </IonItem>
          <IonItem>
            <IonLabel color="light">{translate.getText("SUPPL_DATE_FIN")}</IonLabel>
            <IonDatetime
              display-timezone="utc"
              class="timeBox"
            ></IonDatetime>
            <IonIcon name="calendar" color="dark" slot="end"></IonIcon>
          </IonItem>



          </div>}

            
          {/* Formulaire original */}
          {false && formulaireAjoutEstAffiche && <div id="myDIVAjoutSupp1">
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
                  display-timezone="utc"
                  class="timeBox"
                ></IonDatetime>
              </IonItem>
              <IonItem>
                <IonLabel color="light">{translate.getText("SUPPL_DATE_FIN")}</IonLabel>
                <IonDatetime
                  display-timezone="utc"
                  class="timeBox"
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
                  <PeriodButton name={translate.getText("SUPPL_MORNING")}></PeriodButton>
                  <PeriodButton name={"8:00"}></PeriodButton>
                  <PeriodButton name={"10:00"}></PeriodButton>
                </IonItem>
                <IonItem>
                  <PeriodButton name={translate.getText("SUPPL_HALF_DAY")}></PeriodButton>
                  <PeriodButton name={"14:00"}></PeriodButton>
                  <PeriodButton name={"16:00"}></PeriodButton>
                </IonItem>
                <IonItem>
                  <PeriodButton name={translate.getText("SUPPL_NIGHT")}></PeriodButton>
                  <PeriodButton name={"20:00"}></PeriodButton>
                  <PeriodButton name={"22:00"}></PeriodButton>
                </IonItem>
                <IonItem>
                  <IonButton class="selectPeriod" color="light">{translate.getText("SUPPL_ADD_SELECT")}</IonButton>
                </IonItem>
              </IonList>
              <IonItem>
                <IonButton color="success">{translate.getText("SUPPL_SAVE")}</IonButton>
                <IonButton color="danger">{translate.getText("SUPPL_CANCEL")}</IonButton>
              </IonItem>
            </IonList>
          </div>}
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
            />
          </IonItem>
        </IonList>
      </div>}
    </div>
  );
};
export default Supplements;
