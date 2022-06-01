import React, { useState, useEffect } from "react";
import firebase from "firebase";
import * as weightService from "../../Weight/configuration/weightService"
import * as translate from "../../../translate/Translator";
import { IonInput, IonIcon, IonLabel, IonText, IonItem, IonItemDivider, IonImg, IonAvatar, IonContent} from "@ionic/react";
import { arrowDropdownCircle } from "ionicons/icons";
import "../../../pages/Tab1.css";
import "../../../pages/weight.css";
import TableWeight from "../../Weight/configuration/TableWeight";

const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
        divElt.style.display =  !divElt.style.display || divElt.style.display === "none"? "block": "none";
    }
};

// Variables in Firebase remains in French for now with a translation in comment
const Poids = (props) => {
  // Ajout de cette variable dans le but de vérifier quel était la préférence d'affichage du poids.
  var prefWeight = localStorage.getItem("prefUnitePoids");
  const [unitWeight, setUnitWeight] = useState(prefWeight);
  const [currentDate, ] = useState({ startDate: new Date() });
  var [dailyWeight, setDailyWeight] = useState(props.poids.dailyPoids);
  var [initialWeight, setInitialWeight] = useState("");
  var [targetWeight, setTargetWeight] = useState("");
  var [targetWeightDate, setTargetWeightDate] = useState("");
  const [profile, setProfile] = useState({
    dateFormat: "" });
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
  const userUID = localStorage.getItem("userUid");


  /*
  *** si preference unité poids change ===> on update 
  *** la valeur de poids actuel et de poids cible et de poids initial  
  */
  useEffect(() => {
    var tmp= 0;
    if (prefWeight == "LBS") {
      tmp = props.poids.dailyPoids * 2.2;
    } else {
      tmp = props.poids.dailyPoids;
    }

    setDailyWeight(parseFloat(tmp).toFixed(1));
    
  }, [props.poids.dailyPoids]);
  
  /*
  *** 
  *** update unité de poids as stocked in database 
  *** update la taille as waht existed at database
  *** update imc  dependant la taille et dailypoids
  */
  useEffect(() => {
    weightService.initPrefWeight();
    let preferencesPoidsRef = firebase.database().ref("profiles/" + userUID + "/preferencesPoids");
    preferencesPoidsRef.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setUnitWeight(snapshot.val().unitePoids);
      }
    });

    var size_from_BD = firebase.database().ref("profiles/" + userUID);
    size_from_BD.once("value").then(function (snapshot) {
      if (snapshot.val() != null) {
        setSize(snapshot.val().size);
      }
    });
    console.log(size,dailyWeight);

    setBMI(weightService.calculation_BMI(size, weightService.formatToKG(dailyWeight)));
  });

  /*
  *** update initialweight and targetweight and targetdate as what we have in database   
  */
  
  useEffect(() => {
    const userUID = localStorage.getItem('userUid');
    let preferencesWeightRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids")
    preferencesWeightRef.once("value").then(function(snapshot) {
        if (snapshot.val() != null) {
          // Firebase : poidsInitial = initialWeight
          // Firebase : poidsCible = targetWeight
          let weightIni = weightService.formatWeight(snapshot.val().poidsInitial);
          let weightCib = weightService.formatWeight(snapshot.val().poidsCible);
          setInitialWeight(parseFloat(weightIni));
          setTargetWeight(parseFloat(weightCib));
          setTargetWeightDate(snapshot.val().dateCible);
        }
      })
  }, [])

  useEffect(() => {
    const userUID = localStorage.getItem("userUid");
    firebase.database().ref("profiles/" + userUID).once("value", (snapshot) => {
      const dbProfile = snapshot.val();
      if (dbProfile) {
        setProfile(dbProfile);         
      }
    });
  })



	// Capture of the vent if the weight preference unit changes
  const handleUnitWeightChange = (event) => {
    let newUnitWeight = event.target.value;
    weightService.setPrefUnitWeight(newUnitWeight);
    let oldUnitWeight = unitWeight;
    setUnitWeight(newUnitWeight);

    const dashboard = JSON.parse(localStorage.getItem("dashboard"));
    console.log(dashboard);
    var weightAdjustdaily = 0;
    //var  poidsInit = 0;
    if (oldUnitWeight === "KG" && newUnitWeight === "LBS") {
      weightAdjustdaily = dashboard.poids.dailyPoids * 2.2;
     // poidsInit = dashboard.props.poids.poidsInitial * 2.2;
    } else {
      weightAdjustdaily = dashboard.poids.dailyPoids;
     // poidsInit = dashboard.props.poids.poidsInitial;
    }
		// Then we reduce to one decimal point but using parseFloat to use toFixed
    setDailyWeight(parseFloat(weightAdjustdaily).toFixed(1));
    //setInitialWeight(parseFloat(poidsInit).toFixed(1));
  };

	// Capture de l'éventement si le dailyPoids change
  const handleChange = (event) => {
    let new_dailyWeight = event.detail.value;
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));

		dashboard.poids.dailyPoids = weightService.formatToKG(new_dailyWeight);
    dashboard.poids.datePoids = new Date();
    localStorage.setItem("dashboard", JSON.stringify(dashboard));

		setDailyWeight(new_dailyWeight);
		// On utilise directement la valeur qu'on a sauvé dans le localstorage du dashboard
		setBMI(weightService.calculation_BMI(size, dashboard.poids.dailyPoids));

        firebase
            .database()
            .ref(
                "dashboard/" +
          userUID +
          "/" +
          currentDate.startDate.getDate() +
          (currentDate.startDate.getMonth() + 1) +
          currentDate.startDate.getFullYear()
      )
      .update(dashboard);
  };

  // Capture de l'éventement si IMC change
  const handleBMIChange = (event) => {
    let BMI_Change = event.target.value;
    /* Pour éviter d'avoir des alerts pendant le changement du poids. Exemple 90 pourrait être remplacer pour 85,
       mais pour y arriver, il faut retirer la valeur et saisir 8 et 5 pour 85. Comme c'est plus que 10,
       il fait appel à la fonction afin de valider si l'IMC a changé de catégorie.
    */
    if (BMI_Change > 10) {
      weightService.check_BMI_change(BMI_Change);
    }
  }

    const handleRouteToConfigurationPoids = () => {
        window.location.href = "/configurationPoids";
    };

  return (
    <div>
      <IonItem className="divTitre9" lines="none">
          <IonItemDivider className="divIcone">
            <div className="icone"  onClick={handleRouteToConfigurationPoids}>
              <IonImg  src="/assets/Poids.jpg"/>
            </div>
          </IonItemDivider>
          <IonItemDivider  className="divInfos">
            <IonContent className="leftContentInfos">
              <div  className="titrePoids">
                <IonText>
                    {translate.getText("WEIGHT_NAME_SECTION")}
                </IonText>
              </div>
              <div className="divPoidsCib">
                <IonLabel>
                <b className="poidsCib">
                  <span  onChange={handleUnitWeightChange} >
                    {translate.getText("WEIGHT_TARGET_NAME")} : {targetWeight} 
                    {unitWeight === "KG" ? "Kg" : "Lbs"}, </span></b>
                <span className="da">
                  {weightService.formatDateShape(targetWeightDate, profile.dateFormat)} 
                </span>
                </IonLabel>
              </div>
              <div className="titrePoidsIni">
                <IonLabel>
                  <div className="poidsIni">
                    <b>
                      <span> 
                      {translate.getText("WEIGHT_INITIAL_NAME")} : </span>
                    </b>
                    <span>
                      {initialWeight} {unitWeight === "KG" ? "Kg" : "Lbs"}
                    </span>
                    </div>
                </IonLabel>
              </div>
            </IonContent>
            <IonContent className="rightContentInfos">
              <div className="dailyPoids">
                <IonLabel>
                  <span onChange={handleChange}>{dailyWeight} </span>
                  <span onChange={handleUnitWeightChange}>{unitWeight === "KG" ? "Kg" : "Lbs"}</span>
                </IonLabel>
              </div>
              <div className="divImc">
                <IonLabel>
                  <span onChange={handleBMIChange}   className="IMC">
                    {translate.getText("WEIGHT_BMI_ACRONYM")} : {BMI == "Infinity" ? "" : BMI}
                  </span>
                </IonLabel>
              </div>
            </IonContent>
          </IonItemDivider>       
      </IonItem>
      <div id="accordeonPoids" className="accordeonPoids">
        <TableWeight></TableWeight>
      </div>
    </div>
  );
};
export default Poids;