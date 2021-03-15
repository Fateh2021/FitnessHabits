import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { IonSelectOption, IonSelect, IonToggle, IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonHeader, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonTitle, IonGrid, IonCol } from '@ionic/react';
import './configurationNotification.css';

const listeButtonColors = ["primary", "primary", "primary", "primary", "primary", "primary", "primary"]

const ConfigurationNotification = (props) => {
    const [titre, setrTitre] = useState("Titre de notification");
    const [selectedDate, setSelectedDate] = useState('2012-12-15T13:47:20.789');
    const [repetition, setRepetition] = useState(['ven', 'sam']);

    const getJoursRepetition = (repetition) => {
        return repetition.reduce((prev, curr) => prev + "," + curr);
    }
    return (
        <ion-app>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/dashboard" />
                    </IonButtons>
                    <IonTitle>
                        Configuration
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

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
                                    <IonButton class="dayButton" size="small" shape="round">Dim</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Lun</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Mar</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Mer</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Jeu</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Ven</IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonButton class="dayButton" size="small" shape="round">Sam</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                </IonItemGroup>
            </ion-content>
        </ion-app>
        // <div>
        //     <DatePicker controls={['calendar']} />
        //     <h3>Hello Configuration notification</h3>
        // </div >
    )
}

export default ConfigurationNotification;
