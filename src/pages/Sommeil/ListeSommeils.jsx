import { IonList } from "@ionic/react";
import React from "react";
import ElementSommeil from "./ElementSommeil";

let sommeils = [
  {
    start: "00:00",
    end: "00:00",
    mood: "colère",
    nbAwoken: 0,
    day: 1,
    month: 1,
    year: 2000,
  },
  {
    start: "00:00",
    end: "00:00",
    mood: "colère",
    nbAwoken: 0,
    day: 1,
    month: 1,
    year: 2000,
  },
  {
    start: "00:00",
    end: "00:00",
    mood: "colère",
    nbAwoken: 0,
    day: 1,
    month: 1,
    year: 2000,
  },
  {
    start: "00:00",
    end: "00:00",
    mood: "colère",
    nbAwoken: 0,
    day: 1,
    month: 1,
    year: 2000,
  },
];

let elementsSommeil = [];

sommeils.forEach((item) => {
  elementsSommeil.push(<ElementSommeil info={item}></ElementSommeil>);
});

function ListeSommeils() {
  return <IonList>{elementsSommeil}</IonList>;
}

export default ListeSommeils;
