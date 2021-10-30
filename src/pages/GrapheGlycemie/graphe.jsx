import React, { useEffect, useState } from 'react';
import { arrowBack, options } from "ionicons/icons";
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

import CanvasJSReact from './canvasjs.stock.react';
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

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





    var dateFin = new Date();
    var dateInitial = new Date();
    dateInitial.setMonth(dateInitial.getMonth() - 3);

    const options = {
        theme: "light2", //"light1", "dark1", "dark2"
        title: {
            text: "Glycemie"
        },
        rangeSelector: {
            inputFields: {
                startValue: dateInitial,
                endValue: dateFin,

            },
            buttonStyle: {
                backgroundColorOnSelect: "#4f81bc",
                backgroundColorOnHover: "#2196f3",
            },
            buttons: [
                {
                    label: "1S",
                    range: 1,
                    rangeType: "week"
                },
                {
                    label: "1M",
                    range: 1,
                    rangeType: "month",
                    
                },
                {
                    label: "3M",
                    range: 3,
                    rangeType: "month",
                    default: true
                },
                {
                    label: "1Y",
                    range: 1,
                    rangeType: "year"
                },
                {
                    label: "Tout",
                    rangeType: "all"
                },
            ]
        },
        charts: [{
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    valueFormatString: "DD-MM-YYYY"
                }
            },
            axisY: {
                title: "Taux glycemie",
                suffix: " mmol/L",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                }
            },
            data: [{
                type: "spline",
                yValueFormatString: "##",
                dataPoints: datapoints
            }]
        }],
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
                        <CanvasJSStockChart options={options} />
                    </div>
                </IonCard>
            </IonContent>
        </IonPage>
    );


};

export default Graphe;
