import React, { useState, useEffect } from "react"
import firebase from "firebase"
import DatePicker from "react-datepicker"
import { arrowDropleftCircle, arrowDroprightCircle, arrowDropdownCircle, settings } from "ionicons/icons";
import {
    IonContent, IonList, IonPage, IonTabBar, IonIcon, IonTabButton, IonLabel, IonFooter,
    IonGrid, IonCol, IonRow, IonAlert, IonItem, IonAvatar, IonInput, IonButton
} from "@ionic/react";
import Profil from "./Profil/Profil";
import Fruit from "./ItemsList/Food/Fruit"
import ProteinFood from "./ItemsList/Food/ProteinFood"
import Vegetables from "./ItemsList/Food/Vegetables"
import GrainFood from "./ItemsList/Food/GrainFood"
import DairyProducts from "./ItemsList/Food/DairyProducts";

import Hydratation from "./ItemsList/Hydratation";
import Glycemie from "./ItemsList/Glycemie"
import Supplements from "./ItemsList/Supplements";
import Toilettes from "./ItemsList/Toilettes";
import Activities from "./ItemsList/Activities";
import Sommeil from "./ItemsList/Sommeil";
import AlcoolList from "./ItemsList/Alcool/AlcoolList";
import Poids from "./ItemsList/Poids"
import DefaultDashboard from "./DefaultDashboard"
import FormatDate from "../../DateUtils"

import "../Tab1.css";
import Home from "../Footer/Home";
import Export from "../Footer/Export";
import * as translate from "../../translate/Translator";

import AlcoolService from "../../services/AlcoolService";

