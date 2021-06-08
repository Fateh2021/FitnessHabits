import React, { useState} from 'react';
import DatePicker from 'react-datepicker';
import {IonGrid, IonCol, IonRow, IonTabButton, IonIcon} from '@ionic/react';
import "react-datepicker/dist/react-datepicker.css";
import { arrowDropleftCircle, arrowDroprightCircle } from 'ionicons/icons';
import '../Tab1.css';

const DateTime = (props) => {
  
  const [day, setDay] = useState(new Date());
  const [dateday, setDateday] = useState(day);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});

  const nextDay = () => {
    const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() + 1);
    setCurrentDate({startDate: new Date(localDate)});
    setDay (new Date (localDate));
    setDateday (new Date (localDate));
  }

  const prevDay = () => {
    const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() - 1);
    setCurrentDate({startDate: new Date(localDate)});
  }

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="2">
          <IonTabButton >
            <IonIcon className="buttonTimeLeft" icon={arrowDropleftCircle} onClick={prevDay}/>
          </IonTabButton> 
        </IonCol>
        <IonCol></IonCol>
        <IonCol>

              <DatePicker className="datePicker"
                selected={ currentDate.startDate}
                dateFormat="MM-dd-yyyy"/> 
        </IonCol>
        <IonCol></IonCol>
        <IonCol size="2">
          <IonTabButton>
            <IonIcon  className="buttonTimeRight" icon={arrowDroprightCircle}  onClick={nextDay}/>
          </IonTabButton>
        </IonCol>
      </IonRow>  
    </IonGrid>     
  ); 
}
export default DateTime;