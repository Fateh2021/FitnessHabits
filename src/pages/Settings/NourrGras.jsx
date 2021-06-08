import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create, addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const GrasItem = (props) => {

  const [itemGras, setItemGras] = useState({
    id: props.itemGras ? props.itemGras.id : uuid(),
    favoris: props.itemGras ? props.itemGras.favoris : false, 
    name:props.itemGras ? props.itemGras.name : '', 
    qtte:props.itemGras ? props.itemGras.qtte : 0, 
    proteine:props.itemGras ? props.itemGras.proteine : 0, 
    glucide:props.itemGras ? props.itemGras.glucide : 0, 
    fibre:props.itemGras ? props.itemGras.fibre : 0, 
    gras:props.itemGras ? props.itemGras.gras : 0, 
    unit: props.itemGras ? props.itemGras.unit : ''
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemGras({ ...itemGras, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemGras);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemGras.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={itemGras.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={itemGras.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={itemGras.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={itemGras.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={itemGras.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={itemGras.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const NourrGras = (props) => {

  const [gras, setGras] = useState(props.gras);
  const [grasToEdit, setGrasToEdit] = useState(undefined);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  
  // update state on prop change
  useEffect(() => {
    setGras(props.gras);
  }, [props.gras])

  const updateFavorisStatus = (event, index, item) => {
    event.stopPropagation();
    var array = [...gras];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[index].favoris = true;
      console.log("array::"+JSON.stringify(array[index]));

      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.gras.grass.unshift(array[index]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard); 
    } else {
      event.target.style.color = '';
      array[index].favoris = false;      
    }
    setGras (array);
    updateCacheAndBD(array);
    
  }

  const deleteItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...gras];
    array.splice(item, 1);
    setGras (array);
    closeItemContainer();
    
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.gras.gras= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const closeItemContainer = () => {
    setGrasToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setGrasToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setGrasToEdit(gras[index]);
    setItemContainerDisplayStatus(true);
  }

  const saveItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...gras];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setGras (array);
    closeItemContainer();

    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.gras.gras= array;
    console.log("Loading Settings From localStorage when save..."+JSON.stringify(settings));
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("Verif de settings..."+JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const updateCacheAndBD = (gras) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.gras.gras= gras;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { gras.map((gra, index) => (      
            <IonItem className="divTitre11" key={gra.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{gra.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{gra.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={gra.unit} disabled="disabled">
                <option value2="-1"></option>
                <option value2="gr">gr</option>
                <option value2="oz">oz</option>
                <option value2="ml">ml</option>
                <option value2="tasse">tasse</option>
                <option value2="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{gra.gras}</b></div>
                <div className="triangleText2-2"><b>{gra.proteine}</b></div>
                <div className="triangleText3-3"><b>{gra.fibre}</b></div>
                <div className="triangleText4-4"><b>{gra.glucide}</b></div>         
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
        <IonIcon icon={addCircle}/><label className="labelAddItem">Gras</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <GrasItem close={closeItemContainer} item={grasToEdit} save={(itemGras) => saveItem(itemGras)}/>}
    </div> 
  );
}
export default NourrGras;
