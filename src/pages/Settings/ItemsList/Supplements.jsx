import React, {useState} from 'react';
import { IonButton, IonRow, IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle, addCircle, star} from 'ionicons/icons';
import {Supp} from '../../Data/Supp';
import Supplements from '../Supplements';
import uuid from 'react-uuid';

import '../../../pages/Tab1.css';

//Open items Div
const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
    
  }

const Supplement = () => {

  const [supp, setSupp] = useState(Supp);
  const [textDescripSupp, setTextDescripSupp] = useState();
  const [textQtteSupp, setTextQtteSupp] = useState();
  const [textProteineSupp, setTextProteineSupp] = useState();
  const [textGlucideSupp, setTextGlucideSupp] = useState();
  const [textFibreSupp, setTextFibreSupp] = useState();
  const [textGrasSupp, setTextGrasSupp] = useState();
  const [unitSupp, setUnitSupp] = useState();
  const [etatFavorisSupp, setEtatFavorisSupp] = useState();
  const [idSupp, setIdSupp] = useState(uuid());
      
  //Add item Supplements
  const addItemSupp=()=>{
    const obj = { idSupp: uuid(), favoris:false, name: textDescripSupp, qtte: Number(textQtteSupp), 
                  glucide:Number(textGlucideSupp), proteine:Number(textProteineSupp),
                  fibre:Number(textFibreSupp), gras:Number(textGrasSupp),
                  unit:(unitSupp)};     
      const newArray = supp.slice(); // Creer une copie du tableau
      newArray.unshift(obj); //push(obj); // inserer le nouvel elément dans le tableau
      setSupp(newArray);
  }
  
  //delete item Supplements
  const delItemSupp=(index, e)=>{
    const array = [...supp];
    array.splice(index, 1);
    setSupp(supp)
  }
  //edit item Supplements
  const editItemSupp=(index)=>{
    buttonDivEditSupp();
    const obj = { idSupp: uuid(), favoris:false, name: textDescripSupp, qtte: Number(textQtteSupp), 
      glucide:Number(textGlucideSupp), proteine:Number(textProteineSupp),
      fibre:Number(textFibreSupp), gras:Number(textGrasSupp),
      unit:(unitSupp)};          
    const array = [...supp];
    array.splice(index, 1);
    setSupp(supp);
    array.splice(index, 0, obj);
    setSupp(supp);
  }

  const buttonDivEditSupp=()=>{
    const divElt=document.getElementById('divPopUp6-6');
    if (divElt) {
        (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  //Button add Supplements item
  const buttonOkSupp = (divName)=>{
    addItemSupp();
    divClose(divName)
  }
  //Button edit Supplements item
  const buttonEditSupp = (divName,index)=>{
    editItemSupp(index);
  //this.divClose(divName)
  }
  //input et radio change Supplements
  const ChangeNameSupp = (event) => {
    setTextDescripSupp(event.target.value);
  }
  const ChangeQtteSupp=(event)=>{
    setTextQtteSupp(event.target.value);
  }
  const ChangeProteineSupp=(event)=>{
    setTextProteineSupp(event.target.value);
  }
  const ChangeGlucideSupp=(event)=>{
    setTextGlucideSupp(event.target.value);
  }
  const ChangeFibreSupp=(event)=>{
    setTextFibreSupp(event.target.value);
  }
  const ChangeGrasSupp=(event)=>{
    setTextGrasSupp(event.target.value);
  }
  
  //Icon star change Supplements
  const favorisSupp=(ind,e)=>{
    const index = supp.findIndex((hydra)=>{
      return hydra.id===ind;
  });
    ind = index;
    console.log(e.currentTarget)
  }

  //Div addItem close
  const divClose=(divId)=>{
    const divElt=document.getElementById(divId);
    if (divElt) {
        divElt.style.display = "none"
    } 
  }
  //Div editItem close
  const divCloseEdit=()=>{
    const divElt=document.getElementById('divPopUp1-1');
    if (divElt) {
        divElt.style.display = "none";    
    }
}
  //Div addItem open
  const divOpen=(divId)=>{
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }
  //check radio button
  const handleClick = event => {
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17'     
    } else {
      event.target.style.color = ''
    }
   }
   const unitchoice=(event)=>{
    setUnitSupp(event.target.value);
  }

  return (
    <div>
      {/* Entête suppléments */}
      <IonItem className="divTitre3">
        <IonAvatar slot="start">
          <img src="/assets/Supp.jpeg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Suppléments et médicaments</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV6")} />
      </IonItem>
                  
      {/* Entête alcool */}
      <div>
        <div id="myDIV6"></div>
      </div>
    </div>       
  );
}
export default Supplement;