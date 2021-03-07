import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create,addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import * as firebase from 'firebase'

const HydrateItem = (props) => {

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
    console.log("save changes::"+JSON.stringify(item))
    props.save(item);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={item.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={item.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={item.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={item.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={item.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={item.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={item.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const Hydrate = (props) => {

  const [hydrates, setHydrates] = useState(props.hydrates);
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});

  // update state on prop change
  useEffect(() => {
    setHydrates(props.hydrates);
  }, [props.hydrates])

  const updateFavorisStatus = (event, index, item) => {
    console.log("fa9oooo::::::::")
    event.stopPropagation();
    var array = [...hydrates];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[item].favoris = true;

      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.hydratation.hydrates.unshift(array[item]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
      //console.log("Dashboard Hydratation ::::"+ JSON.stringify(dashboard))
      // console.log("hydrate ind :::::" +dashboard.hydratation.hydrates[index].id);
      // console.log("hydrate array :::::" + JSON.stringify(dashboard.hydratation.hydrates));      
    } else {
      // const index = array.findIndex((e) => e.id === item.id);
      event.target.style.color = '';
      array[item].favoris = false;      
      // console.log("index :::::" + array[index].id)

      // const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      // console.log("hydrate ind :::::" +dashboard.hydratation.hydrates[index].id);  
      // dashboard.hydratation.hydrates.splice(  index.id, 1);
      // localStorage.setItem('dashboard', JSON.stringify(dashboard));
      // const userUID = localStorage.getItem('userUid');
      // firebase.database().ref('dashboard/'+userUID).update(dashboard);
      // console.log("hydrate array :::::" + JSON.stringify(dashboard.hydratation.hydrates));
    }
    setHydrates (array);
    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setHydrateToEdit(hydrates[index]);
    setItemContainerDisplayStatus(true);
  }

  const deleteItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...hydrates];
    const index = array.findIndex((e) => e.id === item.id);
        console.log("index :::::" + array[item].id)
    index === -1 ? array.splice(item, 1): array[index] = item;
    setHydrates (array);
    closeItemContainer();

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...hydrates];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setHydrates (array);
    closeItemContainer();

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (hydrates) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.hydratation.hydrates= hydrates;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { hydrates.map((hydra, index) => (      
            <IonItem className="divTitre11" key={hydra.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star} style={hydra.favoris ? {color:"#d18a17"} :{}}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{hydra.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{hydra.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={hydra.unit} disabled="disabled">
                <option value="-1"></option>
                <option value="gr">gr</option>
                <option value="oz">oz</option>
                <option value="ml">ml</option>
                <option value="tasse">tasse</option>
                <option value="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{hydra.gras}</b></div>
                <div className="triangleText2-2"><b>{hydra.proteine}</b></div>
                <div className="triangleText3-3"><b>{hydra.fibre}</b></div>
                <div className="triangleText4-4"><b>{hydra.glucide}</b></div>         
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
        <IonIcon icon={addCircle}/><label className="labelAddItem">breuvage</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <HydrateItem close={closeItemContainer} item={hydrateToEdit} save={(item) => saveItem(item)}/>}
    </div> 
  );
}
export default Hydrate;
