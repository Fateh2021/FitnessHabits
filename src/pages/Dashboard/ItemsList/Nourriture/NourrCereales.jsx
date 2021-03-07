import React, {useState, useEffect} from 'react';
import { IonRow, IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar, IonButton} from '@ionic/react';
import { arrowDropdownCircle, addCircle, star, removeCircle, trash} from 'ionicons/icons';
import uuid from 'react-uuid';
import * as firebase from 'firebase'

import '../../../Tab1.css'

const CerealesItem = (props) => {

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

const NourrCereales = (props) => {
  
  const [dailyTarget, setDailyTarget] = useState(props.cereale.dailyTarget);
  const [cereale, setCereale] = useState(props.cereale);
  const [cereales, setCereales] = useState(props.cereales);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [cerealeToEdit, setCerealeToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
    console.log("cereales::::" + JSON.stringify (props.cereale))
  }

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyTarget(props.cereale.dailyTarget);
  }, [props.cereale.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(()=>{
    setCereale(props.cereale)
  }, [props.cereale])

  useEffect(()=>{
    setCereales(props.cereales)
  }, [props.cereales])

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...cereales];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    array[item].consumption += 1;
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.cereales.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const DailyConsumptionDecrement = (item)=>{  
    var array = [...cereales];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    };
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.cereales.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const totalConsumption = ()=>{
    var array = [...cereales];
    var sum = 0;
    var consumption = 0;
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItem = (item) => {
    var array = [...cereales];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.splice(item, 1): array[item] = item;
    setCereales(array);  
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.cereales.cereales = array;
    dashboard.cereales.dailyTarget.globalConsumption = sum;    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);     
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
    var array = [...cereales];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setCereales (array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (cereales) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.cereales.cereales= cereales;
    setCereales(cereales)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const closeItemContainer = () => {
    setCerealeToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setCerealeToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img src="/assets/cereales.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Céréales</b></h2>
        </IonLabel>
        <IonInput className='inputTextNourDasboard' value = {globalConsumption} readonly></IonInput> 
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV3")}/>
      </IonItem> 
      <div id="myDIV3">
      <div className="divHyd">
            <div className="sett">
              { cereales.map((cerea, index) => (      
                <IonItem className="divTitre11" key={cerea.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{cerea.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrement(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {cerea.consumption} readonly></IonInput>  
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
        {itemContainerDisplayStatus && <CerealesItem close={closeItemContainer} item={cerealeToEdit} save={(item) => saveItem(item)}/>}       
      </div> 
    </div>    
  );
}
export default NourrCereales;
