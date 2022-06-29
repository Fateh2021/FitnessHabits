import React, { useState, useEffect } from "react";
import * as translate from "../../translate/Translator";
import * as weightService from "./configuration/weightService"
import HeaderWeight from "./configuration/header";
import { arrowDropdownCircle } from 'ionicons/icons';
import { IonLabel, IonItem, IonItemDivider, IonImg, IonContent, IonAvatar, IonIcon, IonDatetime, IonList} from "@ionic/react";
import { calendar} from "ionicons/icons";
import {create}  from "ionicons/icons"
import TableWeight from "./configuration/TableWeight";

import InitializationWeight from "./configuration/Initialisation";

const DetailsWeight = (props) => {
  const [unitWeight, setUnitWeight] = useState("");
<<<<<<< HEAD
  const [currentDate, ] = useState({ startDate: new Date() });
  //var [dailyWeight, setDailyWeight] = useState(props.poids.dailyPoids);
=======
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
  var [dailyWeightList, setDailyWeightList] = useState([]);
  var [initialWeight, setInitialWeight] = useState("");
  var [targetWeight, setTargetWeight] = useState("");
  var [targetWeightDate, setTargetWeightDate] = useState("");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
<<<<<<< HEAD
  const [showInputWeight, setShowInputWeight] = useState(false);
  const [isShown, setIsShown] = useState(false);


=======
  const [isShown, setIsShown] = useState(false);

>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
  useEffect(() => {
    weightService.initProfile().then(() => {
      //unit pref
      setUnitWeight(weightService.getPrefUnitWeight());
      //size
      setSize(weightService.getSize());
      // initila poids
      setInitialWeight(weightService.getInitialWeight);
      // poids cible
      setTargetWeight(weightService.getTargetWeight);
      // date poids cible 
      setTargetWeightDate(weightService.getTargetWeightDate);

      let format = weightService.getPrefDate();
      format = format.replace(/y/gi, 'Y');
      format = format.replace(/L/gi, 'M');
      format = format.replace(/d/gi, 'D');
      setDateFormat(format);
    });
  },[]);

  useEffect(()=> {
    weightService.initDailyPoidsList().then(()=>{
      setDailyWeightList(weightService.getDailyWeightList());
    })
<<<<<<< HEAD


  },[])
=======
  },[])


>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8

  useEffect(() => {
    setBMI(weightService.calculation_BMI(weightService.getSize(), weightService.formatToKG(weightService.getLastWeightInfos(dailyWeightList)[1])));
  },[weightService.formatToKG(weightService.getLastWeightInfos(dailyWeightList)[1]), size]);
  
    return (
    <ion-app class="detailsPoids">
      <HeaderWeight url="/dashboard" id="headerPoids"/>
      <IonContent>
      <IonItemDivider className='alerts'>
<<<<<<< HEAD
        <IonLabel>Paramètrer les alertes</IonLabel> 
=======
        <IonLabel id="alertsconfg">{translate.getText("ALERTS_SETUP")}</IonLabel> 
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
        <IonAvatar className='alertsAvtr'>
            <img className='alertsIcon' src="/assets/alerts.png" alt=""/>
        </IonAvatar>
      </IonItemDivider>
      <IonItemDivider className='cibleInfos'>
        <IonItem className='calendar'>
          <IonDatetime />
          <IonIcon className="date-icon" icon={calendar} />
        </IonItem>
        <IonItem className="PoidsCibInfos">
          <IonLabel id="cible" >
<<<<<<< HEAD
            <b className="PoidsCib">
=======
            <b className="targetWeight">
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
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
<<<<<<< HEAD
            <span data-testid = "targWeightDate" className="dateCible" >
=======
            <span data-testid = "targWeightDate" className="targetDate" >
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
              {weightService.formatDateShape(targetWeightDate, dateFormat)} 
            </span>
          </IonLabel>
        </IonItem>
      </IonItemDivider>
      <IonItemDivider>
        {!isShown &&
<<<<<<< HEAD
        <IonLabel onClick={() => setIsShown(!isShown)}>Afficher le graphique </IonLabel>
        }
         {isShown && 
         <IonLabel onClick={() => setIsShown(!isShown)}>Fermer le graphique </IonLabel>}
=======
        <IonLabel id="graphshowen"  data-testid="showgraph" onClick={() => setIsShown(!isShown)}>{translate.getText("SHOW_GRAPH")} </IonLabel>
        }
         {isShown && 
         <IonLabel id="graphshowen"  data-testid="closegraph" onClick={() => setIsShown(!isShown)}>{translate.getText("CLOSE_GRAPH")}</IonLabel>}
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8

      </IonItemDivider>
      {isShown &&
        <TableWeight 
        graphData={dailyWeightList}
        initialWeight={initialWeight} 
        targetWeight={targetWeight}
        targetWeightDate={targetWeightDate}>
        </TableWeight>
      
      }
