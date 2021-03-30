import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
const HeaderPoids = ({ url }) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={url} />
                </IonButtons>
                <IonTitle>
                    Poids
                    </IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default HeaderPoids;
