import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { IonInput, IonText,IonButton,IonGrid, IonContent, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonRow, IonItemDivider} from '@ionic/react';
import {arrowDropdownCircle, star, trash, create,addCircle,removeCircle } from 'ionicons/icons';
import '../../../pages/Tab1.css';
import '../../../pages/poids.css';
import { Line } from "react-chartjs-2";

let start = new Date(),
  end = new Date();

start.setDate(start.getDate() - 90); // set to 'now' minus 7 days.
start.setHours(0, 0, 0, 0); // set to midnight.

const accor = (divId) => {
  const divElt=document.getElementById(divId);
  if (divElt) {
    (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
  }
}


const Poids = (props) => {

  let graphData = 
  [{x: "2021-08-10", y: 180},
  {x: "2021-08-20", y: 175},
  {x: "2021-08-25", y: 173},
  {x: "2021-08-29", y: 178},
  {x: "2021-09-01", y: 175},
  {x: "2021-09-10", y: 174},
  {x: "2021-09-20", y: 173},
  {x: "2021-10-16", y: 172},
  {x: "2021-10-17", y: 170},
  {x: "2021-11-02", y: 168}]

  var poidsInitial = [{x: start, y: 180},{x: end, y: 180}]
  var poidsCible = [{x: start, y: 171},{x: end, y: 171}]

  const data = {
    datasets: [
      {
        label: "Poids initial",
        data: poidsInitial,
        fill: false,
        borderColor: "#F45650",
        backgroundColor: "#F45650",
        pointRadius: 0
      },
      {
        label: "Poids",
        data: graphData,
        fill: false,
        borderColor: "#3B81C4",
        backgroundColor: "#3B81C4"
      },
      {
        label: "Poids Cible",
        data: poidsCible,
        fill: false,
        borderColor: "#37F52E",
        backgroundColor: "#37F52E",
        pointRadius: 0
      }
    ]
  };
  var options = {
    title: {text: "Évolution du poids des 3 derniers mois", display: true},
    legend: {
      position: "bottom",
      align: "middle"
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          min: start,
          max: end,
          unit: "day"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Poids (lbs)'
        }
      }]
    }
  }
  
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});;
  const [dailyPoids, setDailyPoids] = useState(props.poids.dailyPoids);
  const [poids, setPoids] = useState(props.poids);

  useEffect(() => {
    setDailyPoids(props.poids.dailyPoids);
  }, [props.poids.dailyPoids])

  useEffect(() => {
    setPoids(props.poids);
  }, [props.poids])

  const handleChange = event => {
    const dailPoids = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.poids.dailyPoids = dailPoids;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setDailyPoids(dailPoids);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleRouteToConfigurationPoids = () => {
    window.location.href = '/configurationPoids';
  }

  return (
    <div style={{padding:0}}>
      <IonItem className="divTitre9" lines="none">
        <IonAvatar slot="start" onClick={handleRouteToConfigurationPoids}>
          <img src="/assets/Poids.jpg" alt="" />
        </IonAvatar>
        <IonLabel>
        <h2 color="warning"><b>Poids</b></h2>
        </IonLabel>
        <IonInput className='poidsActuelReadOnly' type="number" value={dailyPoids} onIonChange={handleChange} readonly> </IonInput>
        <IonIcon className="arrowDashItem"  icon={arrowDropdownCircle} onClick={() => accor("accordeonPoids")}/>
      </IonItem>
      <div id="accordeonPoids" className="accordeonPoids">
          {/* <IonItem lines="none" className="ionTableau"> */}
            <Line className="ionTableau poidsGraph" data={data} options={options} />
            {/* <IonGrid>
              <IonRow class="rowPoids">
                <IonCol className="poids-text-md">
                    <span><b>Poids actuel</b></span>  <span className="poids-text-sm">173 lbs</span>                   
                </IonCol>
                <IonCol className="poids-text-md">
                  <span><b>Date cible</b></span><span className="poids-text-sm" >2021-01-01</span> 
                </IonCol>
              </IonRow>
              <IonRow class="rowPoids">
                <IonCol className="poids-text-md">
                  <span><b>Poids cible</b></span> <span className="poids-text-sm">153 lbs</span>                   
                </IonCol>
                <IonCol></IonCol>
              </IonRow>
            </IonGrid> */}
          {/* </IonItem> */}
          
                {/* <IonItem className="divTitre11" key={123}>
                  <IonRow></IonRow>
                  <IonCol size="3">
                  <IonLabel className="nameDscripDashboard"><h2><b>{"test"}</b></h2></IonLabel>      
                  </IonCol>
                  <IonButton className="trashButton" color="danger" size="small">
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {dailyPoids} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small">
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small">
                    <IonIcon  icon={trash} />
                  </IonButton>
                </IonItem> */}
                
          
          
          {/* {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashAlcool) => saveItem(itemDashAlcool)}/>}    */}
        </div>        
    </div>    
  );
}
export default Poids;
