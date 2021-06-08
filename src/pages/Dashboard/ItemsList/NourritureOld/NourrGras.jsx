import React, {useState, useEffect}  from "react"
import { IonInput, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle, star, trash, addCircle, removeCircle} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'

import '../../../Tab1.css';


const GrasItem = (props) => {

  const [itemDashGras, setItemDashGras] = useState({
    id: props.itemDashGras ? props.itemDashGras.id : uuid(),
    favoris: props.itemDashGras ? props.itemDashGras.favoris : false, 
    name:props.itemDashGras ? props.itemDashGras.name : '', 
    qtte:props.itemDashGras ? props.itemDashGras.qtte : 0, 
    proteine:props.itemDashGras ? props.itemDashGras.proteine : 0, 
    glucide:props.itemDashGras ? props.itemDashGras.glucide : 0, 
    fibre:props.itemDashGras ? props.itemDashGras.fibre : 0, 
    gras:props.itemDashGras ? props.itemDashGras.gras : 0, 
    unit: props.itemDashGras ? props.itemDashGras.unit : '',
    consumption: props.itemDashGras ? props.itemDashGras.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashGras({ ...itemDashGras, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashGras);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemDashGras.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashGras.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashGrasDashGras.unit} onChange={handleChange}>
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
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashGras.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashGras.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashGras.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

const NourrGras = (props) => {

  const [dailyTarget, setDailyTarget] = useState(props.dailyTarget);
  const [gras, setGras] = useState(props.gras);
  const [grass, setGrass] = useState(props.grass);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [grasToEdit, setGrasToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyTarget(props.dailyTarget);
  }, [props.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(()=>{
    setGras(props.gras)
  }, [props.gras])

  useEffect(()=>{
    setGrass(props.grass)
  }, [props.grass])

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...grass];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    array[item].consumption += 1;
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.gras.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    console.log("array[item].consumption:::" + totalConsumption())
    console.log("dashboard.gras.dailyTarget.globalConsumption):::" + dashboard.gras.dailyTarget.globalConsumption)
  }

  const DailyConsumptionDecrementGras = (item)=>{  
    var array = [...grass];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.gras.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const totalConsumption = ()=>{
    var array = [...grass];
    var sum = 0;
    var consumption = 0;
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItemGras = (item) => {
    var array = [...grass];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.splice(item, 1): array[item] = item;
    setGrass(array);  
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    
    setGlobalConsumption(sum);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.gras.grass = array;
    dashboard.gras.dailyTarget.globalConsumption = sum;  
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);     
    updateCacheAndBD(array);
    console.log("props.parentCallback :::" + dashboard.gras.dailyTarget.globalConsumption)
  }

  const saveItem = (item) => {
    var array = [...grass];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setGrass (array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (grass) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.gras.grass= grass;
    setGrass(grass)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const closeItemContainer = () => {
    setGrasToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setGrasToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }
    
  return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img src="/assets/Gras.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Gras</b></h2>
        </IonLabel>
        <IonInput className='inputTextNourDasboard' value = {globalConsumption} readonly></IonInput> 
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV2")}/>
      </IonItem> 
      <div id="myDIV2">
      <div className="divHyd">
            <div className="sett">
              { grass.map((gra, index) => (      
                <IonItem className="divTitre11" key={gra.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{gra.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrementGras(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {gra.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItemGras(index)}>
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
        {itemContainerDisplayStatus && <GrasItem close={closeItemContainer} item={grasToEdit} save={(itemDashGras) => saveItem(itemDashGras)}/>}       
      </div> 
    </div>    
  );
}
export default NourrGras;