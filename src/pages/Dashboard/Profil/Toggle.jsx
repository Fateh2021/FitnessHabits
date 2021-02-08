import React, { Fragment } from "react";
import { IonIcon, IonLabel} from "@ionic/react";
import {globe, menu, person} from 'ionicons/icons';

const Toggle = (props) => {
    return(
        <Fragment>
            <div className="grid-container">
                <div className="grid-item">
                    <button id="toggle" className="buttonHeaderDash" onClick={props.click}>
                        <IonIcon  className="targetProfil" icon={menu}/>
                    </button>
                </div>
                <div className="grid-item">
                    <IonLabel className='profilTitleDashboard' color='danger'>
                        <h3>FitHab</h3>
                    </IonLabel>                
                </div>
                <div className="grid-item">
                    <a className="buttonHeaderDash">
                        <IonIcon className="targetProfil"  icon={globe}/>
                    </a>
                </div>
            </div>
        </Fragment>
    )
}
export default Toggle