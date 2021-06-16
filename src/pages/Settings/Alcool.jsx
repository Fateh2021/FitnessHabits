import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create,addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const AlcoolItem = (props) => {

  const [itemAlcool, setItemAlcool] = useState({
      id: props.itemAlcool ? props.item.id : uuid(),
      favoris: props.itemAlcool ? props.itemAlcool.favoris : false, 
      name:props.itemAlcool ? props.itemAlcool.name : '', 
      qtte:props.itemAlcool ? props.itemAlcool.qtte : 0, 
      proteine:props.itemAlcool ? props.itemAlcool.proteine : 0, 
      glucide:props.itemAlcool ? props.itemAlcool.glucide : 0, 
      fibre:props.itemAlcool ? props.itemAlcool.fibre : 0, 
      gras:props.itemAlcool ? props.itemAlcool.gras : 0, 
      unit: props.itemAlcool ? props.itemAlcool.unit : '',
      consumption: props.itemAlcool ? props.itemAlcool.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemAlcool({ ...itemAlcool, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemAlcool);
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
          <IonCol size="2">
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemAlcool.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={itemAlcool.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={itemAlcool.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={itemAlcool.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={itemAlcool.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={itemAlcool.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={itemAlcool.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const Alcool = (props) => {

  const [alcools, setAlcools] = useState(props.alcools);
  const [alcoolsToEdit, setAlcoolsToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});

  // update state on prop change
  useEffect(() => {
    setAlcools(props.alcools);
  }, [props.alcools])

  const updateFavorisStatus = (event, item, index) => {

    event.stopPropagation();
    var array = [...alcools];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[item].favoris = true;

      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.alcool.alcools.unshift(array[item]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard); 
    } else {
      event.target.style.color = '';
      array[item].favoris = false;      
    }
    setAlcools (array);
    updateCacheAndBD(array);
  }

  const deleteItem = (item) => {
    var array = [...alcools];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.splice(item, 1): array[index] = item;
    setAlcools (array);
    closeItemContainer();

    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.alcools= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const closeItemContainer = () => {
    setAlcoolsToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setAlcoolsToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setAlcoolsToEdit(alcools[index]);
    setItemContainerDisplayStatus(true);
  }

  const saveItem = (item) => {
    var array = [...alcools];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setAlcools (array);
    closeItemContainer();

    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.alcools= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const updateCacheAndBD = (alcools) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.alcool.alcools= alcools;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }
  
  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { alcools.map((alco, index) => (      
            <IonItem className="divTitre11" key={alco.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{alco.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{alco.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={alco.unit} disabled="disabled">
                <option value6="-1"></option>
                <option value6="gr">gr</option>
                <option value6="oz">oz</option>
                <option value6="ml">ml</option>
                <option value6="tasse">tasse</option>
                <option value6="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{alco.gras}</b></div>
                <div className="triangleText2-2"><b>{alco.proteine}</b></div>
                <div className="triangleText3-3"><b>{alco.fibre}</b></div>
                <div className="triangleText4-4"><b>{alco.glucide}</b></div>         
              </div>
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
        <IonIcon icon={addCircle}/><label className="labelAddItem">Alcool</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={alcoolsToEdit} save={(itemAlcool) => saveItem(itemAlcool)}/>}
    </div> 
  );
}
export default Alcool;
