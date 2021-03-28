import * as firebase from 'firebase'
import React, { useState } from 'react';
import {
    IonTabBar, IonTabButton, IonHeader, IonIcon, IonAvatar,
    IonLabel, IonFooter, IonContent, IonPage, IonItem, IonRadioGroup, IonRadio, IonListHeader
} from '@ionic/react';
import { home, arrowDropleftCircle, globe, settings } from 'ionicons/icons';
import '../Tab1.css';
<<<<<<< HEAD
import {getLang, getText, setLang} from '../../translate/Translator.js';

export const Languages = (props) => {

    const [selected, setSelected] = useState(getLang());

    const set = (e) => {
        setLang(e.detail.value);        
=======
import * as translator from '../../translate/Translator.js';


export const Languages = (props) => {
    const [selected, setSelected] = useState(translator.getLang());

    const set = (e) => {
        translator.setLang(e.detail.value);
>>>>>>> 72b4c8a743bd26b71655fc4282afcbedccc93838
        setSelected(e.detail.value);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="" href="/dashboard">
                        <IonIcon className="arrowDashItem" icon={arrowDropleftCircle} />
                    </IonTabButton>
                    <IonTabButton tab="menu">
<<<<<<< HEAD
                        <IonLabel className="headerTitle">{getText("LANG_TITLE")}</IonLabel>
=======
                        <IonLabel className="headerTitle">{translator.getText("LANG_TITLE")}</IonLabel>
>>>>>>> 72b4c8a743bd26b71655fc4282afcbedccc93838
                    </IonTabButton>
                    <IonTabButton tab="settings" href="/languages">
                        <IonIcon className="targetProfil "/>
                    </IonTabButton>
                </IonTabBar>
            </IonHeader>

            <IonContent>
                <IonRadioGroup value={selected} onIonChange={e => set(e) }>
                    <IonListHeader>
<<<<<<< HEAD
                        <IonLabel className="headerTitle">{getText("LANG_CHOOSE_LANG")}</IonLabel>
=======
                        <IonLabel className="headerTitle">{translator.getText("LANG_CHOOSE_LANG")}</IonLabel>
>>>>>>> 72b4c8a743bd26b71655fc4282afcbedccc93838
                    </IonListHeader>

                    <IonItem class="flexCenter">
                        <IonLabel class="flexCenter">
                            <IonAvatar class="flexCenter">
                                <img class="langueFlag" src="/assets/flags/flag_UK_square-128.png" alt=""/>
                            </IonAvatar>
                            <span class="langueName">English</span>
                        </IonLabel>
                        <IonRadio class="order-3" slot="start" value="en" />
                    </IonItem>

                    <IonItem class="flexCenter">
                        <IonLabel class="flexCenter">
                            <IonAvatar class="flexCenter">
                                <img class="langueFlag" src="/assets/flags/flag_spain_square-128.png" alt=""/>
                            </IonAvatar>
                            <span class="langueName">Español</span>
                        </IonLabel>
                        <IonRadio class="order-3" slot="start" value="es" />
                    </IonItem>

                    <IonItem class="flexCenter">
                        <IonLabel class="flexCenter">
                            <IonAvatar class="flexCenter">
                                <img class="langueFlag" src="/assets/flags/flag_france_square-128.png" alt=""/>
                            </IonAvatar>
                            <span class="langueName">Français</span>
                        </IonLabel>
                        <IonRadio class="order-3" slot="start" value="fr" />
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