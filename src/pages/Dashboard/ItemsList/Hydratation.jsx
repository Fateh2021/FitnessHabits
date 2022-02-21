import React, {useState, useEffect} from 'react';
import { IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton, IonCol} from '@ionic/react';
import { arrowDropdownCircle, star, trash, addCircle, removeCircle} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'

import '../../../pages/Tab1.css';
//TODO : Execute SonarQube to check the code quality
const HydrateItem = (props) => {

  const [itemDashHydrate, setItemDashHydrate] = useState({
    id: props.itemDashHydrate ? props.itemDashHydrate.id : uuid(),
    favoris: props.itemDashHydrate ? props.itemDashHydrate.favoris : false, 
    name:props.itemDashHydrate ? props.itemDashHydrate.name : '', 
    qtte:props.itemDashHydrate ? props.itemDashHydrate.qtte : 0, 
    proteine:props.itemDashHydrate ? props.itemDashHydrate.proteine : 0, 
    glucide:props.itemDashHydrate ? props.itemDashHydrate.glucide : 0, 
    fibre:props.itemDashHydrate ? props.itemDashHydrate.fibre : 0, 
    gras:props.itemDashHydrate ? props.itemDashHydrate.gras : 0, 
    unit: props.itemDashHydrate ? props.itemDashHydrate.unit : '',
    consumption: props.itemDashHydrate ? props.itemDashHydrate.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashHydrate({ ...itemDashHydrate, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashHydrate);
  }

  return (
    <div id="divPopUp1-1">
        <IonCol size="1">
          <button className="buttonOK" onClick={saveChanges}>OK</button>
        </IonCol>  
        <IonCol size="1">
          <span className="buttonCloseEdit" onClick={() => props.close()}>X</span>
        </IonCol>                
        
        <IonItem  className="divAdd">    
          <IonCol size="1">
            <IonIcon className="starFavoris" icon={star}/>
          </IonCol>
          <IonCol size="3">
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemDashHydrate.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashHydrate.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashHydrate.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1"><div className ="divMacroAdd">Pro</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Pro" name="proteine" value={itemDashHydrate.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1"><div className ="divMacroAdd">Glu</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashHydrate.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1"><div className ="divMacroAdd">Fib</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashHydrate.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1"><div className ="divMacroAdd">Gras</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashHydrate.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

//---- Hydratation ---------
const Hydratation = (props) => {
  const [dailyTarget, setDailyTarget] = useState(props.hydrate.dailyTarget);
  const [hydrate, setHydrate] = useState(props.hydrate);
  const [hydrates, setHydrates] = useState(props.hydrate.hydrates);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
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
    setDailyTarget(props.hydrate.dailyTarget);
  }, [props.hydrate.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(()=>{
    setHydrate(props.hydrate)
  }, [props.hydrate])

  useEffect(()=>{
    setHydrates(props.hydrate.hydrates)
  }, [props.hydrate.hydrates])

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...hydrates];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    array[item].consumption += 1;
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const DailyConsumptionDecrementHydrate = (item)=>{  
    var array = [...hydrates];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const totalConsumption = ()=>{
    var array = [...hydrates];
    var sum = 0;
    var consumption = 0;
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItemHydrate = (item) => {
    var array = [...hydrates];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.splice(item, 1): array[item] = item;
    setHydrates(array)
    for (var i = 0; i < array.length; i++ ){
      consumption = array[i].consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.hydrates = array;
    dashboard.hydratation.dailyTarget.globalConsumption = sum;    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const saveItem = (item) => {
    var array = [...hydrates];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setHydrates (array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (hydrates) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.hydrates= hydrates;
    setHydrates(hydrates)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
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
      <IonItem className="divTitre1">
        <IonAvatar slot="start"><img src="/assets/Hydratation.jpeg" alt=""/></IonAvatar>
        <IonLabel><h2><b>Hydratation</b></h2></IonLabel>
        <IonInput className='inputTextGly' value = {globalConsumption} readonly></IonInput> 
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV1")} />
      </IonItem>
      <div id="myDIV1">
        <div> 
          <div className="divHyd">
            <div className="sett">
              { hydrates.map((hydra, index) => (      
                <IonItem className="divTitre11" key={hydra.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{hydra.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrementHydrate(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {hydra.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItemHydrate(index)}>
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
          {itemContainerDisplayStatus && <HydrateItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashHydrate) => saveItem(itemDashHydrate)}/>}   
        </div>
      </div>
    </div>             
  );
}
export default Hydratation;