<<<<<<< HEAD
      <IonItemDivider >
        <IonLabel id="dernierPoidsValue">
          <span>
            Dernier poids entré : {weightService.getLastWeightInfos(dailyWeightList)[1]} {unitWeight === "KG" ? "Kg" : "Lbs"}
          </span> 
=======
      <IonItemDivider className="lastWeight">
        <IonLabel id="dernierPoidsValue">
          <span>
            {translate.getText("LAST_WEIGHT")} :
          </span>&nbsp;
          <span data-testid = "lastWeightValue">
            {weightService.getLastWeightInfos(dailyWeightList)[1]}
          </span>&nbsp;
          <span data-testid = "prefUnit">
            {unitWeight === "KG" ? "Kg" : "Lbs"}
          </span>
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
        <IonLabel id="dernierPoidsDate">
<<<<<<< HEAD
          <span>{weightService.formatDateShape(weightService.getLastWeightInfos(dailyWeightList)[0],dateFormat)}
          </span>&nbsp;
          <span> IMC : {BMI}</span>
=======
          <span  data-testid = "lastWeightDate">{weightService.formatDateShape(weightService.getLastWeightInfos(dailyWeightList)[0],dateFormat)}
          </span>&nbsp;
          <span> {translate.getText("WEIGHT_BMI_ACRONYM")} : </span> 
          <span  data-testid = "imc">{BMI}</span>
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
        <IonLabel id="initialPoidsInfos">
<<<<<<< HEAD
          <span><b>Poids initial : {weightService.formatWeight(initialWeight)}  {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span> 
=======
          <span><b> {translate.getText("WEIGHT_INITIAL_NAME")}  : {weightService.formatWeight(initialWeight)} </b></span> 
          <span data-testid = "prefUnit1" ><b> {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span>
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
      <IonList className="listHisto">
<<<<<<< HEAD
       { dailyWeightList.map(item => {
         return(
         <IonItem className="weightItem" key={item.x}>
           <IonLabel className="historique">
             <span><b>{item.y} {unitWeight === "KG" ? "Kg" : "Lbs"} </b></span>  &nbsp;
             <span> | {weightService.formatDateShape(item.x,dateFormat)} à {weightService.getTime(item.x)}</span>
=======
        
       { dailyWeightList.map(item => {
         return(
         <IonItem className="weightItem" key={item.x}>
           <IonLabel>
             <span id="historiquePoids"><b>{item.y} {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span>&nbsp;
             <span id="historiqueDate">| {weightService.formatDateShape(item.x,dateFormat)} à {weightService.getTime(item.x)}</span>
>>>>>>> 02420d7f354191b8e08e2b993bac473ebb32e5a8
             <span>
               <IonAvatar className='pencilAvtr'><IonIcon className="test" icon={create} /></IonAvatar>
              </span>
           </IonLabel>
         </IonItem>
         )
       })}
       </IonList>

      </IonItemDivider>
      
        
      </IonContent>
    </ion-app>
    );

}
export default DetailsWeight;