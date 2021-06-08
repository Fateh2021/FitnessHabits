import React from 'react';
import { IonIcon, IonLabel } from '@ionic/react';
import {save} from 'ionicons/icons';
import '../Tab1.css';


const Export = () => {

  return (    
      <div>
    <IonIcon color="warning" className="save" icon={save} />
    <IonLabel className="text"><h3>Exporter</h3></IonLabel>
    </div> 
  );
}
export default Export;