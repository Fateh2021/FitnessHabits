import React, { useState, useEffect } from "react"
import firebase from "firebase"
import { arrowDropleftCircle, arrowDroprightCircle, arrowDropdownCircle, settings} from "ionicons/icons";
import {
    IonContent, IonList, IonPage, IonTabBar, IonIcon, IonTabButton, IonLabel, IonFooter,
    IonGrid, IonCol, IonRow, IonItem, IonAvatar, IonInput
} from "@ionic/react";
import Profil from "./Profil/Profil";
import NourrGras from "./ItemsList/Nourriture/NourrGras"
import NourriProteines from "./ItemsList/Nourriture/NourriProteines"
import NourriLegumes from "./ItemsList/Nourriture/NourriLegumes"
import NourrCereales from "./ItemsList/Nourriture/NourrCereales"

import Hydratation from "./ItemsList/Hydratation";
import Glycemie from "./ItemsList/Glycemie"
import Supplements from "./ItemsList/Supplements";
import Toilettes from "./ItemsList/Toilettes";
import Activities from "./ItemsList/Activities";
import Sommeil from "./ItemsList/Sommeil";
import Alcool from "./ItemsList/Alcool";
import Poids from "./ItemsList/Poids"
import DefaultDashboard from "./DefaultDashboard"
import FormatDate from "../../DateUtils"

import "../Tab1.css";
import Home from "../Footer/Home";
import Export from "../Footer/Export";
import * as translate from "../../translate/Translator";

