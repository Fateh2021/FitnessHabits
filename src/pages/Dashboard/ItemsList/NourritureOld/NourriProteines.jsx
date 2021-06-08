import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton} from '@ionic/react';
import { arrowDropdownCircle, star, addCircle, removeCircle, trash} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'

import '../../../Tab1.css'

const ProteinesItem = (props) => {

  const [itemDashProteines, setItemDashProteines] = useState({
    id: props.itemDashProteines ? props.itemDashProteines.id : uuid(),
    favoris: props.itemDashProteines ? props.itemDashProteines.favoris : false, 
    name:props.itemDashProteines ? props.itemDashProteines.name : '', 
    qtte:props.itemDashProteines ? props.itemDashProteines.qtte : 0, 
    proteine:props.itemDashProteines ? props.itemDashProteines.proteine : 0, 
    glucide:props.itemDashProteines ? props.itemDashProteines.glucide : 0, 
    fibre:props.itemDashProteines ? props.itemDashProteines.fibre : 0, 
    gras:props.itemDashProteines ? props.itemDashProteines.gras : 0, 
    unit: props.itemDashProteines ? props.itemDashProteines.unit : '',
    consumption: props.itemDashProteines ? props.item.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashProteines({ ...itemDashProteines, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashProteines);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemDashProteines.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashProteines.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashProteines.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Prot" name="proteine" value={itemDashProteines.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashProteines.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashProteines.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashProteines.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

const NourriProteines = (props) => {

  const [dailyTarget, setDailyTarget] = useState(props.proteine.dailyTarget);
  const [proteine, setProteine] = useState(props.proteine);
  const [proteines, setProteines] = useState(props.proteines);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [proteineToEdit, setProteineToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
    console.log("proteines::::" + JSON.stringify (props.proteine))
  }

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyTarget(props.proteine.dailyTarget);
  }, [props.proteine.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(()=>{
    setProteine(props.proteine)
  }, [props.proteine])

  useEffect(()=>{
    setProteines(props.proteines)
  }, [props.proteines])

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...proteines];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    array[item].consumption += 1;
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.proteines.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const DailyConsumptionDecrementProteines = (item)=>{  
    var array = [...proteines];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.proteines.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const totalConsumption = ()=>{
    var array = [...proteines];
    var sum = 0;
    var consumption = 0;
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItemProteines = (item) => {
    var array = [...proteines];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.splice(item, 1): array[item] = item;
    setProteines(array);  
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.proteines.proteines = array;
    dashboard.proteines.dailyTarget.globalConsumption = sum;    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);     
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
    var array = [...proteines];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setProteines (array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (proteines) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.proteines.proteines= proteines;
    setProteines(proteines)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const closeItemContainer = () => {
    setProteineToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setProteineToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img src="/assets/Proteines.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Proteines</b></h2>
        </IonLabel>
        <IonInput className='inputTextNourDasboard' value = {globalConsumption} readonly></IonInput> 
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV5")}/>
      </IonItem> 
      <div id="myDIV5">
      <div className="divHyd">
            <div className="sett">
              { proteines.map((prot, index) => (      
                <IonItem className="divTitre11" key={prot.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{prot.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrementProteines(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {prot.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItemProteines(index)}>
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
        {itemContainerDisplayStatus && <ProteinesItem close={closeItemContainer} item={proteineToEdit} save={(itemDashProteines) => saveItem(itemDashProteines)}/>}        
      </div> 
    </div>    
  );
}
export default NourriProteines;
