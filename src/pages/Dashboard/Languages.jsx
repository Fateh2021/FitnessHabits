import * as firebase from 'firebase'
import React, { useState } from 'react';
import {
    IonTabBar, IonTabButton, IonHeader, IonIcon,
    IonLabel, IonFooter, IonContent, IonPage, IonItem, IonRadioGroup, IonRadio, IonListHeader
} from '@ionic/react';
import { home, arrowDropleftCircle, globe, settings } from 'ionicons/icons';
import '../Tab1.css';

export const Languages = (props) => {
    var userLanguage = "fr"
    const [selected, setSelected] = useState(userLanguage);
    return (
        <IonPage>
            <IonHeader>
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="" href="/dashboard">
                        <IonIcon className="arrowDashItem" icon={arrowDropleftCircle} />
                    </IonTabButton>
                    <IonTabButton tab="menu">
                        <IonLabel className="headerTitle">Langue</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="settings" href="/languages">
                        <IonIcon className="targetProfil "/>
                    </IonTabButton>
                </IonTabBar>
            </IonHeader>

            <IonContent>
                <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value) }>
                    <IonListHeader>
                        <IonLabel className="headerTitle">Choisir la langue de l'application</IonLabel>
                    </IonListHeader>

                    <IonItem>
                        <IonLabel>English</IonLabel>
                        <IonRadio slot="start" value="en" />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Español</IonLabel>
                        <IonRadio slot="start" value="es" />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Français</IonLabel>
                        <IonRadio slot="start" value="fr" />
                    </IonItem>
                </IonRadioGroup>
            </IonContent>

            <IonFooter>
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="" href="/dashboard">
                        <IonIcon color="warning" className="target" icon={home} />
                        <IonLabel className="text"><h3>Home</h3></IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="tab2" href="/settings">
                        <IonIcon color="warning" className="target" icon={settings} />
                        <IonLabel className="text"><h3>Cibler</h3></IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonFooter>
        </IonPage>
    )

}
export default Languages;