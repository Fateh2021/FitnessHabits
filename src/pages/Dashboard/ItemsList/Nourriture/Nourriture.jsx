import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton } from '@ionic/react';
import {arrowDropdownCircle, star, addCircle, removeCircle, trash, eye} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase';
import '../../../Tab1.css';
import * as translate from '../../../../translate/Translator';

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

  const handleChangeQtyMacro = event => {
    const { name, value } = event.target;
    if (value >= 0) {
      setItem({ ...item, [name]: value });
    } else {
      setItem({ ...item, [name]: 0});
    }
  }

  const handleFavoris = event => {
    item.favoris = !item.favoris;
    event.currentTarget.classList.toggle("active");
  }

  const saveChanges = () => {
    props.save(item);
  }

  const proteinPlaceholder = translate.getText('FOOD_MODULE', ['macro_nutriments', 'proteins']);
  const glucidePlaceholder = translate.getText('FOOD_MODULE', ['macro_nutriments', 'glucides']);
  const fibrePlaceholder = translate.getText('FOOD_MODULE', ['macro_nutriments', 'fibre']);
  const fatsPlaceholder = translate.getText('FOOD_MODULE', ['macro_nutriments', 'fats']);

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
            <IonIcon className="starFavoris" onClick={handleFavoris} icon={star}/>
          </IonCol>
          <IonCol size="3">
            <IonInput className = 'divAddText' placeholder={translate.getText('FOOD_MODULE', ['functions', 'add_description', 'placeholder'])} name="name" value={item.name} onIonChange={handleChange}/>
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={item.qtte} onIonChange={handleChange}/>
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={item.unit} onChange={handleChange}>
            <option value="-1"/>
            <option value="gr">{ translate.getText('UNIT_GR') }</option>
            <option value="oz">{ translate.getText('UNIT_OZ') }</option>
            <option value="ml">{ translate.getText('UNIT_ML') }</option>
            <option value="tasse">{ translate.getText('UNIT_CUP') }</option>
            <option value="unite">{ translate.getText('UNIT_TEXT') }</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1"><div id='protQty' className ="divMacroAdd">{ proteinPlaceholder }</div>
            <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={proteinPlaceholder} name="proteine" value={item.proteine} onIonChange={handleChangeQtyMacro}/>
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1"><div id='glucQty' className ="divMacroAdd">{ glucidePlaceholder }</div>
            <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={glucidePlaceholder} name="glucide" value={item.glucide} onIonChange={handleChangeQtyMacro}/>
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1"><div id='fibQty' className ="divMacroAdd">{ fibrePlaceholder }</div>
            <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={fibrePlaceholder} name="fibre" value={item.fibre} onIonChange={handleChangeQtyMacro}/>
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1"><div id='fatQty' className ="divMacroAdd">{ fatsPlaceholder }</div>
            <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={fatsPlaceholder} name="gras" value={item.gras} onIonChange={handleChangeQtyMacro}/>
          </IonCol>
        </IonItem>
      </div>
  );
}

const Nourriture = (props) => {
  props.macroNutriments.sort((a,b) => b.favoris-a.favoris);

  const [test] = useState(props.test);
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
      if (!divElt.style.display || divElt.style.display === "none") {
        divElt.style.display = "block";
      } else {
        divElt.style.display = "none";
      }
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
    }
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
    dashboard[props.dashboardKey][props.dashboardSubKey] = macroNutriments;
    setMacroNutriments(macroNutriments);
    const totalConsumption = updateTotalFunc(dashboard[props.dashboardKey].dailyTarget.globalConsumption);
    dashboard[props.dashboardKey].dailyTarget.globalConsumption = totalConsumption;
    setGlobalConsumption(totalConsumption);
    props.parentCallback(totalConsumption);
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    // Le flag <code> test </code> sert à assurer qu'on ne fait pas appel à la BD dans les tests unitaires, pour lesquels l'utilisation de la cache suffit pour tester la logique du module.
    // Ce flag-ci est donc mis à vrai uniquement lors du rendu du composant Nourriture simulé dans les tests, mais demeure 'undefined' en production.
    if (test) {
      return;
    }
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const closeItemContainer = () => {
    setMacroNutrimentToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setMacroNutrimentToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openShowItemContainer = (item) => {
    setMacroNutrimentToEdit(item);
    setItemContainerDisplayStatus(true);
  }

   return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img id='moduleImg' src= { `/assets/${ props.translationKey }.jpg` } alt="" />
        </IonAvatar>
        <IonLabel>
          <h2>
            <b id='moduleName'>
              { translate.getText('FOOD_MODULE', ['sub_titles', `${ props.translationKey }`]) } 
            </b>
          </h2>
        </IonLabel>
        <IonInput id='globalConsumption' className='inputTextNourDasboard' value = {globalConsumption} readonly/>
        <IonIcon id='proteinArrow' className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor(props.cssId)}/>
      </IonItem> 
      <div id={ props.cssId }>
      <div className="divHyd">
            <div className="sett">
              { macroNutriments.map((macroNutr, index) => (      
                <IonItem id={macroNutr.id} className="divTitre11" key={macroNutr.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{macroNutr.name}</b></h2></IonLabel>      
                  <IonButton id='decrementButton' className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrement(macroNutr)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput id='unitConsumption' className='inputTextDashboard' value = {macroNutr.consumption} readonly/>
                  </IonCol>
                  <IonButton id='incrementButton' className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(macroNutr)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton id='showButton' className="eyeButton" color="danger" size="small" onClick={() => openShowItemContainer(macroNutr)}>
                    <IonIcon  icon={eye} />
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
          <IonButton id='addButton' className="ajoutbreuvage1" color="danger" size="medium" onClick={() => openAddItemContainer()}>
          <IonIcon icon={addCircle}/><label id='addMacroNutriment' className="labelAddItem">{ translate.getText('FOOD_MODULE', ['functions', 'add_macro_nutriment']) }</label></IonButton>
        </div>
        {itemContainerDisplayStatus && <MacroNutrimentItem id='saveItem' close={closeItemContainer} item={macroNutrimentToEdit} save={(item) => saveItem(item)}/>}
      </div>
    </div>    
  );
}
export default Nourriture;