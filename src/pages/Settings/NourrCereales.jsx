import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create, addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const CerealesItem = (props) => {

  const [itemCereales, setItemCereales] = useState({
      id: props.itemCereales ? props.itemCereales.id : uuid(),
      favoris: props.itemCereales ? props.itemCereales.favoris : false, 
      name:props.itemCereales ? props.itemCereales.name : '', 
      qtte:props.itemCereales ? props.itemCereales.qtte : 0, 
      proteine:props.itemCereales ? props.itemCereales.proteine : 0, 
      glucide:props.itemCereales ? props.itemCereales.glucide : 0, 
      fibre:props.itemCereales ? props.itemCereales.fibre : 0, 
      gras:props.itemCereales ? props.itemCereales.gras : 0, 
      unit: props.itemCereales ? props.itemCereales.unit : ''
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemCereales({ ...itemCereales, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemCereales);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemCereales.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={itemCereales.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={itemCereales.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={itemCereales.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={itemCereales.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={itemCereales.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={itemCereales.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const NourrCereales = (props) => {

  const [cereales, setCereales] = useState(props.cereales);
  const [cerealesToEdit, setCerealesToEdit] = useState(undefined);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  
  // update state on prop change
  useEffect(() => {
    setCereales(props.cereales);
  }, [props.cereales])

  const updateFavorisStatus = (event, index) => {
    event.stopPropagation();
    var array = [...cereales];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[index].favoris = true;
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.cereales.cereales.unshift(array[index]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);   
    } else {
      event.target.style.color = '';
      array[index].favoris = false;
    }
    setCereales(array);

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const deleteItem = (item) => {
    var array = [...cereales];
    array.splice(item, 1);
    setCereales (array);
    closeItemContainer();
    
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.cereales.cereales= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const closeItemContainer = () => {
    setCerealesToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setCerealesToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setCerealesToEdit(cereales[index]);
    setItemContainerDisplayStatus(true);
  }

  const saveItem = (item) => {
    var array = [...cereales];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setCereales (array);
    closeItemContainer();

    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.cereales.cereales= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const updateCacheAndBD = (cereales) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.cereales.cereales= cereales;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { cereales.map((cer, index) => (      
            <IonItem className="divTitre11" key={cer.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{cer.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{cer.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={cer.unit} disabled="disabled">
                <option value5="-1"></option>
                <option value5="gr">gr</option>
                <option value5="oz">oz</option>
                <option value5="ml">ml</option>
                <option value5="tasse">tasse</option>
                <option value5="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{cer.gras}</b></div>
                <div className="triangleText2-2"><b>{cer.proteine}</b></div>
                <div className="triangleText3-3"><b>{cer.fibre}</b></div>
                <div className="triangleText4-4"><b>{cer.glucide}</b></div>         
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
        <IonIcon icon={addCircle}/><label className="labelAddItem">cereales</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <CerealesItem close={closeItemContainer} item={cerealesToEdit} save={(itemCereales) => saveItem(itemCereales)}/>}
    </div> 
  );
}
export default NourrCereales;
