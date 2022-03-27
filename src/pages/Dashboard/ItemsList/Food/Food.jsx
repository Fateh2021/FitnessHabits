import React, {useState, useEffect} from 'react';
import { IonGrid, IonRow, IonCol, IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton } from '@ionic/react';
import {arrowDropdownCircle, star, addCircle, removeCircle, trash, eye} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase';
import '../../../Tab1.css';
import * as translate from '../../../../translate/Translator';

const FoodItem = (props) => {

  const [item, setItem] = useState({
    id: props.item ? props.item.id : uuid(),
    favorite: props.item ? props.item.favorite : false, 
    name: props.item ? props.item.name : '', 
    qty: props.item ? props.item.qty : 0, 
    proteins: props.item ? props.item.proteins : 0, 
    glucides: props.item ? props.item.glucides : 0, 
    fibre: props.item ? props.item.fibre : 0, 
    fats: props.item ? props.item.fats : 0, 
    unit: props.item ? props.item.unit : ''
  });

  useEffect(() => {
    if (item.favorite) {
      const foodItemPopup = document.getElementById('divPopUp1-1');
      const favButton = foodItemPopup.querySelector('#favoriteButton');
      favButton.classList.add('active');
    }
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  }

  const handleChangeQtyMacro = event => {
    const { name, value } = event.target;

    if (value >= 0) {
      setItem({ ...item, [name]: Number(value) });
    } else {
      setItem({ ...item, [name]: 0});
    }
  }

  const handleFavorites = event => {
    item.favorite = !item.favorite;
    event.currentTarget.classList.toggle('active');
  }

  const saveChanges = () => {
    if (item.name === undefined || item.name === '' || item.qty === 0 || item.unit === undefined || item.unit === '' || (item.proteins === 0 && item.glucides === 0 && item.fibre === 0 && item.fats === 0)) {
      alert(translate.getText('FOOD_MODULE', ['functions', 'addErrorMessage', 'saveItem']));
      return;
    }
    props.save(item);
  }
  const qtyPlaceholder = translate.getText('FOOD_MODULE', ['macroNutriments', 'qty']);
  const proteinPlaceholder = translate.getText('FOOD_MODULE', ['macroNutriments', 'proteins']);
  const glucidePlaceholder = translate.getText('FOOD_MODULE', ['macroNutriments', 'glucides']);
  const fibrePlaceholder = translate.getText('FOOD_MODULE', ['macroNutriments', 'fibre']);
  const fatsPlaceholder = translate.getText('FOOD_MODULE', ['macroNutriments', 'fats']);

  return (
    <div id="divPopUp1-1">
        <IonCol size="1">
          <button id='saveButton' className="buttonOK" onClick={saveChanges}>OK</button>
        </IonCol>  
        <IonCol size="1">
          <span id='closeButton' className="buttonCloseEdit" onClick={() => props.close()}>X</span>
        </IonCol>
        <IonItem  className="divAdd">
          <IonCol size="1">
            <IonIcon id='favoriteButton' className="starFavoris" onClick={handleFavorites} icon={star}/>
          </IonCol>
          <IonCol size="3">
            <IonInput className = 'divAddText' placeholder={translate.getText('FOOD_MODULE', ['functions', 'addDescription', 'placeholder'])} name="name" value={item.name} onIonChange={handleChange}/>
          </IonCol>
          <IonCol size="2">
            <IonInput id='foodItemQty' className = 'divAddText nourTextInput' type= 'number' min = "1" placeholder={qtyPlaceholder} name="qty" value={item.qty} onIonChange={handleChangeQtyMacro}/>
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" value={item.unit} onChange={handleChange} style={{ width: '10%' }}>
            <option value="-1"></option>
            <option value="gr">{ translate.getText('UNIT_GR') }</option>
            <option value="oz">{ translate.getText('UNIT_OZ') }</option>
            <option value="ml">{ translate.getText('UNIT_ML') }</option>
            <option value="cup">{ translate.getText('UNIT_CUP') }</option>
            <option value="unit">{ translate.getText('UNIT_TEXT') }</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1"><div id='protQty' className ="divMacroAdd">{ proteinPlaceholder }</div>
              <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={proteinPlaceholder} name="proteins" value={item.proteins} onIonChange={handleChangeQtyMacro}/>
            </IonCol>
            <IonCol className ="colNutGlucidesHyd macroNutrimentEditSection" size="1"><div id='glucQty' className ="divMacroAdd">{ glucidePlaceholder }</div>
              <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={glucidePlaceholder} name="glucides" value={item.glucides} onIonChange={handleChangeQtyMacro}/>
            </IonCol>
            <IonCol className ="colNutFibresHyd macroNutrimentEditSection" size="1"><div id='fibQty' className ="divMacroAdd">{ fibrePlaceholder }</div>
              <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={fibrePlaceholder} name="fibre" value={item.fibre} onIonChange={handleChangeQtyMacro}/>
            </IonCol>
            <IonCol className ="colNutGrasHyd macroNutrimentEditSection" size="1"><div id='fatQty' className ="divMacroAdd">{ fatsPlaceholder }</div>
              <IonInput className = 'divAddTextNut nourTextInput' min="0" type= 'number' placeholder={fatsPlaceholder} name="fats" value={item.fats} onIonChange={handleChangeQtyMacro}/>
            </IonCol>
        </IonItem>
      </div>
  );
}

const Food = (props) => {
  const [test] = useState(props.test);
  const [foodItems, setFoodItems] = useState(props.foodItems.sort((a, b) => b.favorite - a.favorite));
  const [proteinConsumptionPerCategory, setGlobalProteinConsumption] = useState(props.macroNutrimentConsumption.proteins);
  const [glucideConsumptionPerCategory, setGlobalGlucideConsumption] = useState(props.macroNutrimentConsumption.glucides);
  const [fibreConsumptionPerCategory, setGlobalFibreConsumption] = useState(props.macroNutrimentConsumption.fibre);
  const [fatConsumptionPerCategory, setGlobalFatsConsumption] = useState(props.macroNutrimentConsumption.fats);
  const [currentDate, setCurrentDate] = useState({startDate: props.currentDate}); 
  const [foodItemToEdit, setFoodItemToEdit] = useState(props.foodItemToEdit);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(props.itemContainerDisplayStatus);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setGlobalProteinConsumption(props.macroNutrimentConsumption.proteins);
  }, [props.macroNutrimentConsumption.proteins])

  useEffect(() => {
    setGlobalGlucideConsumption(props.macroNutrimentConsumption.glucides);
  }, [props.macroNutrimentConsumption.glucides])

  useEffect(() => {
    setGlobalFibreConsumption(props.macroNutrimentConsumption.fibre);
  }, [props.macroNutrimentConsumption.fibre])

  useEffect(() => {
    setGlobalFatsConsumption(props.macroNutrimentConsumption.fats);
  }, [props.macroNutrimentConsumption.fats])

  useEffect(()=>{
    setFoodItems(props.foodItems)
  }, [props.foodItems])

  const toggle = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      if (!divElt.style.display || divElt.style.display === "none") {
        divElt.style.display = "block";
      } else {
        divElt.style.display = "none";
      }
    }
  }

  const deleteItem = (index) => {
    const item = foodItems[index];
    foodItems.splice(index, 1);
    updateCacheAndDB((macroNutrimentConsumption) => {
      macroNutrimentConsumption.proteins = Math.max(macroNutrimentConsumption.proteins - item.proteins, 0);
      macroNutrimentConsumption.glucides = Math.max(macroNutrimentConsumption.glucides - item.glucides, 0);
      macroNutrimentConsumption.fibre = Math.max(macroNutrimentConsumption.fibre - item.fibre, 0);
      macroNutrimentConsumption.fats = Math.max(macroNutrimentConsumption.fats - item.fats, 0);
    });
  }

  const saveItem = (item) => {
    const index = foodItems.findIndex((e) => e.id === item.id);

    if (index === -1) {
      foodItems.unshift(item);
      updateCacheAndDB((macroNutrimentConsumption) => {
        macroNutrimentConsumption.proteins += item.proteins;
        macroNutrimentConsumption.glucides += item.glucides;
        macroNutrimentConsumption.fibre += item.fibre;
        macroNutrimentConsumption.fats += item.fats;
      }); 
    } else {
      const oldItem = foodItems[index];
      foodItems[index] = item;
      updateCacheAndDB((macroNutrimentConsumption) => {
        macroNutrimentConsumption.proteins = Math.max(macroNutrimentConsumption.proteins - oldItem.proteins + item.proteins, 0);
        macroNutrimentConsumption.glucides = Math.max(macroNutrimentConsumption.glucides - oldItem.glucides + item.glucides, 0);
        macroNutrimentConsumption.fibre = Math.max(macroNutrimentConsumption.fibre - oldItem.fibre + item.fibre, 0);
        macroNutrimentConsumption.fats = Math.max(macroNutrimentConsumption.fats - oldItem.fats + item.fats, 0);
      }); 
    }
    closeItemContainer(); 
  }

  const updateCacheAndDB = (updateTotalFunc) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.food.categories[props.categoryKey].items = foodItems;
    setFoodItems(foodItems);
    updateTotalFunc(dashboard.food.categories[props.categoryKey].macroNutrimentConsumption);
    
    setGlobalProteinConsumption(dashboard.food.categories[props.categoryKey].macroNutrimentConsumption.proteins);
    setGlobalGlucideConsumption(dashboard.food.categories[props.categoryKey].macroNutrimentConsumption.glucides);
    setGlobalFibreConsumption(dashboard.food.categories[props.categoryKey].macroNutrimentConsumption.fibre);
    setGlobalFatsConsumption(dashboard.food.categories[props.categoryKey].macroNutrimentConsumption.fats);

    props.updateFoodConsumptionCallback();

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
    setFoodItemToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setFoodItemToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openShowItemContainer = (item) => {
    setFoodItemToEdit(item);
    setItemContainerDisplayStatus(true);
  }

   return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img id='moduleImg' src= { `/assets/${ props.categoryKey }.jpg` } alt="" />
        </IonAvatar>
        <IonLabel>
          <h2>
            <b id='moduleName'>
              { translate.getText('FOOD_MODULE', ['foodCategories', `${ props.categoryKey }`]) } 
            </b>
          </h2>
        </IonLabel>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrimentSummary', 'cumulativeProteins'])}: 
                <div id='proteinConsumptionPerCategory'>{proteinConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrimentSummary', 'cumulativeGlucides'])}:
                <div id='glucideConsumptionPerCategory'>{glucideConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrimentSummary', 'cumulativeFibre'])}:
                <div id='fibreConsumptionPerCategory'>{fibreConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrimentSummary', 'cumulativeFats'])}:
                <div id='fatConsumptionPerCategory'>{fatConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonIcon id='proteinArrow' className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => toggle(props.categoryKey)}/>
      </IonItem> 
      <div id={ props.categoryKey }>
      <div className="divHyd">
            <div className="sett">
              { foodItems && foodItems.map((item, index) => (      
                <IonItem id={item.id} className="divTitre11" key={item.id}>
                 <IonCol></IonCol>
                 <IonLabel className="nameDscripDashboard"><h2><b>{item.name}</b></h2></IonLabel>      
                  <IonCol>
                    <IonButton id='showButton' className="eyeButton" color="danger" size="small" onClick={() => openShowItemContainer(item)}>
                      <IonIcon  icon={eye} />
                    </IonButton>
                    <IonButton id='deleteButton' className="trashButton" color="danger" size="small" onClick={() => deleteItem(index)}>
                      <IonIcon  icon={trash} />
                    </IonButton>
                  </IonCol>
                </IonItem>
                ))
              } 
            </div>
          </div>
        <div className="ajoutBotton">    
          <IonButton id='addButton' className="ajoutbreuvage1" color="danger" size="medium" onClick={() => openAddItemContainer()}>
          <IonIcon icon={addCircle}/><label id='addFoodItem' className="labelAddItem">{ translate.getText('FOOD_MODULE', ['functions', 'addFoodItem']) }</label></IonButton>
        </div>
        {itemContainerDisplayStatus && <FoodItem id='saveItem' close={closeItemContainer} item={foodItemToEdit} save={(item) => { saveItem(item); }}/>}
      </div>
    </div>    
  );
}
export default Food;