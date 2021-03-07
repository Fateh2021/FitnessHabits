import React, {useState, useEffect} from "react"
import { IonInput, IonButton, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import { arrowDropdownCircle, star, trash, addCircle, removeCircle} from 'ionicons/icons';
import uuid from 'react-uuid';
import * as firebase from 'firebase'

import '../../Tab1.css';

const AlcoolItem = (props) => {

  const [item, setItem] = useState({
    id: props.item ? props.item.id : uuid(),
    favoris: props.item ? props.item.favoris : false, 
    name:props.item ? props.item.name : '', 
    qtte:props.item ? props.item.qtte : 0, 
    proteine:props.item ? props.item.proteine : 0, 
    glucide:props.item ? props.item.glucide : 0, 
    fibre:props.item ? props.item.fibre : 0, 
    gras:props.item ? props.item.gras : 0, 
    unit: props.item ? props.item.unit : '',
    consumption: props.item ? props.item.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  }

  const saveChanges = () => {
    console.log("save changes::"+JSON.stringify(item))
    props.save(item);
  }

  return (
    <div id="divPopUp1-1">
        <button className="buttonOK" onClick={saveChanges}>OK</button>
        <span className="buttonCloseEdit" onClick={() => props.close()}>X</span>                       
        <IonItem  className="divAdd">
          <IonCol size="1">
            <IonIcon className="starFavoris" icon={star}/>
          </IonCol>
          <IonCol size="3">
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={item.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={item.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={item.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Prot" name="proteine" value={item.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={item.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={item.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={item.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

const Alcool = (props) => {
  //---- Header alcool ---------
  const [dailyTarget, setDailyTarget] = useState(props.alcool.dailyTarget);
  const [alcool, setAlcool] = useState(props.alcools);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.alcool.dailyTarget);
  }, [props.alcool.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(() => {
    setAlcool(props.alcools);
  }, [props.alcools])
  
  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

//---- Items alcool ---------
  //const [consumption, setConsumption] = useState(props.alcool.alcools.consumption);
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    array[item].consumption += 1;

    updateCacheAndBD(array);

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  
    console.log('currentDate :::::' + currentDate.startDate.getMonth())
  }

  const DailyConsumptionDecrement = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    };
    updateCacheAndBD(array);

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  
    console.log('currentDate :::::' + currentDate.startDate.getMonth())
  }

  const totalConsumption = ()=>{
    var array = [...alcool];
    var sum = 0;
    var consumption = 0;
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    console.log ("la somme ::::: " + sum);
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItem = (item) => {
    var array = [...alcool];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    console.log("index :::::" + array[item].id);
    index === -1 ? array.splice(item, 1): array[item] = item;
    setAlcool(array);  
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);

    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.alcools = array;
    dashboard.alcool.dailyTarget.globalConsumption = sum;    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
     
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
    var array = [...alcool];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setAlcool (array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  // const [localday, setLocalday] = useState ({startDate:new Date (currentDate.startDate)});

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  const updateCacheAndBD = (alcools) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.alcool.alcools= alcools;
    console.log("dashboard.alcool.alcools:::::" + JSON.stringify( dashboard))
    setAlcool(alcools)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    console.log("props.currentDate.startDate.getDay())::::::" + props.currentDate.startDate.getDay());
    console.log ("currentDate.startDate" + currentDate.startDate.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    }))
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  return (
  <div>
    <IonItem className="divTitre8">
      <IonAvatar slot="start">
        <img src="/assets/Alcool.jpg" alt=""/>
      </IonAvatar>
      <IonLabel><h2><b>Alcool</b></h2></IonLabel>
      <IonInput className='inputTextGly' value = {globalConsumption} readonly></IonInput> 
      <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV8")}/>
    </IonItem>          
    <div id="myDIV8">
    <div> 
          <div className="divHyd">
            <div className="sett">
              { alcool.map((alco, index) => (      
                <IonItem className="divTitre11" key={alco.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{alco.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrement(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {alco.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItem(index)}>
                    <IonIcon  icon={trash} />
                  </IonButton>
                </IonItem>
                ))
              } 
            </div>
          </div>
          <div className="ajoutBotton">    
            <IonButton className="ajoutbreuvage1" color="danger" size="small" onClick={() => openAddItemContainer()}>
            <IonIcon icon={addCircle}/><label className="labelAddItem">breuvage</label></IonButton>
          </div>
          {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={hydrateToEdit} save={(item) => saveItem(item)}/>}   
        </div>        
    </div>
  </div>  
  );
}
export default Alcool;