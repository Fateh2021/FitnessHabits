import React from 'react';
import { IonGrid, IonPage, IonCol, IonButton, IonRow, IonIcon } from '@ionic/react';
import * as translate from "../../translate/Translator";

/*DFA*/

const Intro = () => {
    translate.initLangue()
    return (
        <IonPage className="fondIntro">
            <IonGrid  style={{marginBottom:100}}>
                <IonRow >
                    <IonCol size="10" offset="1">
                        <img className="logoIntro" src="/assets/LogoLegion.svg" width="100%" height="100%" alt="Logo" />
                    </IonCol>
                    <IonCol size="8" offset="2">
                        <img src="/assets/LogoCadre.svg" width="100%" height="100%" alt="Logo_texte"/>
                    </IonCol>
                </IonRow>
            </IonGrid>

            <IonGrid >
                <IonRow>
                    <IonCol size="12">
                        <IonButton size="large" class="btn-home" routerLink="/login">{translate.getText("CONNECT")}</IonButton>
                    </IonCol>
                        <IonButton size="large" class="btn-home" routerLink="/register">{translate.getText("REGISTER")}</IonButton>
                </IonRow>
            </IonGrid>
        </IonPage>
    )
}

export default Intro;