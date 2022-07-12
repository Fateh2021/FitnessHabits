import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonInput,
  IonButton,
  IonCol,
  IonRow,
  IonFooter,
  IonModal,
  IonToolbar,
  IonTitle,
  IonProgressBar
} from '@ionic/react';
import { arrowDropdownCircle, star, trash, addCircle, removeCircle, settings, create, cafe, arrowBack } from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase'


//Added to translator
import * as translate from '../../../translate/Translator';

import '../../../pages/Tab1.css';
import '../../../pages/hydratation.css';
import { calendarFormat } from 'moment';

var test = 0;


//TODO : Execute SonarQube to check the code quality
const HydrateItem = (props) => {

  var date;
  var today = new Date();
  date = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
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
    consumption: props.itemDashHydrate ? props.itemDashHydrate.consumption : 0,
    date: props.itemDashHydrate ? props.itemDashHydrate.date : date
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
          <IonInput className='divAddText' placeholder="Nom" name="name" value={itemDashHydrate.name}
            onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol size="2">
          <IonInput className='divAddText' type='number' placeholder="0" name="qtte"
            value={itemDashHydrate.qtte} onIonChange={handleChange}></IonInput>
        </IonCol>

        <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashHydrate.unit}
          onChange={handleChange}>
          <option value="-1"></option>
          <option value="gr">{translate.getText('UNIT_GR')}</option>
          <option value="oz">{translate.getText('UNIT_OZ')}</option>
          <option value="ml">{translate.getText('UNIT_ML')}</option>
          <option value="tasse">{translate.getText('UNIT_CUP')}</option>
          <option value="unite">{translate.getText('UNIT_TEXT')}</option>
        </select>
        <IonCol className="colNutProteinesHyd" size="1">
          <div className="divMacroAdd">Pro</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="proteine"
            value={itemDashHydrate.proteine} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol className="colNutGlucidesHyd" size="1">
          <div className="divMacroAdd">Glu</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="glucide"
            value={itemDashHydrate.glucide} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol className="colNutFibresHyd" size="1">
          <div className="divMacroAdd">Fib</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="fibre"
            value={itemDashHydrate.fibre} onIonChange={handleChange}></IonInput>
        </IonCol>
        <IonCol className="colNutGrasHyd" size="1">
          <div className="divMacroAdd">Gras</div>
          <IonInput className='divAddText' type='number' placeholder="0" name="gras"
            value={itemDashHydrate.gras} onIonChange={handleChange}></IonInput>
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
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
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
    dashboard.hydratation.dailyTarget.proteinConsumptionTot = totalProt();
    dashboard.hydratation.dailyTarget.glucideConsumptionTot = totalGlu();
    dashboard.hydratation.dailyTarget.fibreConsumptionTot = totalFib();
    dashboard.hydratation.dailyTarget.grasConsumptionTot = totalGr();


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
    dashboard.hydratation.dailyTarget.globalQuant = totalQuant();
    dashboard.hydratation.dailyTarget.proteinConsumptionTot = totalProt();
    dashboard.hydratation.dailyTarget.glucideConsumptionTot = totalGlu();
    dashboard.hydratation.dailyTarget.fibreConsumptionTot = totalFib();
    dashboard.hydratation.dailyTarget.grasConsumptionTot = totalGr();
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
    var quantite = 0;
    var consumption = 0;

    for (let value of array) {
      consumption = value.consumption;
      quantite = value.qtte;
      sumQuant += (quantite * consumption);
    }
    setGlobalQuant(sumQuant);
    return sumQuant
  }
  const totalProt = () => {
    var array = [...hydrates];
    var sumProt = 0;
    var prot = 0;
    var consumption = 0;


    for (let value of array) {
      consumption = value.consumption;
      prot = value.glucide;
      sumProt += (prot * consumption);
    }
    setGlobalProt(sumProt);
    return sumProt
  }
  const totalGlu = () => {
    var array = [...hydrates];
    var sumGlu = 0;
    var glu = 0;
    var consumption = 0;


    for (let value of array) {
      consumption = value.consumption;
      glu = value.glucide;
      sumGlu += (glu * consumption);
    }
    setGlobalGlu(sumGlu);
    return sumGlu
  }
  const totalFib = () => {
    var array = [...hydrates];
    var sumFib = 0;
    var fib = 0;
    var consumption = 0;


    for (let value of array) {
      consumption = value.consumption;
      fib = value.fibre;
      sumFib += (fib * consumption);
    }
    setGlobalFib(sumFib);
    return sumFib
  }
  const totalGr = () => {
    var array = [...hydrates];
    var sumGr = 0;
    var gr = 0;
    var consumption = 0;


    for (let value of array) {
      consumption = value.consumption;
      gr = value.gras;
      sumGr += (gr * consumption);
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

  const showDate = (hydrates) => {
    return hydrates.date;
  }

  const conversionQuantity = (hydrates) => {

    switch (hydrates.unit) {
      case "gr":
        return hydrates.qtte + " ml";
      case "oz":
        return hydrates.qtte * 29.6 + " ml";
      case "ml":
        return hydrates.qtte + " ml";
      case "tasse":
        return hydrates.qtte * 125 + " ml";
      case "unite":
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
  const handleCloseModal2 = () => {
    setShowModal2(false);
  }
  const handleCloseModal3 = () => {
    setShowModal3(false);
  }


  return (
    <React.Fragment>
      <div>

        <div className="hydButton divHydra">

          <div className="titreHydra" onClick={() => setShowModal(true)}>
            <span>
              {translate.getText("HYDR_TITLE")}
            </span>
          </div>


          <div className="titreLitre" onClick={() => setShowModal(true)}>
            <span>
              <text> 0.000 L </text>
            </span>
          </div>


          <div className="hydraCible" onClick={() => setShowModal(true)}>
            <span>
              {translate.getText("HYD_TITLE_TARGET")}
            </span>
            <span> <text> 0.000 L</text>  </span>
          </div>


          <div className="hydraLimite" onClick={() => setShowModal(true)}>
            <span>
              {translate.getText("HYD_TITLE_LIMITE")}
            </span>
            <span> <text> 0.000 L</text>  </span>
          </div>

          <div className="hydraAutre" onClick={() => setShowModal(true)}>
            <span>
              {translate.getText("HYD_TITLE_AUTRE")}
            </span>
          </div>


          <div><img className="hydImg" src="/assets/cup_water.png" alt=""
            onClick={() => setShowModal2(true)} />


          </div>

        </div>

        <IonModal isOpen={showModal}
          style="background: rgba(0, 0, 0, 0.5) !important; padding: 0% 0%  !important;"
          id="input-hydra-modal">
          <div className='fenetreModale'>
            <IonButton size="small"
              onClick={() => handleCloseModal()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <ion-header>
              <div style={{ clear: 'both' }}>
                <h3 style={{ color: '#70ACE8', float: 'left' }}>{translate.getText("HYDR_TITLE")} </h3>
                <h3 style={{
                  backgroundColor: '#ebf7f4',
                  color: '#707070',
                  float: 'right'
                }}>{translate.getText("HYD_TITLE_TARGET")} 1.000 L</h3>

              </div>

            </ion-header>
            <ion-body>
              <br />
              <br />
              <div style={{ clear: 'both' }}>
                <ion-row>


                  <IonCol size='8'>
                    <h4 style={{ color: '#707070', float: 'left' }}>{translate.getText("HYD_TEXT_QUANT")}: </h4>
                  </IonCol>
                  <IonCol size='4'>
                    <ion-item lines="none">
                      <IonInput className='divtotalQuant' readonly type='number' name=""
                        value={globalQuant} onIonChange={totalQuant} />
                      <h4 style={{ color: '#707070', float: 'left' }}>mL</h4>
                    </ion-item>
                  </IonCol>
                </ion-row>
              </div>

              <div className='modaleBar' style={{ borderBottom: '0.5px solid silver' }}>

                <IonProgressBar value={0.5}></IonProgressBar><br />
              </div>
            </ion-body>
            <p style={{ color: '#707070' }}>{translate.getText("HYD_TEXT_GRAPH")}</p>

            <div className="divHyd" style={{ height: 'auto' }}>
              <div>
                {hydrates.map((hydra, index) => (
                  <IonItem className="" key={hydra.id}>
                    <ion-grid fixed>
                      <ion-row justify-content-center align-items-center>
                        <ion-col size="7">
                          <IonToolbar>
                            <IonTitle size="small">{hydra.name}</IonTitle>
                            <ion-card-subtitle> {translate.getText("HYD_QUANT_BUE")} : {conversionQuantity(hydra)} </ion-card-subtitle>
                            <ion-card-subtitle> {translate.getText("HYD_DATE")} :  {showDate(hydra)} </ion-card-subtitle>

                          </IonToolbar>
                        </ion-col>
                        <ion-col size="5">
                          <IonToolbar>
                            <ion-grid fixed>
                              <ion-col size="6">
                                <IonButton size="small"
                                  onClick={() => deleteItemHydrate(index)}>
                                  <IonIcon icon={trash} />
                                </IonButton>
                              </ion-col>

                              <ion-col size="6">
                                <IonButton size="small"
                                 onClick={() => setShowModal3(true)}>
                                  <IonIcon icon={create} />
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
            <div className="ajoutBotton" style={{
              display: 'flex',
              flexDirection: 'column',
              height: '50px',
              backgroundColor: '#ffff',
              position: 'fixed',
              bottom: '2px'
            }}>
              {/*<IonButton className="ajoutbreuvage1" color="primary" size="large"*/}
              {/*           onClick={() => openAddItemContainer()}>*/}
              {/*    <IonIcon icon={addCircle}/>*/}
              {/*    <label id="addDrink"*/}
              {/*           className="labelAddItem">{translate.getText('HYD_BUTTON_ADD_DRINK')}*/}
              {/*    </label></IonButton>*/}
              {itemContainerDisplayStatus && <HydrateItem close={closeItemContainer} item={hydrateToEdit}
                save={(itemDashHydrate) => saveItem(itemDashHydrate)} />}

              <IonIcon icon={settings} size="large" style={{ "margin-left": "85%" }}
                onClick={() => openAddItemContainer()} />
            </div>
          </div>
        </IonModal>
      </div>
      {/*Modale2*/}
      <div>
        <IonModal isOpen={showModal2}
          style="background: rgba(0, 0, 0, 0.5) !important; padding: 0% 0%  !important;"
          id="input-hydra-modal" >
          <div className='fenetreModale'>
            <IonButton size="small"
              onClick={() => handleCloseModal2()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <ion-header>
              <ion-row>
                <div style={{ clear: 'both' }}>
                  <h3 style={{ color: '#70ACE8', float: 'left' }}>{translate.getText("HYDR_TITLE")}</h3>

                </div>
              </ion-row>
              <ion-row>
                <IonCol size='8'>
                  <h4 style={{ color: '#707070', float: 'left' }}>{translate.getText("HYD_TEXT_QUANT")}: </h4>
                </IonCol>
                <IonCol size='4'>
                  <ion-item lines="none">
                    <IonInput className='divtotalQuant' readonly type='number' name=""
                      value={globalQuant} onIonChange={totalQuant} />
                    <h4 style={{ color: '#707070', float: 'left' }}>mL</h4>
                  </ion-item>
                </IonCol>
              </ion-row>
              <div className='macro'>
                <ion-grid class="ion-no-padding">
                  <ion-row class="ion-float-left">
                    <ion-col class="ion-no-margin">
                      <ion-item lines="none">
                        <div style={{ color: '#707070' }}>Gr :</div>
                        <IonInput placeholder='0.000' className='divAddTextNut nourTextInput'
                          disabled type='number' name="" value={grasConsumptionTot}
                          onIonChange={totalGr} />
                      </ion-item>
                    </ion-col>
                    <ion-col>
                      <ion-item lines="none">
                        <div style={{ color: '#707070' }}> Prot :</div>
                        <IonInput placeholder='0.000' className='divAddTextNut nourTextInput'
                          disabled type='number' name="" value={proteinConsumptionTot}
                          onIonChange={totalProt} />
                      </ion-item>
                    </ion-col>
                    <ion-col>
                      <ion-item lines="none">
                        <div style={{ color: '#707070' }}> F :</div>
                        <IonInput placeholder='0.000' className='divAddTextNut nourTextInput'
                          disabled type='number' name="" value={fibreConsumptionTot}
                          onIonChange={totalFib} />
                      </ion-item>
                    </ion-col>
                    <ion-col>
                      <ion-item lines="none">
                        <div style={{ color: '#707070' }}> Gl :</div>
                        <IonInput placeholder='0.000' className='divAddTextNut nourTextInput'
                          disabled type='number' name="" value={glucideConsumptionTot}
                          onIonChange={totalGlu} />
                      </ion-item>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
            </ion-header>
            <ion-body>
              <p style={{ color: '#707070' }}>&ensp;&ensp;{translate.getText("HYD_NOM")} &ensp;&ensp; &ensp;{translate.getText("HYD_QUANT")} (ml)</p>
            </ion-body>
            <div className="divHyd" style={{ height: 'auto' }}>
              <div>
                {hydrates.map((hydra, index) => (
                  <IonItem className="" key={hydra.id}>
                    <ion-grid class="ion-no-padding">


                      <ion-row>

                        <ion-col size='3'>

                          <IonTitle size="small">{hydra.name}</IonTitle>

                        </ion-col>
                        <ion-col size='3'>
                          <ion-item lines="none">

                            <select type="dropdown">
                              <option>250</option>
                              <option>350</option>
                              <option>500</option>
                            </select>

                          </ion-item>
                        </ion-col>

                       {/*
                       <IonIcon icon={cafe}></IonIcon>*/}

                        <ion-col size='2'>
                          <IonButton className="trashButton" color="danger" size="small"
                            onClick={() => DailyConsumptionDecrementHydrate(index)}>
                            <IonIcon icon={removeCircle} />
                          </IonButton>

                        </ion-col>
                        <ion-col size='2'>
                          <IonTitle size="small">{hydra.consumption}</IonTitle>
                        </ion-col>
                        <ion-col size='2'>
                          <IonButton size="small"
                            onClick={() => DailyConsumptionIncrement(index)}>
                            <IonIcon icon={addCircle} />
                          </IonButton>
                        </ion-col>

                      </ion-row>
                    </ion-grid>


                    
                  </IonItem>
                ))
                }
              </div>
            </div>

            <div className="ajoutBotton" style={{
              display: 'flex',
              flexDirection: 'column',
              height: '10px',
              backgroundColor: '#ffff',
              position: 'fixed',
              bottom: '2px'
            }}>
              <IonButton className="ajoutbreuvage1" color="primary" size="large"
                onClick={() => openAddItemContainer()}>
                <IonIcon icon={addCircle} />
                <label id="addDrink"
                  className="labelAddItem">{translate.getText('HYD_BUTTON_ADD_DRINK')}
                </label></IonButton>
              {itemContainerDisplayStatus && <HydrateItem close={closeItemContainer} item={hydrateToEdit}
                save={(itemDashHydrate) => saveItem(itemDashHydrate)} />}
            </div>

          </div>

        </IonModal>

      </div>
      <div>
       <IonModal isOpen={showModal3} onDidDismiss={handleCloseModal3}
                        style="background: rgba(0, 0, 0, 0.5) !important; padding:50% 20%  !important;"
                        id="input-hydra-modal">
                        <div className='fenetreModale'>

                          <ion-header>
                          </ion-header>
                          <ion-body>
                          {hydrates.map((hydra, index) => {
                                if(index==1){
                                   return(  <IonItem ngIf="index !=1" className="" key={hydra.id}>
                                         <ion-grid class="ion-no-padding">


                                          <ion-row>

                                          <ion-col size='3'>

                                          <IonTitle size="small">{hydra.name}</IonTitle>

                                          </ion-col>
                                          <ion-col size='3'>
                                          <ion-item lines="none">

                                           <select type="dropdown">
                                                <option>250</option>
                                                <option>350</option>
                                                <option>500</option>
                                            </select>

                                           </ion-item>
                                           </ion-col>
                                            <ion-col size='2'>
                                             </ion-col>
                                           </ion-row>
                                        </ion-grid>
                                 </IonItem>)

                                }

                           })
                          }


                          </ion-body>
                        </div>
              </IonModal>
      </div>
    </React.Fragment>


  );
}
export default Hydratation;
