import React, {useState, useEffect} from 'react';
import {IonItem, IonList, IonAvatar, IonLabel, IonIcon, IonInput} from '@ionic/react';
import NourrGras from './/NourrGras'
import NourrCereales from './NourrCereales'
import NourriLegumes from './NourriLegumes'
import NourriProteines from './NourriProteines'
import { arrowDropdownCircle } from 'ionicons/icons';


const Nourriture = (props) => {
  
  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [nourriture, setNourriture] = useState(0);
  //
  const [dailyTargetGras, setDailyTargetGras] = useState(props.gras.dailyTarget);
  const [gras, setGras] = useState(props.gras);
  const [grass, setGrass] = useState(props.grass);
  const [globalConsumptionGras, setGlobalConsumptionGras] = useState(props.gras.dailyTarget.globalConsumption);
  //
  const [dailyTargetProteines, setDailyTargetProteines] = useState(props.proteine.dailyTarget);
  const [proteine, setProteine] = useState(props.proteine);
  const [proteines, setProteines] = useState(props.proteines);
  const [globalConsumptionProteines, setGlobalConsumptionProteines] = useState(props.proteine.dailyTarget.globalConsumption);
  //
  const [dailyTargetLegumes, setDailyTargetLegumes] = useState(props.legume.dailyTarget);
  const [legume, setLegume] = useState(props.legume);
  const [legumes, setLegumes] = useState(props.legumes);
  const [globalConsumptionLegumes, setGlobalConsumptionLegumes] = useState(props.legume.dailyTarget.globalConsumption);
  //
  const [dailyTargetCereales, setDailyTargetCereales] = useState(props.cereale.dailyTarget);
  const [cereale, setCereale] = useState(props.cereale);
  const [cereales, setCereales] = useState(props.cereales);
  const [globalConsumptionCereales, setGlobalConsumptionCereales] = useState(props.cereale.dailyTarget.globalConsumption);
  
  //
  // useEffect(()=>{setNourriture()})
  const callbackFunction = (childData) => {setNourriture({nourriture:childData})};
  useEffect(() => { setCurrentDate(props.currentDate);}, [props.currentDate]);
  useEffect(() => { setNourriture(nourriture);}, [nourriture]);

  //
  useEffect(() => {
    setDailyTargetGras(props.gras.dailyTarget);
    setGlobalConsumptionGras(props.gras.dailyTarget.globalConsumption);
    setGras(props.gras);
    setGrass(props.grass)
  }, [props.gras.dailyTarget, props.gras.dailyTarget.globalConsumption, props.gras, props.grass])

  //
  useEffect(() => {
    setDailyTargetProteines(props.proteine.dailyTarget);
    setGlobalConsumptionProteines(props.proteine.dailyTarget.globalConsumption);
    setProteine(props.proteine);
    setProteines(props.proteines);
  }, [props.proteine.dailyTarget, props.proteine.dailyTarget.globalConsumption, props.proteine, props.proteines])

  //
  useEffect(() => {
    setDailyTargetLegumes(props.legume.dailyTarget);
    setGlobalConsumptionLegumes(props.legume.dailyTarget.globalConsumption);
    setLegume(props.legume);
    setLegumes(props.legumes)
  }, [props.legume.dailyTarget, props.legume.dailyTarget.globalConsumption, props.legume, props.legumes])

  //
  useEffect(() => {
    setDailyTargetCereales(props.cereale.dailyTarget);
    setGlobalConsumptionCereales(props.cereale.dailyTarget.globalConsumption);
    setCereale(props.cereale);
    setCereales(props.cereales)
  }, [props.cereale.dailyTarget, props.cereale.dailyTarget.globalConsumption, props.cereale, props.cereales])

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
   }

   

  return (
    <div>
      <IonItem className="divTitre2">
        <IonAvatar slot="start"><img src="/assets/nutrition.jpg" alt=""/></IonAvatar>
        <IonLabel><h2><b>Nourriture</b></h2></IonLabel>
        <IonInput className='inputTextGly' readonly value={nourriture}></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
      </IonItem>
      <div id="myDIV22">
      <IonList>
        <NourrGras parentCallback = {callbackFunction.bind(this)} gras = {gras} grass={grass} currentDate ={currentDate} globalConsumption = {globalConsumptionGras} />
        <NourriProteines proteine = {proteine} proteines={proteines} currentDate ={currentDate} globalConsumption = {globalConsumptionProteines} />
        <NourriLegumes legume={legumes} legumes={legumes} globalConsumption = {globalConsumptionLegumes} currentDate ={currentDate} />
        <NourrCereales cereale = {cereale} cereales={cereales} currentDate ={currentDate} globalConsumption = {globalConsumptionCereales} />
      </IonList>
      </div>
    </div>
          
  );
}
export default Nourriture;