import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import {IonGrid, IonCol, IonRow, IonTabButton, IonIcon} from '@ionic/react';
import "react-datepicker/dist/react-datepicker.css";
import { arrowDropleftCircle, arrowDroprightCircle } from 'ionicons/icons';
import '../Tab1.css';

const DateTime = (props) => {

  const [currentDate, setCurrentDate] = useState({startDate: new Date()});

  const handleChange = (date)  => { 
    setCurrentDate({startDate: date})
  }

  const nextDay = () => {
    const localDate = currentDate.startDate.setDate(currentDate.startDate.getDate() + 1);
    setCurrentDate({startDate: new Date(localDate)});
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
          {/* <form>*/}
            {/* <div className="formGroup" aria-readonly>  */}
              <DatePicker className="datePicker"
                selected={ currentDate.startDate}
                //onChange={ handleChange }                  
                // showTimeSelect
                // timeFormat="HH:mm"
                // timeIntervals={1}
                // timeCaption="time"
                dateFormat="MM-d-yyyy"/> {/* <button className="btn btn-primary">Show Date</button> */}
                {/* <DatePicker
                  required
                  selected={this.state.startDate}
                  onChange={this.handleChange }
                  showTimeSelect
                  dateFormat="Pp"
                  className="Datepicker pa2"
                  minDate={new Date()}
                  placeholderText="Select a date"
                  calendarClassName="rasta-stripes"
                  popperModifiers={{
                      offset: {
                        enabled: true,
                        offset: "0px, 0px"
                      },
                      preventOverflow: {
                        enabled: true,
                        escapeWithReference: false,
                        boundariesElement: "scrollParent"
                      }
                    }}
              /> */}                    
             {/* </div> */}
         {/* </form> */}
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