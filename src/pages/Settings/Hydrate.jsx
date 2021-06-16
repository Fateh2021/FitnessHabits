import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create,addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const HydrateItem = (props) => {

  const [itemHydrate, setItemHydrate] = useState({
    id: props.itemHydrate ? props.itemHydrate.id : uuid(),
    favoris: props.Hydrate ? props.itemHydrate.favoris : false, 
    name:props.itemHydrate ? props.itemHydrate.name : '', 
    qtte:props.itemHydrate ? props.itemHydrate.qtte : 0, 
    proteine:props.itemHydrate ? props.itemHydrate.proteine : 0, 
    glucide:props.itemHydrate ? props.itemHydrate.glucide : 0, 
    fibre:props.itemHydrate ? props.itemHydrate.fibre : 0, 
    gras:props.itemHydrate ? props.itemHydrate.gras : 0, 
    unit: props.itemHydrate ? props.itemHydrate.unit : '',
    consumption: props.itemHydrate ? props.itemHydrate.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemHydrate({ ...itemHydrate, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemHydrate);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemHydrate.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={itemHydrate.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={itemHydrate.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={itemHydrate.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={itemHydrate.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={itemHydrate.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={itemHydrate.gras} onIonChange={handleChange}></IonInput>  
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
    event.stopPropagation();
    var array = [...hydrates];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[index].favoris = true;    
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.hydratation.hydrates.unshift(array[index]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard); 
    } else {
      event.target.style.color = '';
      array[index].favoris = false;      
    }
    setHydrates (array);
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
    var array = [...hydrates];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.splice(item, 1): array[item] = item;
    setHydrates (array);
    closeItemContainer();

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
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
                <option value1="-1"></option>
                <option value1="gr">gr</option>
                <option value1="oz">oz</option>
                <option value1="ml">ml</option>
                <option value1="tasse">tasse</option>
                <option value1="unite">unité</option>
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
      {itemContainerDisplayStatus && <HydrateItem close={closeItemContainer} item={hydrateToEdit} save={(itemHydrate) => saveItem(itemHydrate)}/>}
    </div> 
  );
}
export default Hydrate;
