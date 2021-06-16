import React, {useState, useEffect} from "react"
import firebase from 'firebase'
import { IonLabel, IonItem, IonAvatar} from '@ionic/react';

import '../../../pages/Tab1.css';

const Toilettes = (props) => {

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [urine, setUrine] = useState(props.toilettes.urine);
  const [feces, setFeces] = useState(props.toilettes.feces);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setUrine(props.toilettes.urine);
  }, [props.toilettes.urine])

  useEffect(() => {
    setFeces(props.toilettes.feces);
  }, [props.toilettes.feces])
  
  const handleChangeUrineAdd = () => { 
    setUrine(urine+1);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.toilettes.urine= urine+1;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleChangeUrineMin = () => { 
    if (urine>=1){
      setUrine(urine - 1);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.urine= urine-1;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    } else if (urine ===0){
      setUrine (0);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.urine= 0;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    }   
  }

  const handleChangeFecesAdd = () => { 
    setFeces(feces+1);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.toilettes.feces= feces+1;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleChangeFecesMin = () => { 
    if (feces>=1){
      setFeces(feces - 1);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.feces= feces-1;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    } else if (feces ===0){
      setFeces (0);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.feces= 0;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    }   
  }
  
  return (
    <div>
      <IonItem className="divTitre5">
        <IonAvatar slot="start"><img src="/assets/Toilet2.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Toilettes</b></h2>
        </IonLabel>
        {/* urine*/}
        <button className="toiletButton1" onClick={ handleChangeUrineMin}><div>-</div></button>
        <div className="divToilet1">{urine}</div>
        <button className="toiletButton1" onClick={ handleChangeUrineAdd}><div>+</div></button>
        <div className="separateDiv"></div> 
        {/* feces */}
        <button className="toiletButton2" onClick={ handleChangeFecesMin}><div>-</div></button>
        <div className="divToilet2" >{feces}</div>
        <button className="toiletButton2" onClick={ handleChangeFecesAdd} ><div>+</div></button>
      </IonItem>
    </div> 
  );
}
export default Toilettes;