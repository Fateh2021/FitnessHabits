import React, {useState, useEffect} from "react"
import { IonInput, IonButton, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import { arrowDropdownCircle, star, trash, addCircle, removeCircle} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'
import DefaultSettings from '../../Settings/DefaultSettings'
import { DateTime } from "luxon";

import '../../Tab1.css';

const AlcoolItem = (props) => {

  const [itemDashAlcool, setItemDashAlcool] = useState({
    id: props.itemDashAlcool ? props.itemDashAlcool.id : uuid(),
    favoris: props.itemDashAlcool ? props.itemDashAlcool.favoris : false, 
    name:props.itemDashAlcool ? props.itemDashAlcool.name : '', 
    qtte:props.itemDashAlcool ? props.itemDashAlcool.qtte : 0, 
    proteine:props.itemDashAlcool ? props.itemDashAlcool.proteine : 0, 
    glucide:props.itemDashAlcool ? props.itemDashAlcool.glucide : 0, 
    fibre:props.itemDashAlcool ? props.itemDashAlcool.fibre : 0, 
    gras:props.itemDashAlcool ? props.itemDashAlcool.gras : 0, 
    unit: props.itemDashAlcool ? props.itemDashAlcool.unit : '',
    consumption: props.itemDashAlcool ? props.itemDashAlcool.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashAlcool({ ...itemDashAlcool, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashAlcool);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemDashAlcool.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashAlcool.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashAlcool.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1"><div className ="divMacroAdd">Pro</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Prot" name="proteine" value={itemDashAlcool.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1"><div className ="divMacroAdd">Glu</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashAlcool.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1"><div className ="divMacroAdd">Fib</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashAlcool.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1"><div className ="divMacroAdd">Gras</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashAlcool.gras} onIonChange={handleChange}></IonInput>  
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

  const DailyConsumptionDecrementAlcool = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);  
    index === 0 ? array.find (({ item }) => item === array[item]): array[index] = item;
    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }
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

  const deleteItemAlcool = (item) => {
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
    checkNotifications();
  }

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});

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
    firebase
    .database()
    .ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
    .update(dashboard)
    .then(() => {
      console.log("props.currentDate.startDate.getDay())::::::" + props.currentDate.startDate.getDay());
      console.log ("currentDate.startDate" + currentDate.startDate.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      }))
      checkNotifications();
    });
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const checkNotifications = () => {
    // Obtenir les préférences de l'utilisateur
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/' + userUID + '/alcool')
      .once("value", (snapshot) => {
        const sets = snapshot.val();
        const alcoolSettings = sets ? sets : {
          dailyTarget:{
            value:0,
            unit:''
          },
          notifications :{
            active: false
          }, 
          limitConsom : {
            educAlcool: true,
            weeklyTarget: 0,
            dailyTarget: 0,
            sobrietyDays: 7,
            notificationMessage: "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite. C'est juste un rappel..."
          },
          alcools:DefaultSettings.alcools
        };

        // Obtenir les consommation jusqu'au dernier lundi
        firebase
        .database()
        .ref('dashboard/' + userUID)
        .orderByKey()
        .once("value", (snapshot) => {
          const consommations = snapshot.val();
          const currentDate = new Date();
          // Vérifier s'il respecte ses consommations journalières
          const dailyCount = getConsumptionsCount(consommations, currentDate);
          console.log("Objectif de consommation journalier : ", +alcoolSettings.limitConsom.dailyTarget)
          console.log("Consommations aujourd'hui : ", dailyCount);
          if(alcoolSettings.limitConsom && alcoolSettings.limitConsom.dailyTarget && dailyCount > +alcoolSettings.limitConsom.dailyTarget) {
            console.log("!!notification daily target");
          }
          

          // Vérifier s'il respecte ses consommations hebdomadaires
            // Obtenir les formats de date de la semaine
          let weeklyCount = 0;
          for (let i = 0; i < currentDate.getDay(); i++) {
            const dateDiff = DateTime.fromJSDate(currentDate).minus({ days: i}).toJSDate();
            weeklyCount += getConsumptionsCount(consommations, dateDiff)
          }
          console.log("Objectif de consommation hebdomadaire: ", +alcoolSettings.limitConsom.weeklyTarget);
          console.log("Consommation cette semaine : ", weeklyCount);
          if(alcoolSettings.limitConsom && alcoolSettings.limitConsom.weeklyTarget && weeklyCount > +alcoolSettings.limitConsom.weeklyTarget) {
            console.log("!!notification weekly target");
          }

          // Vérifier s'il respecte ses jours de consommation de suite 
          let streak = true;
          if(alcoolSettings.limitConsom && alcoolSettings.limitConsom.sobrietyDays)
          {
            for (let i = 0; i < alcoolSettings.limitConsom.sobrietyDays; i++) {
              const dateDiff = DateTime.fromJSDate(currentDate).minus({ days: i}).toJSDate();
              if(getConsumptionsCount(consommations, dateDiff) == 0) {
                streak = false;
                break;
              }
            }
          }
          console.log("Nombre de jours de consommation: ", +alcoolSettings.limitConsom.sobrietyDays);
          if(streak) {
            console.log("!!notification days streak");
          }
        });
        
      });
  }

  const getDbDate = (date) => {
    return date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
  }

  const getConsumptionsCount = (consommations, date) => {
    let count = 0;
    const code = getDbDate(date);
    if(consommations[code] && consommations[code].alcool && consommations[code].alcool.alcools)
    {
      for (const alcool of consommations[code].alcool.alcools) {
        if(alcool.consumption) {
          count += alcool.consumption;
        }
      }
    }
    return count;
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
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrementAlcool(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {alco.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItemAlcool(index)}>
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
          {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashAlcool) => saveItem(itemDashAlcool)}/>}   
        </div>        
    </div>
  </div>  
  );
}
export default Alcool;