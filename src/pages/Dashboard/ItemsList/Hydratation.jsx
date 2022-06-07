import React, {useState, useEffect} from 'react';
import { IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton, IonCol,IonFooter , IonModal} from '@ionic/react';
import { arrowDropdownCircle, star, trash, addCircle, removeCircle, create} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'

//Added to translator
import * as translate from '../../../translate/Translator';

import '../../../pages/Tab1.css';
//TODO : Execute SonarQube to check the code quality
const HydrateItem = (props) => {

  const [itemDashHydrate, setItemDashHydrate] = useState({
    id: props.itemDashHydrate ? props.itemDashHydrate.id : uuid(),
    favoris: props.itemDashHydrate ? props.itemDashHydrate.favoris : false, 
    name:props.itemDashHydrate ? props.itemDashHydrate.name : '', 
    qtte:props.itemDashHydrate ? props.itemDashHydrate.qtte : 0, 
    proteine:props.itemDashHydrate ? props.itemDashHydrate.proteine : 0, 
    glucide:props.itemDashHydrate ? props.itemDashHydrate.glucide : 0, 
    fibre:props.itemDashHydrate ? props.itemDashHydrate.fibre : 0, 
    gras:props.itemDashHydrate ? props.itemDashHydrate.gras : 0, 
    unit: props.itemDashHydrate ? props.itemDashHydrate.unit : '',
    consumption: props.itemDashHydrate ? props.itemDashHydrate.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashHydrate({ ...itemDashHydrate, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashHydrate);
  }

  const descPlaceholder = translate.getText('FOOD_MODULE', ['functions', 'add_description', 'placeholder']);


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
            <IonInput className = 'divAddText' placeholder={ descPlaceholder } name="name" value={itemDashHydrate.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashHydrate.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashHydrate.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">{translate.getText('UNIT_GR')}</option>
            <option value="oz">{translate.getText('UNIT_OZ')}</option>
            <option value="ml">{translate.getText('UNIT_ML')}</option>
            <option value="tasse">{translate.getText('UNIT_CUP')}</option>
            <option value="unite">{translate.getText('UNIT_TEXT')}</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1"><div className ="divMacroAdd">Pro</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Pro" name="pro" value={itemDashHydrate.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1"><div className ="divMacroAdd">Glu</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashHydrate.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1"><div className ="divMacroAdd">Fib</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashHydrate.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1"><div className ="divMacroAdd">Gras</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashHydrate.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
}

//---- Hydratation ---------
const Hydratation = (props) => {
  const [dailyTarget, setDailyTarget] = useState(props.hydrate.dailyTarget);
  const [hydrate, setHydrate] = useState(props.hydrate);
  const [hydrates, setHydrates] = useState(props.hydrate.hydrates);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      if ((!divElt.style.display || divElt.style.display === "none")) {
        divElt.style.display = "block";
      } else {
        divElt.style.display = "none";
      }
    }
  }

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyTarget(props.hydrate.dailyTarget);
  }, [props.hydrate.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(()=>{
    setHydrate(props.hydrate)
  }, [props.hydrate])

  useEffect(()=>{
    setHydrates(props.hydrate.hydrates)
  }, [props.hydrate.hydrates])

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...hydrates];
    const index = array.findIndex((event) => event.id === item.id);
    if (index === 0) {
      array.find (item === array[item])
    } else {
      array[index] = item;
    }

    array[item].consumption += 1;
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const DailyConsumptionDecrementHydrate = (item)=>{  
    var array = [...hydrates];
    const index = array.findIndex((event) => event.id === item.id); 
    if (index === 0) {
      array.find(item === array[item]);
    } else {
      array[index] = item
    }

    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const totalConsumption = ()=>{
    var array = [...hydrates];
    var sum = 0;
    var consumption = 0;
    for (let value of array) {
      consumption = value.consumption;
      sum += consumption;
    }
    setGlobalConsumption(sum);
    return sum
  }

  const deleteItemHydrate = (item) => {
    var array = [...hydrates];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);
    if (index === -1) {
      array.splice(item, 1);
    } else {
      array[item] = item;
    }
    setHydrates(array)
    for (let value in array) {
      consumption = array[value].consumption;
      sum += consumption;
    }
    setGlobalConsumption(sum);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.hydrates = array;
    dashboard.hydratation.dailyTarget.globalConsumption = sum;    
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const saveItem = (item) => {
    var array = [...hydrates];
    const index = array.findIndex((e) => e.id === item.id);
    if (index === -1) {
      array.unshift(item);
    } else {
      array[index] = item;
    }
    setHydrates (array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (hydrates) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.hydrates= hydrates;
    setHydrates(hydrates)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  return (
    <div>
      <IonItem className="divTitre1">
        <IonAvatar slot="start"><img src="/assets/Hydratation.jpeg" alt=""/></IonAvatar>
        <IonLabel id="hydrationTitle">
          <h2>
            <b>{translate.getText("HYDR_TITLE")}</b>
          </h2>
          </IonLabel>
        <IonInput className='inputTextGly' value = {globalConsumption} readonly></IonInput> 
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => setShowModal(true)} />
      </IonItem>
    <IonModal isOpen={showModal} style="background: rgba(0, 0, 0, 0.5) !important; padding: 20% 10%  !important;"  id="input-hydra-modal" onDismiss={ () => props.setShowModal(false)}  >
      <div>
       <ion-header>
             <div style={{clear:'both'}}>
                <h3 style={{color: '#70ACE8',float: 'left'}}>&emsp;Hydratation </h3>
                <h3  style={{backgroundColor: '#ebf7f4', color:'#707070', float:'right' }} >Cible: 0.000 L &emsp;</h3>
             </div>

       </ion-header>
       <ion-body>
            <h4  style={{ color:'#707070' }}>&emsp;Quantité totale bue : 0.000 L</h4>
            <div style={{clear:'both'}}>
                <p style={{ color:'#707070',float:'right' }}>Gr : 000g &ensp;</p>
                <p style={{ color:'#707070',float:'left' }}>&ensp;Prot : 000g</p>
            </div>

            <p style={{ color:'#707070' ,float:'right' }}>F : 000g&ensp;</p>
            <p style={{ color:'#707070',float:'left' }}>&ensp;Gl : 000g</p>

       </ion-body>
        <p style={{ color:'#707070'  }}>&ensp; &ensp; &ensp;Afficher le graphique</p>

          <div className="divHyd" style={{height: '80%'}}>
            <div className="sett" >
              { hydrates.map((hydra, index) => (
                <IonItem className=""  key={hydra.id}>
                    <ion-grid fixed>
                        <ion-row justify-content-center align-items-center>
                            <ion-col size="8">
                               <ion-card >
                                    <ion-card-header>
                                        <ion-card-title>{hydra.name}</ion-card-title>
                                        <ion-card-subtitle> <p>Quantité bue: <IonInput className='inputTextDashboard' value = {hydra.consumption} readonly></IonInput></p> </ion-card-subtitle>
                                        Date :
                                    </ion-card-header>
                                    <ion-card-content>
                                        i don't know yet
                                    </ion-card-content>
                               </ion-card>
                            </ion-col>
                            <ion-col size="4" >
                            <ion-card >
                                <ion-card-content class="ion-text-center">
                                     <IonButton    size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                                                                                              <IonIcon  icon={addCircle} />
                                      </IonButton>

                                       <IonButton  size="small" onClick={() => DailyConsumptionIncrement(index)}>
                                              <IonIcon icon={create}/>
                                        </IonButton>

                                      <IonButton  size="small" onClick={() => deleteItemHydrate(index)}>
                                                          <IonIcon icon={trash}/>
                                      </IonButton>

                                </ion-card-content>
                                  </ion-card>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </IonItem>
                ))
              }
            </div>
          </div>

             <div className="ajoutBotton"  style= {{ display: 'flex',flexDirection: 'column',height: '100px', backgroundColor:'#ffff' }} >
               <IonButton className="ajoutbreuvage1" color="primary" size="large" onClick={() => openAddItemContainer()}>
               <IonIcon icon={addCircle}/>
               <label id="addDrink"  className="labelAddItem">{ translate.getText('HYD_BUTTON_ADD_DRINK') }
               </label></IonButton>
                {itemContainerDisplayStatus && <HydrateItem  close={closeItemContainer} item={hydrateToEdit} save={(itemDashHydrate) => saveItem(itemDashHydrate)}/>}
             </div>




        </div>


    </IonModal>
    </div>

  );
}
export default Hydratation;