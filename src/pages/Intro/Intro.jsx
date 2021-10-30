import React from 'react';
import { IonGrid, IonPage, IonCol, IonButton, IonRow, IonIcon } from '@ionic/react';
import { logIn, add } from 'ionicons/icons';
import * as translate from "../../translate/Translator";

/*DFA*/

const Intro = () => {
    translate.initLangue()
    return (
        <IonPage className="fondIntro">
            <IonGrid >
                <IonRow >
                    <IonCol size="12">
                        <img className="logoIntro" src="/assets/LogoLegion.png" alt="" />
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid >
                <IonRow className="">
                    <IonCol size="12">
                        <IonButton expand="full" routerLink="/login"><IonIcon className="save" icon={logIn}/>{translate.getText("CONNECT")}</IonButton>
                        <IonButton routerLink="/register" color="secondary"><IonIcon className="save" icon={add}/>{translate.getText("REGISTER")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    )
}
export default Intro;