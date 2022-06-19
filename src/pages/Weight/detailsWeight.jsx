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
  const [currentDate, ] = useState({ startDate: new Date() });
  //var [dailyWeight, setDailyWeight] = useState(props.poids.dailyPoids);
  var [dailyWeightList, setDailyWeightList] = useState([]);
  var [initialWeight, setInitialWeight] = useState("");
  var [targetWeight, setTargetWeight] = useState("");
  var [targetWeightDate, setTargetWeightDate] = useState("");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
  const [showInputWeight, setShowInputWeight] = useState(false);
  const [isShown, setIsShown] = useState(false);


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


  },[])

  useEffect(() => {
    setBMI(weightService.calculation_BMI(weightService.getSize(), weightService.formatToKG(weightService.getLastWeightInfos(dailyWeightList)[1])));
  },[weightService.formatToKG(weightService.getLastWeightInfos(dailyWeightList)[1]), size]);
  
    return (
    <ion-app class="detailsPoids">
      <HeaderWeight url="/dashboard" id="headerPoids"/>
      <IonContent>
      <IonItemDivider className='alerts'>
        <IonLabel>Paramètrer les alertes</IonLabel> 
        <IonAvatar className='alertsAvtr'>
            <img class='alertsIcon' src="/assets/alerts.png" alt=""/>
        </IonAvatar>
      </IonItemDivider>
      <IonItemDivider className='cibleInfos'>
        <IonItem className='calendar'>
          <IonDatetime />
          <IonIcon className="date-icon" icon={calendar} />
        </IonItem>
        <IonItem className="PoidsCibInfos">
          <IonLabel id="cible" >
            <b className="PoidsCib">
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
            <span data-testid = "targWeightDate" className="dateCible" >
              {weightService.formatDateShape(targetWeightDate, dateFormat)} 
            </span>
          </IonLabel>
        </IonItem>
      </IonItemDivider>
      <IonItemDivider>
        {!isShown &&
        <IonLabel onClick={() => setIsShown(!isShown)}>Afficher le graphique </IonLabel>
        }
         {isShown && 
         <IonLabel onClick={() => setIsShown(!isShown)}>Fermer le graphique </IonLabel>}

      </IonItemDivider>
      {isShown &&
        <TableWeight 
        graphData={dailyWeightList}
        initialWeight={initialWeight} 
        targetWeight={targetWeight}
        targetWeightDate={targetWeightDate}>
        </TableWeight>
      
      }
      <IonItemDivider >
        <IonLabel id="dernierPoidsValue">
          <span>
            Dernier poids entré : {weightService.getLastWeightInfos(dailyWeightList)[1]} {unitWeight === "KG" ? "Kg" : "Lbs"}
          </span> 
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
        <IonLabel id="dernierPoidsDate">
          <span>{weightService.formatDateShape(weightService.getLastWeightInfos(dailyWeightList)[0],dateFormat)}
          </span>&nbsp;
          <span> IMC : {BMI}</span>
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
        <IonLabel id="initialPoidsInfos">
          <span><b>Poids initial : {weightService.formatWeight(initialWeight)}  {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span> 
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
      <IonList className="listHisto">
       { dailyWeightList.map(item => {
         return(
         <IonItem>
           <IonLabel id="historique">
             <span><b>{item.y} {unitWeight === "KG" ? "Kg" : "Lbs"} </b></span>  &nbsp;
             <span> | {weightService.formatDateShape(item.x,dateFormat)} à {weightService.getTime(item.x)}</span>
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