const Dashboard = (props) => {
    const [showAlert6, setShowAlert6] = useState(false);
    const [toDay, setToDaye] = useState({startDate: new Date()});
    const [currentDate, setCurrentDate] = useState({startDate: new Date()});
    const [formatedCurrentDate, setFormatedCurrentDate] = useState("");
    const [localday, setLocalday] = useState({startDate: new Date().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    })});

    /* useless comment */

    const accor = (divId) => {
        const divElt = document.getElementById(divId);
        if (divElt) {
            (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block" : divElt.style.display = "none";
        }
    }

    const sidebarCloseHandler = () => {
        FormatDate(currentDate.startDate).then(dt => {
            setFormatedCurrentDate(dt);
        });
    }

    const initFoodDashboard = () => {
        const foodDashboard = {
            globalMacroNutrimentConsumption: {
                proteins: 0,
                carbs: 0,
                fibre: 0,
                fats: 0
            },
            categories: {
                proteinFood: {
                    macroNutrimentConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                },
                grainFood: {
                    macroNutrimentConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                }, 
                vegetables: {
                    macroNutrimentConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                },
                fruit: {
                    macroNutrimentConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                },
                dairyProducts: {
                    macroNutrimentConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                }
            }
        };
        return foodDashboard;
    };

    const [dashboard, setDashboard] = useState({
        hydratation: {
            dailyTarget: {
                value: 0,
                unit: "",
                globalConsumption: 0,
            },
            hydrates: DefaultDashboard.hydrates
        },
        alcool: {
            dailyTarget: {
                value: 0,
                unit: "",
                globalConsumption: 0,
            },
            alcools: DefaultDashboard.alcools
        },
        food: initFoodDashboard(),
        glycemie: {
            dailyGlycemie: 0,
        },
        poids: {
            dailyPoids: 0,
        },
        toilettes: {
            feces: 0,
            urine: 0
        },
        sommeil: {
            heure: 0,
            minute: 0,
            heureDebut: "00:00",
            heureFin: "00:00",
            nbReveils: 0,
            etatReveil: null
        },
        activities: {
            heure: 0,
            minute: 0
        },
    });

    const checkAllFoodCategoriesAreDefined = (dashboard) => {
        const foodDashboard = initFoodDashboard();

        if (!dashboard.food) {
            dashboard.food = foodDashboard;
            return;
        }
        if (!dashboard.food.globalMacroNutrimentConsumption) {
            dashboard.food.globalMacroNutrimentConsumption = foodDashboard.globalMacroNutrimentConsumption;
        }
        if (!dashboard.food.categories || Object.keys(dashboard.food.categories).length === 0) {
            dashboard.food.categories = foodDashboard.categories;
            return;
        }
        Object.keys(foodDashboard.categories).forEach(category => {
            if (!dashboard.food.categories[category]) {
                dashboard.food.categories[category] = foodDashboard.categories[category];
                return;
            }
            if (!dashboard.food.categories[category].macroNutrimentConsumption) {
                dashboard.food.categories[category].macroNutrimentConsumption = foodDashboard.categories[category].macroNutrimentConsumption;
            }
            if (!dashboard.food.categories[category].items) {
                dashboard.food.categories[category].items = foodDashboard.categories[category].items;
            }
        });
        return;
    };

    const addMissingDashboard = (dashboard) => {
        if (!dashboard.hydratation) {
            dashboard.hydratation = {
                dailyTarget: {
                    value: 0,
                    unit: "",
                    globalConsumption: 0,
                },
                hydrates: DefaultDashboard.hydrates
            }
        }
        if (!dashboard.alcool) {
            dashboard.alcool = {
                dailyTarget: {
                    value: 0,
                    unit: "",
                    globalConsumption: 0,
                },
                alcools: DefaultDashboard.alcools
            }
        }
        checkAllFoodCategoriesAreDefined(dashboard);
        if (!dashboard.glycemie) {
            dashboard.glycemie = {
                dailyGlycemie: 0,
            }
        }
        if (!dashboard.poids) {
            dashboard.poids = {
                dailyPoids: 0,
            }
        }
        if (!dashboard.toilettes) {
            dashboard.toilettes = {
                feces: 0,
                urine: 0
            }
        }
        if (!dashboard.sommeil) {
            dashboard.sommeil = {
                heure: 0,
                minute: 0
            }
        }
        if (!dashboard.activities) {
            dashboard.activities = {
                heure: 0,
                minute: 0
            }
        }
        return dashboard;
    }

    useEffect(() => {
        const localDashboard = localStorage["dashboard"];
        FormatDate(currentDate.startDate).then(dt => {
            setFormatedCurrentDate(dt);
        });

        if (localDashboard) {
            const updatedSets = addMissingDashboard(JSON.parse(localDashboard));
            localStorage.setItem("dashboard", JSON.stringify(updatedSets));
            setDashboard(updatedSets);
        } else {
            const userUID = localStorage.getItem("userUid");
            //console.log("Loading Dashboard From DB...");
            firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
                .once("value", (snapshot) => {
                    const sets = snapshot.val();
                    //console.log("sets::"+JSON.stringify(sets));
                    if (sets) {
                        if (!(sets.hydratation.hydrates)) {
                            sets.hydratation.hydrates = [];
                        }
                        if (!(sets.alcool.alcools)) {
                            sets.alcool.alcools=[]
                        }
                        const updatedSets = addMissingDashboard(sets);
                        localStorage.setItem("dashboard", JSON.stringify(updatedSets));
                        setDashboard(updatedSets);
                        //console.log("DB if ::::::::::::::"+JSON.stringify(dashboard));
                    } else {
                        localStorage.setItem("dashboard", JSON.stringify(dashboard));
                        //console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
                    }              
                });
        }
    }, []);

    const updateGlobalMacroNutrimentConsumption = (sets) => {
        sets.food.globalMacroNutrimentConsumption = {
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 0
        };
        Object.keys(sets.food.categories).forEach(category => {
            sets.food.globalMacroNutrimentConsumption.proteins += sets.food.categories[category].macroNutrimentConsumption.proteins;
            sets.food.globalMacroNutrimentConsumption.carbs += sets.food.categories[category].macroNutrimentConsumption.carbs;
            sets.food.globalMacroNutrimentConsumption.fibre += sets.food.categories[category].macroNutrimentConsumption.fibre;
            sets.food.globalMacroNutrimentConsumption.fats += sets.food.categories[category].macroNutrimentConsumption.fats;
        });
    };

    const updateFoodConsumption = function() {
        const userUID = localStorage.getItem("userUid");
        //console.log("Loading Dashboard From DB...");
        firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
            .once("value", (snapshot) => {
                const sets = snapshot.val();
                if (sets) {
                    if (!(sets.hydratation.hydrates)) {
                        sets.hydratation.hydrates = [];
                    }
                    if (!(sets.alcool.alcools)) {
                        sets.alcool.alcools=[]
                    }
                    const updatedSets = addMissingDashboard(sets);
                    updateGlobalMacroNutrimentConsumption(updatedSets);
                    localStorage.setItem("dashboard", JSON.stringify(updatedSets));
                    setDashboard(updatedSets);
                    //console.log("sa marche::" + sets.nourriture.globalConsumption);
                    firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(sets) 
                } else {
                    // const localDashboard = localStorage['dashboard'];
                    localStorage.setItem("dashboard", JSON.stringify(dashboard));
                    //console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
                    //console.log("sa marche pas::");
                }
            })
    };

    const nextDay = () => {


        const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() + 1);
        setCurrentDate({startDate: new Date(localDate)});
        setLocalday ({startDate:new Date (localDate)});
        //console.log(currentDate.startDate)


        setFormatedCurrentDate(localDate);
    

        const userUID = localStorage.getItem("userUid");
        firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
            .once("value", (snapshot) =>{ 
                const sets = snapshot.val();
                //console.log("dataBase" + JSON.stringify (sets));
                //console.log("BOOOOOOOOOOM")
                if (!sets) {
                    //console.log("!snapshot.val()")
                    firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(
                        {
                            hydratation: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0,
                                },
                                hydrates:DefaultDashboard.hydrates
                            },
                            alcool: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0,
                                },
                                alcools:DefaultDashboard.alcools
                            },
                            food: initFoodDashboard(),
                            glycemie : {
                                dailyGlycemie:0,
                            },
                            poids : {
                                dailyPoids:0,
                            },
                            toilettes : {
                                feces:0,
                                urine:0
                            },
                            sommeil : {
                                heureDebut: "00:00",
                                heureFin: "00:00",
                                nbReveils: 0,
                                etatReveil: null
                            },
                            activities : {
                                heure:0,
                                minute:0
                            },     
                        }
                    )
                    // .then(dt => {
                    //   setFormatedCurrentDate(dt);
                    // });
                    ///////////// USE THEN ///////////////////////////////
                    firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
                        .once("value", (snapshot) =>{
                            const set = snapshot.val();
                            // const set = addMissingDashboard(JSON.parse(sets));
                            localStorage.setItem("dashboard", JSON.stringify(set));
                            const localDashboard = localStorage["dashboard"];
          

                            // const sets = addMissingDashboard(JSON.parse(set));
                            // localStorage.setItem('dashboard', JSON.stringify(sets));

                            // localStorage.setItem('dashboard', JSON.stringify(sets));
                            //  setDashboard(JSON.parse(localDashboard ));
          
                            //console.log("Local Storage::::::" + JSON.stringify(localDashboard));
                            //console.log("Local Storage::::::" + JSON.stringify(set));
                            // setDashboard(localDashboard)  
                        });
        
                }
                else {
                    //console.log("snapshot.val()")

                    if (!(sets.hydratation.hydrates)) {
                        sets.hydratation.hydrates = [];
                    }
                    if (!(sets.alcool.alcools)) {
                        sets.alcool.alcools=[]
                    }
                    const updatedSets = addMissingDashboard(sets);
                    // localStorage.setItem('dashboard', JSON.stringify(updatedSets));
                    setDashboard(updatedSets);
                    //console.log("Dashboard" + JSON.stringify(dashboard))
                }        
            })
    }

    const prevDay = () => {
        const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() - 1);
        setCurrentDate({startDate: new Date(localDate)});
        setLocalday ({startDate:new Date (localDate)});
        //console.log(currentDate.startDate)

        const userUID = localStorage.getItem("userUid");
        firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
            .once("value", (snapshot) =>{ 
                const sets = snapshot.val();
                //console.log("dataBase" + JSON.stringify (sets));
                if (!sets) {
                    //console.log("!snapshot.val()")
                    firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(
                        {
                            hydratation: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0,
                                },
                                hydrates:DefaultDashboard.hydrates
                            },
                            alcool: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0,
                                },
                                alcools:DefaultDashboard.alcools
                            },
                            food: initFoodDashboard(),
                            glycemie : {
                                dailyGlycemie:0,
                            },
                            poids : {
                                dailyPoids:0,
                            },
                            toilettes : {
                                feces:0,
                                urine:0
                            },
                            sommeil : {
                                heureDebut: "00:00",
                                heureFin: "00:00",
                                nbReveils: 0,
                                etatReveil: null
                            },
                            activities : {
                                heure:0,
                                minute:0
                            },     
                        }
                    )
                    firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
                        .once("value", (snapshot) =>{
                            const set = snapshot.val();
                            // const set = addMissingDashboard(JSON.parse(sets));
                            //localStorage.setItem('dashboard', JSON.stringify(set));
          
                            const updatedSets = addMissingDashboard(set);
                            //localStorage.setItem('dashboard', JSON.stringify(updatedSets));
                            setDashboard(updatedSets);        
                        })  
                }
                else {
                    //console.log("snapshot.val()")

                    if (!(sets.hydratation.hydrates)) {
                        sets.hydratation.hydrates = [];
                    }
                    if (!(sets.alcool.alcools)) {
                        sets.alcool.alcools=[]
                    }
                    const updatedSets = addMissingDashboard(sets);
                    // localStorage.setItem('dashboard', JSON.stringify(updatedSets));
                    setDashboard(updatedSets);
                    //console.log("Dashboard" + JSON.stringify(dashboard))
                }        
            })
    }

    return (
        <IonPage >
            <Profil close={sidebarCloseHandler}> </Profil>
            <IonContent >
                <div className="datePickerPage" >
                    <IonGrid>
                        <IonRow>
                            <IonCol size="2">
                                <IonTabButton >
                                    <IonIcon className="buttonTimeLeft" icon={arrowDropleftCircle} onClick={() => console.log("Go Left!")} />
                                </IonTabButton>
                            </IonCol>
                            <IonCol></IonCol>
                            <IonCol style={{ textAlign: "center" }}>
                                <IonLabel className="datePicker">{formatedCurrentDate}</IonLabel>
                                {/* <IonCol>
            <DatePicker className="datePicker"
              selected={ currentDate.startDate}
              dateFormat="MM-dd-yyyy"
              readOnly/> 
          </IonCol> */}
                            </IonCol>
                            <IonCol></IonCol>
                            <IonCol size="2">
                                <IonTabButton>
                                    <IonIcon className="buttonTimeRight" icon={arrowDroprightCircle} onClick={() => console.log("Go Right!")} />
                                </IonTabButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                <IonList>
                    <Hydratation
                        hydrate={dashboard.hydratation} hydrates={dashboard.hydratation.hydrates}
                        currentDate={currentDate} globalConsumption={dashboard.hydratation.dailyTarget.globalConsumption} />
                    <div>
                        <IonItem className="divTitre2">
                            <IonAvatar slot="start"><img src="/assets/nutrition.jpg" alt=""/></IonAvatar>
                            <IonLabel><h2><b>{ translate.getText("FOOD_MODULE", ["title"]) }</b></h2></IonLabel>
                            <span id="totalMacroNutriment">{translate.getText('FOOD_MODULE', ['macroNutrimentSummary', 'totalMacroNutriments'])}:</span>
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <IonButton color='primary' shape='round' size='small'>{translate.getText("FOOD_MODULE", ["macroNutrimentSummary", "cumulativeProteins"])}: {dashboard.food.globalMacroNutrimentConsumption.proteins}</IonButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton color='primary' shape='round' size='small'>{translate.getText("FOOD_MODULE", ["macroNutrimentSummary", "cumulativeCarbs"])}: {dashboard.food.globalMacroNutrimentConsumption.carbs}</IonButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton color='primary'shape='round' size='small'>{translate.getText("FOOD_MODULE", ["macroNutrimentSummary", "cumulativeFibre"])}: {dashboard.food.globalMacroNutrimentConsumption.fibre}</IonButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton color='primary' shape='round' size='small'>{translate.getText("FOOD_MODULE", ["macroNutrimentSummary", "cumulativeFats"])}: {dashboard.food.globalMacroNutrimentConsumption.fats}</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                            <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
                        </IonItem>            
                    </div>

                    <div id="myDIV22">
                        <IonList id = "listNourriture">
                            <Fruit 
                                updateFoodConsumptionCallback = { updateFoodConsumption } 
                                macroNutrimentConsumption = { dashboard.food.categories.fruit.macroNutrimentConsumption }
                                foodItems = { dashboard.food.categories.fruit.items }
                                currentDate = { currentDate }
                            />
                            <ProteinFood 
                                updateFoodConsumptionCallback = { updateFoodConsumption } 
                                macroNutrimentConsumption = { dashboard.food.categories.proteinFood.macroNutrimentConsumption }
                                foodItems = { dashboard.food.categories.proteinFood.items }
                                currentDate = { currentDate }
                            />
                            <Vegetables 
                                updateFoodConsumptionCallback = { updateFoodConsumption }
                                macroNutrimentConsumption = { dashboard.food.categories.vegetables.macroNutrimentConsumption }
                                foodItems = { dashboard.food.categories.vegetables.items }
                                currentDate = { currentDate }
                            />
                            <GrainFood 
                                updateFoodConsumptionCallback = { updateFoodConsumption }
                                macroNutrimentConsumption = { dashboard.food.categories.grainFood.macroNutrimentConsumption }
                                foodItems = { dashboard.food.categories.grainFood.items }
                                currentDate = { currentDate }
                            />
                            <DairyProducts 
                                updateFoodConsumptionCallback = { updateFoodConsumption }
                                macroNutrimentConsumption = { dashboard.food.categories.dairyProducts.macroNutrimentConsumption }
                                foodItems = { dashboard.food.categories.dairyProducts.items }
                                currentDate = { currentDate }
                            />
                        </IonList>
                    </div>

                    <Supplements currentDate={currentDate} />
                    <Glycemie glycemie={dashboard.glycemie} currentDate={currentDate} />
                    <Toilettes toilettes={dashboard.toilettes} currentDate={currentDate} />
                    <Activities heures={dashboard.activities.heure} minutes={dashboard.activities.minute} currentDate={currentDate} sommeil={dashboard.activities} />
                    <Sommeil currentDate={currentDate} sommeil={dashboard.sommeil} />
                    <AlcoolList 
                        alcoolService={AlcoolService} 
                        alcool={dashboard.alcool}
                        alcools={dashboard.alcool.alcools}
                        globalConsumption={dashboard.alcool.dailyTarget.globalConsumption}
                        currentDate={currentDate} 
                    />
                    <Poids poids={dashboard.poids} currentDate={currentDate} />
                </IonList>
            </IonContent>

            <IonFooter>
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="tab1" href="/dashboard">
                        <Home />  
                    </IonTabButton>   
                    <IonTabButton tab="" href="/export">
                        <Export />
                    </IonTabButton>
                    <IonTabButton tab="tab2" href="/settings">
                        <IonIcon color="warning" className="target" icon={settings} />
                        <IonLabel className="text"><h3>Cibler</h3></IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonFooter>
        </IonPage>
    );
}
export default Dashboard;