const Dashboard = (props) => {
    const [nourriture, setNourriture] = useState(0);
    const [gras, setGras] = useState(0);
    const [proteines, setProteines] = useState(0);
    const [legumes, setLegumes] = useState(0);
    const [cereales, setLCereales] = useState(0);
    const [showAlert6, setShowAlert6] = useState(false);
    const [toDay, setToDaye] = useState({startDate: new Date()});
    const [currentDate, setCurrentDate] = useState({startDate: new Date()});
    const [formatedCurrentDate, setFormatedCurrentDate] = useState("");
    const [localday, setLocalday] = useState({startDate: new Date().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    })});

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
        nourriture: {
            globalConsumption: 0,
        },
        gras: {
            dailyTarget: {
                value: 0,
                unit: "",
                globalConsumption: 0
            },
            grass: DefaultDashboard.gras
        },
        proteines: {
            dailyTarget: {
                value: 0,
                unit: "",
                globalConsumption: 0
            },
            proteines: DefaultDashboard.proteines
        },
        legumes: {
            dailyTarget: {
                value: 0,
                unit: "",
                globalConsumption: 0
            },
            legumes: DefaultDashboard.legumes
        },
        cereales: {
            dailyTarget: {
                value: 0,
                unit: "",
                globalConsumption: 0
            },
            cereales: DefaultDashboard.cereales
        },
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
        if (!dashboard.nourriture) {
            dashboard.nourriture = {
                globalConsumption: 0
            }
        }
        if (!dashboard.gras) {
            dashboard.gras = {
                dailyTarget: {
                    value: 0,
                    unit: "",
                    globalConsumption: 0
                },
                grass: DefaultDashboard.gras
            };
        }
        if (!dashboard.proteines) {
            dashboard.proteines = {
                dailyTarget: {
                    value: 0,
                    unit: "",
                    globalConsumption: 0
                },
                proteines: DefaultDashboard.proteines
            };
        }
        if (!dashboard.legumes) {
            dashboard.legumes = {
                dailyTarget: {
                    value: 0,
                    unit: "",
                    globalConsumption: 0
                },
                legumes: DefaultDashboard.legumes
            };
        }
        if (!dashboard.cereales) {
            dashboard.cereales = {
                dailyTarget: {
                    value: 0,
                    unit: "",
                    globalConsumption: 0
                },
                cereales: DefaultDashboard.cereales
            };
        }

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
            const sets = addMissingDashboard(JSON.parse(localDashboard));
            localStorage.setItem("dashboard", JSON.stringify(sets));
            setDashboard(JSON.parse(localDashboard));
        } else {
            const userUID = localStorage.getItem("userUid");
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
                        if (!(sets.gras.grass)) {
                            sets.gras.grass=[]
                        }
                        if (!(sets.proteines.proteines)) {
                            sets.proteines.proteines=[]
                        }
                        if (!(sets.legumes.legumes)) {
                            sets.legumes.legumes=[]
                        }
                        if (!(sets.cereales.cereales)) {
                            sets.cereales.cereales=[]
                        }
                        if (!(sets.cereales.cereales)) {
                            sets.cereales.cereales=[]
                        }
    
                        const updatedSets = addMissingDashboard(sets);
                        localStorage.setItem("dashboard", JSON.stringify(updatedSets));
                        setDashboard(updatedSets);
                    } else {
                        localStorage.setItem("dashboard", JSON.stringify(dashboard));
                    }              
                });
        }
    }, []);

    const NourritureUpdate = () => {
        const userUID = localStorage.getItem("userUid");
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
                    if (!(sets.gras.grass)) {
                        sets.gras.grass=[]
                    }
                    if (!(sets.proteines.proteines)) {
                        sets.proteines.proteines=[]
                    }
                    if (!(sets.legumes.legumes)) {
                        sets.legumes.legumes=[]
                    }
                    if (!(sets.cereales.cereales)) {
                        sets.cereales.cereales=[]
                    }
                    sets.nourriture.globalConsumption = sets.gras.dailyTarget.globalConsumption + sets.proteines.dailyTarget.globalConsumption
        + sets.legumes.dailyTarget.globalConsumption + sets.cereales.dailyTarget.globalConsumption;        
                    const updatedSets = addMissingDashboard(sets);
                    localStorage.setItem("dashboard", JSON.stringify(updatedSets));
                    setDashboard(updatedSets);
                    firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(sets) 
                } else {
                    localStorage.setItem("dashboard", JSON.stringify(dashboard));
                }
            })
    };
  
    const parentCallbackGras = (childData) => {  
        setGras(childData);
        NourritureUpdate();
    };

    const parentCallbackProteines = (childData) => {     
        setProteines(childData);
        NourritureUpdate();
    };

    const parentCallbackLegumes = (childData) => {  
        setLegumes(childData);
        NourritureUpdate();
    };

    const parentCallbackCereales = (childData) => {  
        setLCereales(childData);
        NourritureUpdate();
    };

    const nextDay = () => {
        const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() + 1);
        setCurrentDate({startDate: new Date(localDate)});
        setLocalday ({startDate:new Date (localDate)});
        setFormatedCurrentDate(localDate);
    
        const userUID = localStorage.getItem("userUid");
        firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
            .once("value", (snapshot) =>{ 
                const sets = snapshot.val();
       
                if (!sets) {
          
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
                            nourriture:{
                                globalConsumption:0,
                            },
                            gras: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                grass:DefaultDashboard.gras
                            },
                            proteines: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                proteines:DefaultDashboard.proteines
                            },
                            legumes: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                legumes:DefaultDashboard.legumes
                            },
                            cereales: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                cereales:DefaultDashboard.cereales
                            },
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

                            localStorage.setItem("dashboard", JSON.stringify(set));
                            const localDashboard = localStorage["dashboard"]; 
                        });
        
                }
                else {
                    if (!(sets.hydratation.hydrates)) {
                        sets.hydratation.hydrates = [];
                    }
                    if (!(sets.alcool.alcools)) {
                        sets.alcool.alcools=[]
                    }
                    if (!(sets.gras.grass)) {
                        sets.gras.grass=[]
                    }
                    if (!(sets.proteines.proteines)) {
                        sets.proteines.proteines=[]
                    }
                    if (!(sets.legumes.legumes)) {
                        sets.legumes.legumes=[]
                    }
                    if (!(sets.cereales.cereales)) {
                        sets.cereales.cereales=[]
                    }
                    const updatedSets = addMissingDashboard(sets);
                    setDashboard(updatedSets);
                }        
            })
    }

    const prevDay = () => {
        const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() - 1);
        setCurrentDate({startDate: new Date(localDate)});
        setLocalday ({startDate:new Date (localDate)});

        const userUID = localStorage.getItem("userUid");
        firebase.database().ref("dashboard/"+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear())
            .once("value", (snapshot) =>{ 
                const sets = snapshot.val();
   
                if (!sets) {
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
                            nourriture:{
                                globalConsumption:0,
                            },
                            gras: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                grass:DefaultDashboard.gras
                            },
                            proteines: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                proteines:DefaultDashboard.proteines
                            },
                            legumes: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                legumes:DefaultDashboard.legumes
                            },
                            cereales: {
                                dailyTarget:{
                                    value:0,
                                    unit:"",
                                    globalConsumption:0
                                },
                                cereales:DefaultDashboard.cereales
                            },
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
                            const updatedSets = addMissingDashboard(set);
                            setDashboard(updatedSets);        
                        })  
                }
                else {
                    if (!(sets.hydratation.hydrates)) {
                        sets.hydratation.hydrates = [];
                    }
                    if (!(sets.alcool.alcools)) {
                        sets.alcool.alcools=[]
                    }
                    if (!(sets.gras.grass)) {
                        sets.gras.grass=[]
                    }
                    if (!(sets.proteines.proteines)) {
                        sets.proteines.proteines=[]
                    }
                    if (!(sets.legumes.legumes)) {
                        sets.legumes.legumes=[]
                    }
                    if (!(sets.cereales.cereales)) {
                        sets.cereales.cereales=[]
                    }
                    const updatedSets = addMissingDashboard(sets);
                    setDashboard(updatedSets);
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
                                {}
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
                            <IonInput className='inputTextGly' readonly value={dashboard.nourriture.globalConsumption}></IonInput>
                            <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV22")} />
                        </IonItem>            
                    </div>

                    <div id="myDIV22">
                        <IonList id = "listNourriture">
                            <NourrGras 
                                parentCallbackGras = {parentCallbackGras.bind(this)} 
                                gras={dashboard.gras} 
                                grass={dashboard.gras.grass} 
                                globalConsumption = {dashboard.gras.dailyTarget.globalConsumption} 
                                currentDate ={currentDate}
                            />
                            <NourriProteines 
                                parentCallbackProteines = {parentCallbackProteines.bind(this)} 
                                proteine={dashboard.proteines} 
                                proteines={dashboard.proteines.proteines} 
                                globalConsumption = {dashboard.proteines.dailyTarget.globalConsumption} 
                                currentDate ={currentDate}
                            />
                            <NourriLegumes 
                                parentCallbackLegumes = {parentCallbackLegumes.bind(this)}
                                legume={dashboard.legumes} 
                                legumes={dashboard.legumes.legumes} 
                                globalConsumption = {dashboard.legumes.dailyTarget.globalConsumption} 
                                currentDate ={currentDate}
                            />
                            <NourrCereales 
                                parentCallbackCereales = {parentCallbackCereales.bind(this)}
                                cereale={dashboard.cereales} 
                                cereales={dashboard.cereales.cereales} 
                                globalConsumption = {dashboard.cereales.dailyTarget.globalConsumption} 
                                currentDate ={currentDate}
                            />
                        </IonList>
                    </div>

                    <Supplements currentDate={currentDate} />
                    <Glycemie glycemie={dashboard.glycemie} currentDate={currentDate} />
                    <Toilettes toilettes={dashboard.toilettes} currentDate={currentDate} />
                    <Activities heures={dashboard.activities.heure} minutes={dashboard.activities.minute} currentDate={currentDate} sommeil={dashboard.activities} />
                    <Sommeil currentDate={currentDate} sommeil={dashboard.sommeil} />
                    <Alcool alcool={dashboard.alcool} alcools={dashboard.alcool.alcools} globalConsumption={dashboard.alcool.dailyTarget.globalConsumption} currentDate={currentDate} />
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
