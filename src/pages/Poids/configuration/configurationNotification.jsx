import React, { useState } from 'react';
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonItem, IonLabel, IonGrid, IonCol, IonCard } from '@ionic/react';

import HeaderPoids from "./header";

const handleRouterPageConfigNotification = () => {
    window.location.href = '/configurationPoids';
}

const ConfigurationNotification = (props) => {
    const [titre, setrTitre] = useState("Titre de notification");
    const [selectedDate, setSelectedDate] = useState('2012-12-15T13:47:20.789');
    const [repetition, setRepetition] = useState(['ven', 'sam']);

    const getJoursRepetition = (repetition) => {
        return repetition.reduce((prev, curr) => prev + "," + curr);
    }
    return (
        <ion-app>
            <HeaderPoids url="/dashboard" />
            <ion-content class="ion-padding">
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Initialisation</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonInput type="text" value={titre} onIonChange={e => setrTitre(e.target.value)} />
                    </IonItem>
                    <IonItemDivider>
                        <IonLabel>Horaire</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <ion-datetime placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.target.value)}></ion-datetime>
                    </IonItem>
                    <IonItemDivider>
                        <IonLabel slot="start">Répétition</IonLabel>
                        <IonLabel slot="end">{!repetition.length ? "tous les jours" : getJoursRepetition(repetition)}</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round" >Di</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Lu</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Ma</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Me</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Je</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Ve</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Sa</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                </IonItemGroup>
                <IonCard>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6">
                                <IonButton shape="round" expand="block">REINITIALISER</IonButton>
                            </IonCol>
                            <IonCol size="6">
                                <IonButton shape="round" expand="block" onClick={handleRouterPageConfigNotification}>CONFIRMER</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCard>
            </ion-content>
        </ion-app>
        // <div>
        //     <DatePicker controls={['calendar']} />
        //     <h3>Hello Configuration notification</h3>
        // </div >
    )
}

export default ConfigurationNotification;
