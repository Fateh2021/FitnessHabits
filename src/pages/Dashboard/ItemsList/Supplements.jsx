import React, { useEffect, useState, useRef } from "react";
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
  IonAlert,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonRow,
  IonCol
} from "@ionic/react";
import { menu, arrowDropdownCircle, arrowBack } from "ionicons/icons";
import * as translate from '../../../translate/Translator'
import { toast } from '../../../Toast';
import './Supplements/Supplements.css';


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
  const [afficherMenu, setAfficherMenu] = useState(false);
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
  const [heuresChoisies, setHeuresChoisies] = useState([{heure:""}]);
  const [moisToggle, setMoisToggle] = useState(false);
  const [joursSemaineChoisis, setjoursSemaineChoisis] = useState([]);
  const [joursMoisChoisis, setJoursMoisChoisis] = useState([{ jour: "" }]);
  const [dateDebutChoisie, setDateDebutChoisie] = useState("2000-01-01T00:00");
  const [dateFinChoisie, setDateFinChoisie] = useState("2099-01-01T00:00");
  const [statutActifChoisi, setStatutActifChoisi] = useState(true);

  const heurePriseEstCliqueParUtilisateur = useRef(false);
  const jourPrisEstCliqueParUtilisateur = useRef(false);

  useEffect(() => {
    initSupplements();
  });

  const initSupplements = () => {
    const supplements = JSON.parse(localStorage.getItem('supplements'));

    if (!supplements) {
      localStorage.setItem('supplements', JSON.stringify({listeMedSup: []}));
    }
  }

  const mettreAJourListeMedSup = () => {
    const userUID = localStorage.getItem('userUid');
    const supplements = JSON.parse(localStorage.getItem('supplements'));

    firebase.database().ref('supplements/' + userUID).once('value').then((dataSnapshot) => {
      if (dataSnapshot.exists()) {
        let supplementsBd = dataSnapshot.val();
        if(supplementsBd.listeMedSup) {
          supplements.listeMedSup = supplementsBd.listeMedSup;
          localStorage.setItem('supplements', JSON.stringify(supplements));
        }
      }
    });
  }

  const handleSave = () => {
    if (!donneesAjoutSontValides()) {
      return toast(translate.getText("SUPPL_AJOUT_ERREUR"));
    }

    mettreAJourListeMedSup();

    const supplements = JSON.parse(localStorage.getItem('supplements'));

    let nouveauSupp = {};

    nouveauSupp.nomChoisi = nomChoisi;
    nouveauSupp.typeChoisi = typeChoisi;
    nouveauSupp.quantiteChoisie = quantiteChoisie;
    nouveauSupp.formatDoseChoisi = formatDoseChoisi;
    nouveauSupp.restrictionsChoisies = restrictionsChoisies;
    nouveauSupp.nombreDosesChoisi = nombreDosesChoisi;
    //nouveauSupp.nombreFrequenceDosesChoisie = nombreFrequenceDosesChoisie;
    //nouveauSupp.frequenceDosesChoisie = frequenceDosesChoisie;
    nouveauSupp.heuresChoisies = heuresChoisies;
    if(joursSemaineChoisis){
      nouveauSupp.joursSemaineChoisis = joursSemaineChoisis;
    } else {
      nouveauSupp.joursMoisChoisis = joursMoisChoisis;
    }
    nouveauSupp.dateDebutChoisie = dateDebutChoisie;
    nouveauSupp.dateFinChoisie = dateFinChoisie;
    nouveauSupp.statutActifChoisi = statutActifChoisi;

    supplements.listeMedSup = [...supplements.listeMedSup, nouveauSupp];

    localStorage.setItem('supplements', JSON.stringify(supplements));
    const userUID = localStorage.getItem('userUid');

    if(!userUID) {
      return toast(translate.getText("SUPPL_ERREUR_CONNEXION"));
    }

    firebase.database().ref('supplements/' + userUID).update(supplements);
  
    setFormulaireAjoutEstAffiche(false);
    toast(translate.getText("DATA_SAVED"));
  }

  const donneesAjoutSontValides = () => {
    return nomChoisi && typeChoisi && quantiteChoisie && formatDoseChoisi && nombreDosesChoisi && 
          {/*nombreFrequenceDosesChoisie && frequenceDosesChoisie */}&& (heuresChoisies && heuresChoisies.length > 0) &&
          ((joursSemaineChoisis && joursSemaineChoisis.length > 0) || (joursMoisChoisis && joursMoisChoisis.length > 0))&& dateDebutChoisie && dateFinChoisie;
  }

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

  function ajouterHeure(){
    setHeuresChoisies([...heuresChoisies, {heure:""}]);
  }

  function supprimerHeure(indexHeure){
    setHeuresChoisies(heuresChoisies.filter((_heureCourante, indexCourant) => indexCourant !== indexHeure));
  }

  function gererChangementValeurHeureChoisie(indexHeure, nouvelleHeure, cibleOrigineEvenement) {
    //Le ionChangeEvent est lancé lorsque l'on supprime l'une des heures choisies, la mise à jour
    //des heures choisies ne doit pas être faite une deuxième fois après une suppression.
    if(heurePriseEstCliqueParUtilisateur.current) {
      mettreAJourHeuresChoisies(indexHeure, nouvelleHeure)
      heurePriseEstCliqueParUtilisateur.current = false;
    }
  }

  function mettreAJourHeuresChoisies(indexHeure, nouvelleHeure) {
    setHeuresChoisies(heuresChoisies.map((heureCourante, indexCourant) => 
    {
      if(indexCourant === indexHeure) {
        heureCourante.heure = nouvelleHeure;
      }
      return heureCourante;
    }));
  }

  function gererClicHeurePrise() {
    heurePriseEstCliqueParUtilisateur.current = true;
  }

  function ajouterJour() {
    setJoursMoisChoisis([...joursMoisChoisis, { jour: "" }]);
  }
  function supprimerJour(indexJour) {
    setJoursMoisChoisis(joursMoisChoisis.filter((_jourCourant, indexCourant) => indexCourant !== indexJour));
  }


  function gererChangementValeurJourChoisi(indexJour, nouveauJour, cibleOrigineEvenement) {
    if(jourPrisEstCliqueParUtilisateur.current) {
      mettreAJourjoursChoisis(indexJour, nouveauJour)
      jourPrisEstCliqueParUtilisateur.current = false;
    }
  }


  function mettreAJourjoursChoisis(indexJour, nouveauJour) {
    setJoursMoisChoisis(joursMoisChoisis.map((jourCourant, indexCourant) => {
      if (indexCourant === indexJour) {
        jourCourant.jour = nouveauJour;
      }
      return jourCourant;
    }));
  }

  function gererClicJourPris() {
    jourPrisEstCliqueParUtilisateur.current = true;
  }

  return (
    <div>
      <IonItem className="divTitre3">
        <IonItemDivider className="divIconeSupp">
          <div className="iconeSize" data-testid="btn-open" onClick={() => setAfficherMenu(!afficherMenu)}>
            <IonImg src="/assets/pills_blanc_fr.png" />
          </div>
        </IonItemDivider>
        <IonItemDivider class="divInfos">
          <div className="leftInfos">
            <div className="titreSupp">
              {translate.getText("SUPPL_TITLE")}
            </div>
            <div className="supp-text-sm">
              {translate.getText("SUPPL_SECOND_TITLE")}
            </div>
          </div>
          
          <div className="rightInfos">
            <div className="titreSupp">00%</div>
            <div className="supp-text-sm">100%</div>

          </div>
        </IonItemDivider>

      </IonItem>
      <IonModal data-testid="menu" isOpen={afficherMenu}>
          <IonHeader>
            <IonToolbar id="banniereHeader">
              <IonItem color="transparent" lines="none">
                <IonButton fill="clear" onClick={() => setAfficherMenu(!afficherMenu)}>
                  <IonIcon id="iconeRetourMenu" icon={arrowBack}></IonIcon>
                </IonButton>
                <IonTitle id="titreMenu">{translate.getText("SUPPL_TITLE")}</IonTitle>
              </IonItem>
            </IonToolbar>
          </IonHeader>

          <IonContent>
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
                    data-testid="boutonAjouterSupplement"
                    className="arrowDashItem"
                    icon={arrowDropdownCircle}
                    onClick={ () => setFormulaireAjoutEstAffiche(!formulaireAjoutEstAffiche)}
                  />
                </IonItem>

                {formulaireAjoutEstAffiche && <div id="myDIVAjoutSupp1" data-testid="formulaireAjouterSupplement">
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
                          type="number"
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
                          type="number"
                          onIonChange={e => setNombreDosesChoisi(e.detail.value)}></IonInput>
                      </IonItem>
                      {/*
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
                        </IonItem>*/}
                    </IonItemGroup>
                  </IonList>

                <IonItemGroup>
                  <IonLabel color="light">{translate.getText("SUPPL_TIME_TAKEN")}</IonLabel>
                    {heuresChoisies.map((heureCourante, index) => (
                      <IonItemGroup key={index}>
                        <IonRow>
                          <IonCol>
                            <IonItem>  
                              <IonDatetime 
                              displayFormat="HH:mm" 
                              placeholder="00:00"
                              value={heureCourante.heure}
                              slot="start"
                              onClick={() => gererClicHeurePrise()}
                              onIonChange={ e => 
                                gererChangementValeurHeureChoisie(index, e.detail.value, e.explicitOriginalTarget)
                              }
                              >
                                {translate.getText("SUPPL_HEURE_PRISE")}
                              </IonDatetime>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                              <IonButton 
                                size="small"
                                color="danger"
                                onClick={() => supprimerHeure(index)}
                              >
                                {translate.getText("SUPPL_REMOVE_TIME_TAKEN")}
                              </IonButton>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonItemGroup>
                    ))}

                    <IonItem>
                      <IonButton 
                        size="small"
                        onClick = {ajouterHeure}
                      >
                        {translate.getText("SUPPL_ADD_TIME_TAKEN")}
                      </IonButton>
                    </IonItem>
                </IonItemGroup>

                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_LESS_THAN_ONCE_PER_WEEK")}</IonLabel>
                  <IonToggle
                    color="primary"
                    checked={moisToggle}
                    onIonChange={e => {
                      setMoisToggle(e.detail.checked);
                    }} />
                </IonItem>


                { !moisToggle && <div>
                  <IonItemGroup>
                    <IonItem>
                      <IonLabel color="light">{translate.getText("SUPPL_REP")}</IonLabel>

                      <IonSelect
                        multiple="true"
                        onIonChange={e => {
                          setjoursSemaineChoisis(e.detail.value);
                        }}
                      >
                        <IonSelectOption value={translate.getText("SUPPL_MONDAY")}>{translate.getText("SUPPL_MONDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_TUESDAY")}>{translate.getText("SUPPL_TUESDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_WEDNESDAY")}>{translate.getText("SUPPL_WEDNESDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_THURSDAY")}>{translate.getText("SUPPL_THURSDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_FRIDAY")}>{translate.getText("SUPPL_FRIDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_SATURDAY")}>{translate.getText("SUPPL_SATURDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_SUNDAY")}>{translate.getText("SUPPL_SUNDAY")}</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonItemGroup>
                  </div>}

                { moisToggle && <div>
                  <IonItemGroup>
                  <IonLabel color="light">{translate.getText("SUPPL_DAY_OF_INTAKE")}</IonLabel>
                  {joursMoisChoisis.map((jourCourant, index) => (
                    <IonItemGroup key={index}>
                      <IonRow>
                        <IonCol>
                          <IonItem>
                            <IonDatetime
                              displayFormat="DD"
                              placeholder="01"
                              value={jourCourant.jour}
                              slot="start"
                              onClick={() => gererClicJourPris()}
                              onIonChange={ e => 
                                gererChangementValeurJourChoisi(index, e.detail.value, e.explicitOriginalTarget)
                              }

                            >
                              {translate.getText("SUPPL_DAY_OF_THE_MONTH")}
                            </IonDatetime>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonButton
                              size="small"
                              color="danger"
                              onClick={() => supprimerJour(index)}
                            >
                              {translate.getText("SUPPL_REMOVE_DAY")}
                            </IonButton>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonItemGroup>
                  ))}

                  <IonItem>
                    <IonButton
                      size="small"
                      onClick={ajouterJour}
                    >
                      {translate.getText("SUPPL_ADD_DAY")}
                    </IonButton>
                  </IonItem>
                </IonItemGroup>

                </div>}

                
                
                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_DATE_DEBUT")}</IonLabel>
                    <IonDatetime
                      display-timezone="utc"
                      class="timeBox"
                      value = {dateDebutChoisie}
                      max={dateFinChoisie}
                      onIonChange={e => {
                        setDateDebutChoisie(e.detail.value);
                      }}
                      ></IonDatetime>
                      <IonIcon name="calendar" color="black" slot="end"></IonIcon>
                </IonItem>
                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_DATE_FIN")}</IonLabel>
                  <IonDatetime
                    display-timezone="utc"
                    class="timeBox"
                    value = {dateFinChoisie}
                    min={dateDebutChoisie}
                    max="2099"
                    onIonChange={e => {
                      setDateFinChoisie(e.detail.value);
                    }}
                  ></IonDatetime>
                  <IonIcon name="calendar" color="dark" slot="end"></IonIcon>
                </IonItem>

                
                <IonItem>
                  <IonLabel color="light">{translate.getText("SUPPL_ACTIVE")}</IonLabel>
                  <IonToggle 
                  color="primary" 
                  checked={statutActifChoisi}
                  onIonChange={e => {
                    setStatutActifChoisi(e.detail.checked);
                  }}/>
                </IonItem>

                <IonItem>
                  <IonButton type="submit" onClick={handleSave}data-testid="btn-save">{translate.getText("SUPPL_SAVE")}</IonButton>
                </IonItem>
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
            </div>
          </IonContent>
        </IonModal>
    </div>
  );
};
export default Supplements;
