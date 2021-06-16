import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create, addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const ProteinesItem = (props) => {

  const [itemProteines, setItemProteines] = useState({
      id: props.itemProteines ? props.itemProteines.id : uuid(),
      favoris: props.itemProteines ? props.itemProteines.favoris : false, 
      name:props.itemProteines ? props.itemProteines.name : '', 
      qtte:props.itemProteines ? props.itemProteines.qtte : 0, 
      proteine:props.itemProteines ? props.itemProteines.proteine : 0, 
      glucide:props.itemProteines ? props.itemProteines.glucide : 0, 
      fibre:props.itemProteines ? props.itemProteines.fibre : 0, 
      gras:props.itemProteines ? props.itemProteines.gras : 0, 
      unit: props.itemProteines ? props.itemProteines.unit : ''
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemProteines({ ...itemProteines, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemProteines);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemProteines.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={itemProteines.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={itemProteines.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={itemProteines.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={itemProteines.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={itemProteines.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={itemProteines.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const NourrProteines = (props) => {

  const [proteines, setProteines] = useState(props.proteines);
  const [proteinesToEdit, setProteinesToEdit] = useState(undefined);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  
  // update state on prop change
  useEffect(() => {
    setProteines(props.proteines);
  }, [props.proteines])

  const updateFavorisStatus = (event, index) => {
    event.stopPropagation();
    var array = [...proteines];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[index].favoris = true;
      
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.proteines.proteines.unshift(array[index]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard); 
    } else {
      event.target.style.color = '';
      array[index].favoris = false;
    }
    setProteines(array);

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const deleteItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...proteines];
    array.splice(item, 1);
    setProteines (array);
    closeItemContainer();
    
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.proteines.proteines= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const closeItemContainer = () => {
    setProteinesToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setProteinesToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setProteinesToEdit(proteines[index]);
    setItemContainerDisplayStatus(true);
  }

  const saveItem = (item) => {
    console.log("save Item::"+JSON.stringify(item))
    var array = [...proteines];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setProteines (array);
    closeItemContainer();

    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.proteines.proteines= array;
    console.log("Loading Settings From localStorage when save..."+JSON.stringify(settings));
    localStorage.setItem('settings', JSON.stringify(settings));
    console.log("Verif de settings..."+JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const updateCacheAndBD = (proteines) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.proteines.proteines= proteines;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { proteines.map((pro, index) => (      
            <IonItem className="divTitre11" key={pro.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{pro.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{pro.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={pro.unit} disabled="disabled">
                <option value3="-1"></option>
                <option value3="gr">gr</option>
                <option value3="oz">oz</option>
                <option value3="ml">ml</option>
                <option value3="tasse">tasse</option>
                <option value3="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{pro.gras}</b></div>
                <div className="triangleText2-2"><b>{pro.proteine}</b></div>
                <div className="triangleText3-3"><b>{pro.fibre}</b></div>
                <div className="triangleText4-4"><b>{pro.glucide}</b></div>         
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
        <IonIcon icon={addCircle}/><label className="labelAddItem">Proteines</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <ProteinesItem close={closeItemContainer} item={proteinesToEdit} save={(itemProteines) => saveItem(itemProteines)}/>}
    </div> 
  );
}
export default NourrProteines;
