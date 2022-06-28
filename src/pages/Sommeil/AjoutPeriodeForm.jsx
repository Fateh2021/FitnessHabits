import firebase from "firebase";
import React, { useEffect, useState } from "react";
import "./Sommeil.css";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

function AjoutPeriodeForm() {
  let addPeriod = (start, end, mood, nbAwoken, day, month, year) => {
    db.push({
      start: start,
      end: end,
      mood: mood,
      nbAwoken: nbAwoken,
      day: day,
      month: month,
      year: year,
    });
  };

  return (
    <form>
  <ion-grid>      
  <ion-row> <ion-item class="ajout-item">
	<ion-col><ion-label class="ajout-label-nbrFois">Durant cette période,<br/> je me suis réveillé</ion-label></ion-col>
	<ion-col><ion-input id="nbAwoken" type="number"></ion-input></ion-col>
	<ion-col><ion-label>fois</ion-label></ion-col>
  </ion-item></ion-row>
  </ion-grid>
    </form>
);
}

export default AjoutPeriodeForm;
