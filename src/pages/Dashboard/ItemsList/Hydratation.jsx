import React, { useState, useEffect } from 'react';
import { IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton, IonCol, IonFooter, IonModal,IonToolbar,IonTitle } from '@ionic/react';
import { arrowDropdownCircle, star, trash, addCircle, removeCircle, create } from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'

//Added to translator
import * as translate from '../../../translate/Translator';

import '../../../pages/Tab1.css';
import '../../../pages/hydratation.css';

var test=0;


//TODO : Execute SonarQube to check the code quality
const HydrateItem = (props) => {
  // le header.. en gros ce qui apparait sur le dashboard
  const [itemDashHydrate, setItemDashHydrate] = useState({
    id: props.itemDashHydrate ? props.itemDashHydrate.id : uuid(),
    favoris: props.itemDashHydrate ? props.itemDashHydrate.favoris : false,
    name: props.itemDashHydrate ? props.itemDashHydrate.name : '', //c'est le nom du breuvage
    qtte: props.itemDashHydrate ? props.itemDashHydrate.qtte : 0,  //c'est la quantité du breuvage
    proteine: props.itemDashHydrate ? props.itemDashHydrate.proteine : 0,
    glucide: props.itemDashHydrate ? props.itemDashHydrate.glucide : 0,
    fibre: props.itemDashHydrate ? props.itemDashHydrate.fibre : 0,
    gras: props.itemDashHydrate ? props.itemDashHydrate.gras : 0,
    unit: props.itemDashHydrate ? props.itemDashHydrate.unit : '',
    consumption: props.itemDashHydrate ? props.itemDashHydrate.consumption : 0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashHydrate({ ...itemDashHydrate, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashHydrate);
  }


  const descPlaceholder = translate.getText('FOOD_MODULE', ['functions', 'add_description', 'placeholder']);

  // Ca c'est pour ajouter un item .. le footer
  return (
    <div id="divPopUp1-1">
      <IonCol size="1">
        <button className="buttonOK" onClick={saveChanges}>OK</button>
      </IonCol>
      <IonCol size="1">
        <span className="buttonCloseEdit" onClick={() => props.close()}>X</span>
      </IonCol>

      <IonItem className="divAdd">
        <IonCol size="1">
          <IonIcon className="starFavoris" icon={star} />
        </IonCol>
        <IonCol size="3">
          <IonInput className='divAddText' placeholder="Nom" name="name" value={itemDashHydrate.name} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol size="2">
          <IonInput className='divAddText' type='number' placeholder="0" name="qtte" value={itemDashHydrate.qtte} onIonChange={handleChange}></IonInput>
        </IonCol>
        <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashHydrate.unit} onChange={handleChange}>
          <option value="-1"></option>
          <option value="gr">{translate.getText('UNIT_GR')}</option>
          <option value="oz">{translate.getText('UNIT_OZ')}</option>
          <option value="ml">{translate.getText('UNIT_ML')}</option>
          <option value="tasse">{translate.getText('UNIT_CUP')}</option>
          <option value="unite">{translate.getText('UNIT_TEXT')}</option>
        </select>
        <IonCol className="colNutProteinesHyd" size="1"><div className="divMacroAdd">Pro</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="proteine" value={itemDashHydrate.proteine} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol className="colNutGlucidesHyd" size="1"><div className="divMacroAdd">Glu</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="glucide" value={itemDashHydrate.glucide} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol className="colNutFibresHyd" size="1"><div className="divMacroAdd">Fib</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="fibre" value={itemDashHydrate.fibre} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol className="colNutGrasHyd" size="1"><div className="divMacroAdd">Gras</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="gras" value={itemDashHydrate.gras} onIonChange={handleChange}></IonInput>
        </IonCol>
      </IonItem>
    </div>
  );
}

//---- Hydratation --------- la dispositon des éléments dans la fenetre modale
const Hydratation = (props) => {
  const [dailyTarget, setDailyTarget] = useState(props.hydrate.dailyTarget);
  const [hydrate, setHydrate] = useState(props.hydrate);
  const [hydrates, setHydrates] = useState(props.hydrate.hydrates);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [globalQuant, setGlobalQuant] = useState(props.globalQuant);
  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  
  const [proteinConsumptionTot, setGlobalProt] = useState(props.proteinConsumptionTot);  
  const [glucideConsumptionTot, setGlobalGlu] = useState(props.glucideConsumptionTot);
  const [fibreConsumptionTot, setGlobalFib] = useState(props.fibreConsumptionTot);
  const [grasConsumptionTot, setGlobalGr] = useState(props.grasConsumptionTot);
  

  const [showModal, setShowModal] = useState(false);
  const accor = (divId) => {
    const divElt = document.getElementById(divId);
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

  useEffect(() => {
    setGlobalQuant(props.globalQuant);
  }, [props.globalQuant])

  useEffect(() => {
    setHydrate(props.hydrate)
  }, [props.hydrate])

  useEffect(() => {
    setHydrates(props.hydrate.hydrates)
  }, [props.hydrate.hydrates])

  useEffect(() => {
    setGlobalProt(props.proteinConsumptionTot);
  }, [props.proteinConsumptionTot])

  useEffect(() => {
    setGlobalGlu(props.glucideConsumptionTot);
  }, [props.glucideConsumptionTot])

  useEffect(() => {
    setGlobalFib(props.fibreConsumptionTot);
  }, [props.fibreConsumptionTot])

  useEffect(() => {
    setGlobalGr(props.grasConsumptionTot);
  }, [props.grasConsumptionTot])

  const DailyConsumptionIncrement = (item) => {
    var array = [...hydrates];
    const index = array.findIndex((event) => event.id === item.id);
    if (index === 0) {
      array.find(item === array[item])
    } else {
      array[index] = item;
    }

    array[item].consumption += 1;
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.dailyTarget.globalConsumption = totalConsumption();
    dashboard.hydratation.dailyTarget.globalQuant = totalQuant();
    dashboard.hydratation.dailyTarget.proteinConsumptionTot=totalProt();
    dashboard.hydratation.dailyTarget.glucideConsumptionTot=totalGlu();
    dashboard.hydratation.dailyTarget.fibreConsumptionTot=totalFib();
    dashboard.hydratation.dailyTarget.grasConsumptionTot=totalGr();


    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  
  const DailyConsumptionDecrementHydrate = (item) => {
    var array = [...hydrates];
    const index = array.findIndex((event) => event.id === item.id);
    if (index === 0) {
      array.find(item === array[item]);
    } else {
      array[index] = item
    }

    if (array[item].consumption >= 1) {
      array[item].consumption -= 1;
    }
    updateCacheAndBD(array);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.dailyTarget.globalConsumption = totalConsumption();
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const totalConsumption = () => {
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
  const totalQuant = () => {
    var array = [...hydrates];
    var sumQuant = 0;
    var quantite=0;
    var consumption = 0;

    for (let value of array) {
      consumption = value.consumption;
      quantite = value.qtte;
      sumQuant += (quantite*consumption);
    }
    setGlobalQuant(sumQuant);
    return sumQuant
  }
  const totalProt = () => {
    var array = [...hydrates];
    var sumProt = 0;
    var prot=0;
    var consumption = 0;
   

      for (let value of array) {
        consumption = value.consumption;  
      prot = value.glucide;
      sumProt +=(prot*consumption);
    }
    setGlobalProt(sumProt);
    return sumProt
  }
  const totalGlu = () => {
    var array = [...hydrates];
    var sumGlu = 0;
    var glu=0;
    var consumption = 0;
   

      for (let value of array) {
        consumption = value.consumption;  
      glu = value.glucide;
      sumGlu +=(glu*consumption);
    }
    setGlobalGlu(sumGlu);
    return sumGlu
  }
  const totalFib = () => {
    var array = [...hydrates];
    var sumFib = 0;
    var fib=0;
    var consumption = 0;
   

      for (let value of array) {
        consumption = value.consumption;  
      fib = value.fibre;
      sumFib +=(fib*consumption);
    }
    setGlobalFib(sumFib);
    return sumFib
  }
  const totalGr = () => {
    var array = [...hydrates];
    var sumGr = 0;
    var gr=0;
    var consumption = 0;
   

      for (let value of array) {
        consumption = value.consumption;  
      gr = value.gras;
      sumGr +=(gr*consumption);
    }
    setGlobalGr(sumGr);
    return sumGr
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
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const saveItem = (item) => {
    var array = [...hydrates];
    const index = array.findIndex((e) => e.id === item.id);
    if (index === -1) {
      array.unshift(item);
    } else {
      array[index] = item;
    }
    setHydrates(array);
    closeItemContainer();
    updateCacheAndBD(array);
  }

  const updateCacheAndBD = (hydrates) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.hydratation.hydrates = hydrates;
    setHydrates(hydrates)
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const conversionQuantity = (hydrates) => {

    switch(hydrates.unit){
      case "gr" :
        return hydrates.qtte + " ml";
      case "oz" :
        return hydrates.qtte * 29.6 + " ml";
      case "ml" : 
        return hydrates.qtte + " ml";
      case "tasse" :
        return hydrates.qtte * 125 + " ml";
      case "unite" :
        return hydrates.qtte * 1 + " ml";
    } 
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }


  const editNameBeverage = (index) => {
    setHydrateToEdit(hydrates[undefined]);
    setItemContainerDisplayStatus(true);
  }

  const handleCloseModal = () => {
      setShowModal(false);
    }
  
  return (
    <div onClick={() => setShowModal(true)}>

      <div className="hydButton divHydra" >

        <div className="titreHydra">
          <span>
            {translate.getText("HYDR_TITLE")}
          </span>
        </div>


        <div className="titreLitre">
          <span>
            <text> 0.000 L </text>
          </span>
        </div>


        <div className="hydraCible">
          <span > <text> Cible : 0.000 L</text>  </span>
        </div>


        <div className="hydraLimite">
          <span > <text> Limite : 0.000 L</text>  </span>
        </div>

        <div className="hydraAutre">
          <span > <text> Autres informations</text>  </span>
        </div>



        <div> <img className="hydImg" src="/assets/cup_water.png" alt="" />


        </div>

      </div>
     
      <IonModal isOpen={showModal} style="background: rgba(0, 0, 0, 0.5) !important; padding: 0% 10%  !important;" id="input-hydra-modal" onDidDismiss={handleCloseModal}  >
        <div >
          <ion-header>
            <div style={{ clear: 'both' }}>
              <h3 style={{ color: '#70ACE8', float: 'left' }}>&emsp;Hydratation </h3>
              <h3 style={{ backgroundColor: '#ebf7f4', color: '#707070', float: 'right' }} >Cible: 1.000 L &emsp;</h3>
            </div>

          </ion-header>
          <ion-body>
            <br />
            <IonCol>
              <h4 style={{ color: '#707070', float: 'left' }}>&emsp;Quantité totale bue :</h4>
            </IonCol>
            
            <IonCol>
              <ion-item lines="none" size="large">
                <IonInput className='divAddTextNut nourTextInput' type='number' name="" value={globalConsumption} onIonChange={totalConsumption} />
              verre <hr />
              <IonInput className='divAddTextNut nourTextInput' type='number' name="" value={globalQuant} onIonChange={totalQuant} />
               mL
              </ion-item>
            </IonCol>           

            <ion-row>

            <ion-col size="3.3" >
                  <ion-item>

                    <div item-left style={{ color: '#707070', float: 'left' }}>Prot :</div>
                    <IonInput style={{ float: 'right' }} class="ion-padding" className='divAddTextNut nourTextInput' type='number' name="" value={proteinConsumptionTot} onIonChange={totalProt} />
                  </ion-item>
                </ion-col>

                <ion-col  >
                  <ion-item>

                    <div item-left style={{ color: '#707070', float: 'left' }}>Gr :</div>
                    <IonInput style={{ float: 'right' }} class="ion-padding" className='divAddTextNut nourTextInput' type='number' name="" value={grasConsumptionTot} onIonChange={totalGr} />
                  </ion-item>
                </ion-col>

                <ion-col>
                  <ion-item>

                    <div item-left style={{ color: '#707070', float: 'left' }}>F :</div>
                    <IonInput style={{ float: 'right' }} class="ion-padding" className='divAddTextNut nourTextInput' type='number' name="" value={fibreConsumptionTot} onIonChange={totalFib} />
                  </ion-item>
                </ion-col>
                <ion-col>
                  <ion-item>

                    <div item-left style={{ color: '#707070', float: 'left' }}>Gl :</div>
                    <IonInput style={{ float: 'right' }} class="ion-padding" className='divAddTextNut nourTextInput' type='number' name="" value={glucideConsumptionTot} onIonChange={totalGlu} />
                  </ion-item>
                </ion-col>
              </ion-row>
            

          </ion-body>
          <p style={{ color: '#707070' }}>&ensp; &ensp; &ensp;Afficher le graphique</p>

          <div className="divHyd" style={{ height: 'auto' }}>
            <div  >
              {hydrates.map((hydra, index) => (
                <IonItem className="" key={hydra.id}>
                  <ion-grid fixed>
                    <ion-row justify-content-center align-items-center>
                      <ion-col size="7">
                        <IonToolbar>
                            <IonTitle size="small">{hydra.name}</IonTitle>
                            <ion-card-subtitle> Quantité bue: {conversionQuantity(hydra)} </ion-card-subtitle>
                            <ion-card-subtitle> Date : i don't know yet </ion-card-subtitle>

                        </IonToolbar>
                      </ion-col>
                      <ion-col size="5" >
                      <IonToolbar>
                          <ion-grid fixed>
                             <ion-col size="6">
                                  <IonButton size="small" onClick={() => DailyConsumptionIncrement(index)}>
                                        <IonIcon icon={addCircle} />
                                  </IonButton>
                             </ion-col>

                             <ion-col size="6">
                                  <IonButton size="small" onClick={() => deleteItemHydrate(index)}>
                                        <IonIcon icon={trash} />
                                  </IonButton>
                             </ion-col>
                          </ion-grid>

                       </IonToolbar>

                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </IonItem>
              ))
              }
            </div>
          </div>

          <div className="ajoutBotton" style={{ display: 'flex', flexDirection: 'column', height: '50px', backgroundColor: '#ffff', position: 'fixed', bottom:'2px' }} >
            <IonButton className="ajoutbreuvage1" color="primary" size="large" onClick={() => openAddItemContainer()}>
              <IonIcon icon={addCircle} />
              <label id="addDrink" className="labelAddItem">{translate.getText('HYD_BUTTON_ADD_DRINK')}
              </label></IonButton>
            {itemContainerDisplayStatus && <HydrateItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashHydrate) => saveItem(itemDashHydrate)} />}
          </div>

        </div>

      </IonModal>
    </div>

  );
}
export default Hydratation;
