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

  return <form></form>;
}

export default AjoutPeriodeForm;
