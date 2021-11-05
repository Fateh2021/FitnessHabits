import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';

import * as translate from "../../../translate/Translator";


const Header = ({ url }) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={url} />
                </IonButtons>
                <IonTitle>
                    {translate.getText("POIDS_NOM_SECTION")}
                    </IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default Header;
