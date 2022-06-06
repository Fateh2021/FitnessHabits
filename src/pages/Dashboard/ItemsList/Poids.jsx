import React, { useState, useEffect } from "react";
import firebase from "firebase";
import * as weightService from "../../Weight/configuration/weightService"
import * as translate from "../../../translate/Translator";
import { IonInput, IonIcon, IonLabel, IonText, IonItem, IonItemDivider, IonImg, IonAvatar, IonContent} from "@ionic/react";
import { arrowDropdownCircle } from "ionicons/icons";
import "../../../pages/Tab1.css";
import "../../../pages/weight.css";
import TableWeight from "../../Weight/configuration/TableWeight";
import WeightInput from "../../Weight/WeightInput";

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
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
  const [showInputWeight, setShowInputWeight] = useState(false);


  /*
  ***********************************************************************
  ** update the daily weight value if the favorite unit change
  ***********************************************************************
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
  ***********************************************************************
  ** get favorite unite weight form database and set it to localstorage 
  ** get size value form database and set it to localstorage
  ** calculate the BMI value 
  ***********************************************************************
  */
  useEffect(() => {

    weightService.initPrefWeight();
    weightService.initSize();
    setUnitWeight(localStorage.getItem("prefUnitePoids"));
    setSize(localStorage.getItem("taille"));
    setBMI(weightService.calculation_BMI(size, weightService.formatToKG(dailyWeight)));
  },[dailyWeight]);



   /*
  ***********************************************************************
  ** get weight values (initial, target) form database and set them to 
  ** localstorage 
  ** get target weight date form database and set it to localstorage
  ***********************************************************************
  */
  useEffect(() => {
    weightService.initWeights()
    setInitialWeight(localStorage.getItem("poidsInitial"));
    setTargetWeight(localStorage.getItem("poidsCible"));
    setTargetWeightDate(localStorage.getItem("dateCible"));
  }, [])

   /*
  ***********************************************************************
  ** get the favorite date format form database and set it to 
  ** localstorage 
  ** update the date format 
  ***********************************************************************
  */
  useEffect(() => {
    weightService.initPrefDate();
    let format = localStorage.getItem("prefDateFormat");
    format = format.replace(/y/gi, 'Y');
    format = format.replace(/L/gi, 'M');
    format = format.replace(/d/gi, 'D');
    setDateFormat(format);
  }, []);

  useEffect(() => {
    let format = weightService.getPrefDate();
    format = format.replace(/y/gi, 'Y');
    format = format.replace(/L/gi, 'M');
    format = format.replace(/d/gi, 'D');
    setDateFormat(format);
  }, [props.formatedCurrentDate]);


/*
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
*/

  /*
  ***********************************************************************
  ** handle the event if daily weight change
  ***********************************************************************
  */
  const handleChange = (newWeight) => {
    weightService.updateWeightDashboard(newWeight, currentDate)
    
		setDailyWeight(parseFloat(newWeight).toFixed(1));
		// On utilise directement la valeur qu'on a sauvé dans le localstorage du dashboard
		setBMI(weightService.calculation_BMI(size, weightService.formatToKG(newWeight)));
    
    setShowInputWeight(false)
  };

  /*
  ***********************************************************************
  ** update the favorite unit weight
  ***********************************************************************
  */
  const adjustUnit = (newUnit) => {
    setUnitWeight(newUnit);

  } 

/* 
  // Capture de l'éventement si IMC change
  const handleBMIChange = (event) => {
    let BMI_Change = event.target.value;
    /* Pour éviter d'avoir des alerts pendant le changement du poids. Exemple 90 pourrait être remplacer pour 85,
       mais pour y arriver, il faut retirer la valeur et saisir 8 et 5 pour 85. Comme c'est plus que 10,
       il fait appel à la fonction afin de valider si l'IMC a changé de catégorie.
    
    if (BMI_Change > 10) {
      weightService.check_BMI_change(BMI_Change);
    }
  }

  const handleRouteToConfigurationPoids = () => {
        window.location.href = "/configurationPoids";
  };
*/

  return (
    <div>
      <IonItem className="divTitre9" lines="none">
          <IonItemDivider className="divIcone">
            <div data-testid = "openModal" className="icone"  onClick={() => setShowInputWeight(true)}>
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
                  <span>
                    {translate.getText("WEIGHT_TARGET_NAME")} :
                  </span>
                  &nbsp;
                  <span data-testid = "targWeight">
                     {weightService.formatWeight(targetWeight)}
                  </span>
                  &nbsp;
                  <span>
                    {unitWeight === "KG" ? "Kg" : "Lbs"}, 
                  </span>
                </b>
                &nbsp;
                <span data-testid = "targWeightDate">
                  {weightService.formatDateShape(targetWeightDate, dateFormat)} 
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

                    <span  data-testid = "initWeight">
                      { weightService.formatWeight(initialWeight)}
                    </span>
                    &nbsp;
                    <span data-test-id = "prefUnit">{unitWeight === "KG" ? "Kg" : "Lbs"}
                    </span>
                    </div>
                </IonLabel>
              </div>
            </IonContent>
            <IonContent className="rightContentInfos">
              <div className="dailyPoids">
                <IonLabel>
                  <span data-testid = "dlyPoids">{dailyWeight}</span>
                  &nbsp;
                  <span data-testid = "prefUnit">{unitWeight === "KG" ? "Kg" : "Lbs"}</span>
                </IonLabel>
              </div>
              <div className="divImc">
                <IonLabel>
                  <span  className="IMC">
                    {translate.getText("WEIGHT_BMI_ACRONYM")} :
                  </span>
                  &nbsp;
                  <span  className="IMC" data-testid = "imc">
                     {BMI == "Infinity" ? "" : BMI}
                  </span>
                </IonLabel>
              </div>
            </IonContent>
          </IonItemDivider> 
          <WeightInput
            dailyWeight={dailyWeight} 
            onSubmit={handleChange} 
            setDailyWeight={setDailyWeight} 
            showInputWeight={showInputWeight} 
            setShowInputWeight={setShowInputWeight}
            adjustUnit = {adjustUnit}
            dateFormat = {dateFormat}
            currentDate = {props.currentDate}
          ></WeightInput>      
      </IonItem>
      
      <div id="accordeonPoids" className="accordeonPoids">
        <TableWeight></TableWeight>
      </div>
    </div>
  );
};
export default Poids;