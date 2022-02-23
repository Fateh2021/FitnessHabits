import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton } from '@ionic/react';
import { arrowDropdownCircle, star, addCircle, removeCircle, trash } from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'
import '../../../Tab1.css'

const MacroNutrimentItem = (props) => {

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
        <IonCol size="1">
          <button id='saveButton' className="buttonOK" onClick={saveChanges}>OK</button>
        </IonCol>  
        <IonCol size="1">
          <span className="buttonCloseEdit" onClick={() => props.close()}>X</span>
        </IonCol>                       
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
          <IonCol className ="colNutProteinesHyd" size="1"><div className ="divMacroAdd">Pro</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Prot" name="proteine" value={item.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1"><div className ="divMacroAdd">Glu</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={item.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1"><div className ="divMacroAdd">Fib</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={item.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1"><div className ="divMacroAdd">Gras</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={item.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

const Nourriture = (props) => {
  const [test, setTest] = useState(props.test);
  const [dailyTarget, setDailyTarget] = useState(props.dailyTarget);
  const [macroNutriment, setMacroNutriment] = useState(props.macroNutriment);
  const [macroNutriments, setMacroNutriments] = useState(props.macroNutriments);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [currentDate, setCurrentDate] = useState({startDate: props.currentDate}); 
  const [macroNutrimentToEdit, setMacroNutrimentToEdit] = useState(props.macroNutrimentToEdit);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(props.itemContainerDisplayStatus);

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
    setMacroNutriment(props.macroNutriment)
  }, [props.macroNutriment])

  useEffect(()=>{
    setMacroNutriments(props.macroNutriments)
  }, [props.macroNutriments])

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const DailyConsumptionIncrement = (item)=>{ 
    // Vu que les objets et les tableaux sont passés par référence en JS, on peut faire l'incrémentation de l'objet passé en argument directement 
    // et le résultat sera reflété dans le tableau <code> macroNutriments </code>, qui contient le <code> item </code> en question.
    item.consumption++;
    updateCacheAndBD((total) => { return ++total; });
  }

  const DailyConsumptionDecrement = (item)=>{  
    if (item.consumption >= 1) {
      // Vu que les objets et les tableaux sont passés par référence en JS, on peut faire la décrémentation de l'objet passé en argument directement 
      // et le résultat sera reflété dans le tableau <code> macroNutriments </code>, qui contient le <code> item </code> en question.
      item.consumption--;
      updateCacheAndBD((total) => { return Math.max(--total, 0); });
    };
  }

  const deleteItem = (index) => {
    const itemConsumption = macroNutriments[index].consumption;
    macroNutriments.splice(index, 1);
    updateCacheAndBD((total) => { 
      const newTotal = total - itemConsumption; 
      return Math.max(newTotal, 0);
    });
  }

  const saveItem = (item) => {
    const index = macroNutriments.findIndex((e) => e.id === item.id);
    if (index === -1) {
      macroNutriments.unshift(item);
      // Dans le cas d'une sauvegarde, le total ne change pas dans l'implémentation courante, alors on ne fait que le retourner tel quel par le foncteur de mise à jour (pour le moment).
      updateCacheAndBD((total) => { return total; } );
    }
    closeItemContainer();
  }

  const updateCacheAndBD = (updateTotalFunc) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard[props.type][props.subType] = macroNutriments;
    setMacroNutriments(macroNutriments);
    const totalConsumption = updateTotalFunc(dashboard[props.type].dailyTarget.globalConsumption);
    dashboard[props.type].dailyTarget.globalConsumption = totalConsumption;
    setGlobalConsumption(totalConsumption);
    props.parentCallback(totalConsumption);
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    
    if (!test) {
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    }
  }

  const closeItemContainer = () => {
    setMacroNutrimentToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setMacroNutrimentToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

   return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img id='moduleImg' src= { `/assets/${ props.name }.jpg` } alt="" />
        </IonAvatar>
        <IonLabel>
          <h2><b id='moduleName'>{ props.name }</b></h2>
        </IonLabel>
        <IonInput id='globalConsumption' className='inputTextNourDasboard' value = {globalConsumption} readonly></IonInput> 
        <IonIcon id='proteinArrow' className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor(props.cssId)}/>
      </IonItem> 
      <div id={ props.cssId }>
      <div className="divHyd">
            <div className="sett">
              { macroNutriments.map((macroNutriment, index) => (      
                <IonItem id={macroNutriment.id} className="divTitre11" key={macroNutriment.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{macroNutriment.name}</b></h2></IonLabel>      
                  <IonButton id='decrementButton' className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrement(macroNutriment)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput id='unitConsumption' className='inputTextDashboard' value = {macroNutriment.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton id='incrementButton' className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(macroNutriment)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton id='deleteButton' className="trashButton" color="danger" size="small" onClick={() => deleteItem(index)}>
                    <IonIcon  icon={trash} />
                  </IonButton>
                </IonItem>
                ))
              } 
            </div>
          </div>
        <div className="ajoutBotton">    
          <IonButton id='addButton' className="ajoutbreuvage1" color="danger" size="small" onClick={() => openAddItemContainer()}>
          <IonIcon icon={addCircle}/><label className="labelAddItem">breuvage</label></IonButton>
        </div>
        {itemContainerDisplayStatus && <MacroNutrimentItem id='saveItem' close={closeItemContainer} item={macroNutrimentToEdit} save={(item) => saveItem(item)}/>}       
      </div> 
    </div>    
  );
}
export default Nourriture;