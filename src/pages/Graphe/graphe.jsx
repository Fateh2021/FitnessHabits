import React, { useEffect, useState } from 'react';
import { arrowBack } from "ionicons/icons";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard
} from "@ionic/react";
import '../Tab1.css'
import moment from "moment";
import firebase from 'firebase'
import "firebase/auth";

import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const Graphe = () => {
    const [datapoints, setdatapoints] = useState([]);

    useEffect(() => {
        if (datapoints.length > 0)
            setdatapoints(datapoints)
    }, [datapoints]);


    const userUID = localStorage.getItem('userUid');

    var arr = [];
    firebase.database().ref('dashboard/' + userUID)
        .once("value", (snapshot) => {
            const sets = snapshot.val();
            if (sets) {
                var index = 0;
                for (const key in sets) {
                    arr[index] = { x: new Date(moment(key, "DDMMYYYY").format('YYYY-MM-DD')), y: parseInt(sets[key].glycemie.dailyGlycemie) }
                    index++
                }
            }

            arr.sort((a, b) => {
                return a.x - b.x;
            });

            setdatapoints(arr);
        });


    const options = {
        animationEnabled: true,
        title: {
            text: "glycemie"
        },
        axisX: {
            valueFormatString: "DD-MM-YYYY"
        },
        axisY: {
            title: "Taux glycemie",
            suffix: " mmol/L"
        },
        data: [{
            yValueFormatString: "##",
            xValueFormatString: "DD-MM-YYYY",
            type: "spline",
            dataPoints: datapoints
        }]
    };

    if (!datapoints || datapoints.length <= 0) {
        return (
            <IonPage>

                <IonHeader className="notGlyAdd">
                    <IonToolbar>
                        <IonTitle class="titre">Graphe Glycemie</IonTitle>
                    </IonToolbar>

                    <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                        <IonFabButton routerDirection="back" href="/glycemie" size="small">
                            <IonIcon icon={arrowBack} />
                        </IonFabButton>
                    </IonFab>
                </IonHeader>

                <IonContent>
                    <IonCard>
                        Loading...
                    </IonCard>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>

            <IonHeader className="notGlyAdd">
                <IonToolbar>
                    <IonTitle class="titre">Graphe Glycemie</IonTitle>
                </IonToolbar>

                <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                    <IonFabButton routerDirection="back" href="/glycemie" size="small">
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
            </IonHeader>

            <IonContent>
                <IonCard>
                    <div>
                        <CanvasJSChart options={options} />
                    </div>
                </IonCard>
            </IonContent>
        </IonPage>
    );


};

export default Graphe;