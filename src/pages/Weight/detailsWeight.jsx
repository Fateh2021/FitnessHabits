import React, { useState, useEffect } from "react";
import * as translate from "../../translate/Translator";
import * as weightService from "./configuration/weightService"
import HeaderWeight from "./configuration/header";
import { IonLabel, IonItem, IonItemDivider, IonContent, IonAvatar, IonIcon, IonDatetime, IonList, IonItemGroup} from "@ionic/react";
import { calendar} from "ionicons/icons";
import {create}  from "ionicons/icons"
import TableWeight from "./configuration/TableWeight";

const DetailsWeight = () => {
  const [unitWeight, setUnitWeight] = useState("");
  var [dailyWeightList, setDailyWeightList] = useState([]);
  var [initialWeight, setInitialWeight] = useState("");
  var [targetWeight, setTargetWeight] = useState("");
  var [targetWeightDate, setTargetWeightDate] = useState("");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
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
        <IonLabel id="alertsconfg">{translate.getText("ALERTS_SETUP")}</IonLabel> 
        <IonAvatar className='alertsAvtr'>
            <img className='alertsIcon' src="/assets/alerts.png" alt=""/>
        </IonAvatar>
      </IonItemDivider>
      <IonItemGroup className='cibleInfos'>
        <IonItem className='calendar'>
          <IonDatetime />
          <IonIcon className="date-icon" icon={calendar} />
        </IonItem>
        <IonItem className="PoidsCibInfos">
          <IonLabel id="cible" >
            <b className="targetWeight">
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
            <span data-testid = "targWeightDate" className="targetDate" >
              {weightService.formatDateShape(targetWeightDate, dateFormat)} 
            </span>
          </IonLabel>
        </IonItem>
      </IonItemGroup>
      <IonItemDivider>
        {!isShown &&
        <IonLabel id="graphshowen"  data-testid="showgraph" onClick={() => setIsShown(!isShown)}>{translate.getText("SHOW_GRAPH")} </IonLabel>
        }
         {isShown && 
         <IonLabel id="graphshowen"  data-testid="closegraph" onClick={() => setIsShown(!isShown)}>{translate.getText("CLOSE_GRAPH")}</IonLabel>}

      </IonItemDivider>
      {isShown &&
        <TableWeight 
        graphData={dailyWeightList}
        initialWeight={initialWeight} 
        targetWeight={targetWeight}
        targetWeightDate={targetWeightDate}>
        </TableWeight>
      
      }
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
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
        <IonLabel id="dernierPoidsDate">
          <span  data-testid = "lastWeightDate">{weightService.formatDateShape(weightService.getLastWeightInfos(dailyWeightList)[0],dateFormat)}
          </span>&nbsp;
          <span> {translate.getText("WEIGHT_BMI_ACRONYM")} : </span> 
          <span  data-testid = "imc">{BMI}</span>
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
        <IonLabel id="initialPoidsInfos">
          <span><b> {translate.getText("WEIGHT_INITIAL_NAME")}  : {weightService.formatWeight(initialWeight)} </b></span> 
          <span data-testid = "prefUnit1" ><b> {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span>
        </IonLabel>
      </IonItemDivider>
      <IonItemDivider>
      <IonList className="listHisto">
        
       { dailyWeightList.map(item => {
         return(
         <IonItem className="weightItem" key={item.x}>
           <IonLabel>
             <span id="historiquePoids"><b>{item.y} {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span>&nbsp;
             <span id="historiqueDate">| {weightService.formatDateShape(item.x,dateFormat)} à {weightService.getTime(item.x)}</span>
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