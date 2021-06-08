import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create, addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const LegumesItem = (props) => {

  const [itemLegumes, setItemLegumes] = useState({
    id: props.itemLegumes ? props.itemLegumes.id : uuid(),
    favoris: props.itemLegumes ? props.itemLegumes.favoris : false, 
    name:props.itemLegumes ? props.itemLegumes.name : '', 
    qtte:props.itemLegumes ? props.itemLegumes.qtte : 0, 
    proteine:props.itemLegumes ? props.itemLegumes.proteine : 0, 
    glucide:props.itemLegumes ? props.itemLegumes.glucide : 0, 
    fibre:props.itemLegumes ? props.itemLegumes.fibre : 0, 
    gras:props.itemLegumes ? props.itemLegumes.gras : 0, 
    unit: props.itemLegumes ? props.itemLegumes.unit : ''
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemLegumes({ ...itemLegumes, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemLegumes);
  }

  return (
    <div id="divPopUp1-1">
        <button className="buttonOK" onClick={saveChanges}>OK</button>
        <span className="buttonCloseEdit" onClick={() => props.close()}>X</span>                       
        <IonItem  className="divAdd">
          <IonCol size="1">
            <IonIcon className="starFavoris" icon={star}/>
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemLegumes.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={itemLegumes.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={itemLegumes.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={itemLegumes.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={itemLegumes.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={itemLegumes.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={itemLegumes.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const NourrLegumes = (props) => {

  const [legumes, setLegumes] = useState(props.legumes);
  const [legumesToEdit, setLegumesToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  
  // update state on prop change
  useEffect(() => {
    setLegumes(props.legumes);
  }, [props.legumes])

  const updateFavorisStatus = (event, index) => {
    event.stopPropagation();
    var array = [...legumes];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[index].favoris = true;   
    } else {
      event.target.style.color = '';
      array[index].favoris = false;
    }
    setLegumes(array);

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const deleteItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...legumes];
    array.splice(item, 1);
    setLegumes (array);
    closeItemContainer();
    
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.legumes= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const closeItemContainer = () => {
    setLegumesToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setLegumesToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setLegumesToEdit(legumes[index]);
    setItemContainerDisplayStatus(true);
  }

  const saveItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...legumes];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setLegumes (array);
    closeItemContainer();
    // console.log("Loading Settings From localStorage when save..."+JSON.stringify(array));
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.legumes= array;
    console.log("Loading Settings From localStorage when save..."+JSON.stringify(settings));
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("Verif de settings..."+JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const updateCacheAndBD = (legumes) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.legumes= legumes;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { legumes.map((leg, index) => (      
            <IonItem className="divTitre11" key={leg.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{leg.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{leg.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={leg.unit} disabled="disabled">
                <option value4="-1"></option>
                <option value4="gr">gr</option>
                <option value4="oz">oz</option>
                <option value4="ml">ml</option>
                <option value4="tasse">tasse</option>
                <option value4="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{leg.gras}</b></div>
                <div className="triangleText2-2"><b>{leg.proteine}</b></div>
                <div className="triangleText3-3"><b>{leg.fibre}</b></div>
                <div className="triangleText4-4"><b>{leg.glucide}</b></div>         
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
        <IonIcon icon={addCircle}/><label className="labelAddItem">Legumes</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <LegumesItem close={closeItemContainer} item={legumesToEdit} save={(itemLegumes) => saveItem(itemLegumes)}/>}
    </div> 
  );
}
export default NourrLegumes;
