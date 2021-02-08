import React, {useState} from "react"
import { IonLabel, IonItem, IonAvatar} from '@ionic/react';

import '../../../pages/Tab1.css';

const Toilettes = () => {

  const [text, setText] = useState();
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const count1 = ()=>{
    setCountA(countA + 1);
  }
    
  const count2 = ()=>{
    if (countA>=1){
    setCountA(countA - 1);
    }
  }
    
  const count3 = ()=>{
  setCountB(countB + 1);
  }
  
  const count4 = ()=>{
  if (countB>=1){
    setCountB(countB - 1);
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
        {/* <div className="Toilette01"></div> */}
        <button className="toiletButton1" onClick={()=>count4()}>-</button>
        <div className="divToilet1">{countB}</div>
        <button className="toiletButton1" onClick={()=>count3()}>+</button>
        <div className="separateDiv"></div> 
        <button className="toiletButton2" onClick={()=>count2()}>-</button>
        <div className="divToilet2" >{countA}</div>
        <button className="toiletButton2" onClick={()=>count1()} >+</button>
        {/* <div className="Toilette02"></div> */}
      </IonItem>
    </div> 
  );
}
export default Toilettes;