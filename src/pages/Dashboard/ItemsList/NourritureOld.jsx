import React, {useState}  from "react"
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import {arrowDropdownCircle, star} from 'ionicons/icons';

import '../../Tab1.css';

const HydrateItem = (props) => {

  const [itemDashNourriture, setItemDashNourriture] = useState({
    id: props.itemDashNourriture ? props.itemDashNourriture.id : uuid(),
    favoris: props.itemDashNourriture ? props.itemDashNourriture.favoris : false, 
    name:props.itemDashNourriture ? props.itemDashNourriture.name : '', 
    qtte:props.itemDashNourriture ? props.itemDashNourriture.qtte : 0, 
    proteine:props.itemDashNourriture ? props.itemDashNourriture.proteine : 0, 
    glucide:props.itemDashNourriture ? props.itemDashNourriture.glucide : 0, 
    fibre:props.itemDashNourriture ? props.itemDashNourriture.fibre : 0, 
    gras:props.itemDashNourriture ? props.itemDashNourriture.gras : 0, 
    unit: props.itemDashNourriture ? props.itemDashNourriture.unit : '',
    consumption: props.itemDashNourriture ? props.itemDashNourriture.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashNourriture({ ...itemDashNourriture, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashNourriture);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemDashNourriture.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashNourriture.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashNourriture.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Prot" name="proteine" value={itemDashNourriture.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashNourriture.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashNourriture.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashNourriture.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

const Nourriture = (props) => {
  

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }    
  }

  
    
  return (
    <div>
      <IonItem className="divTitre2">
        <IonAvatar slot="start">
          <img src="/assets/nutrition.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Nourriture</b></h2>
        </IonLabel>
        <IonInput className='inputTextGly' readonly color="danger" value={""}></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV2")}/>
      </IonItem> 
      <div id="myDIV2">
        <IonItem>     
          <IonRow>
            <IonCol size="6">
              <IonLabel className = 'joggingTitle'><h3>Proteines</h3></IonLabel>
            </IonCol>
            <IonCol size="6" >
              <IonInput className='inputTextActivities' color="danger" value={""} placeholder="______" onIonChange={""}></IonInput>  
            </IonCol>
          </IonRow>
        </IonItem>
      </div>       
    </div>    
  );
}
export default Nourriture;