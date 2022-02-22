import React, { useState, useEffect } from "react";
//import firebase from "firebase";
import * as poidsService from "../../../Poids/configuration/poidsService"
import * as translate from "../../../../translate/Translator";

import {
  IonInput,
  IonText,
  IonButton,
  IonGrid,
  IonContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar,
  IonCol,
  IonRow,
  IonItemDivider,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { arrowDropdownCircle } from "ionicons/icons";
import "../../../../pages/Tab1.css";
import "../../../../pages/poids.css";
import TableauPoids from "../../../Poids/configuration/TableauPoids";

import Poids from "../Poids";
import getCurrentUser from "../../../../firebaseConfig";
//import 'firebase/storage';
import login from "../../../Login/LogIn"
import { render, screen } from "@testing-library/react";

//const db = localStorage.getItem('dashboard')
render(<login />)
//const user = screen.getElementBy();
//setUsername

/*
test('poids translation', async() => {
  render(<Poids poids="dailyPoids: 50"/>);
  const value = screen.getByText(/Poids/i);
  expect(value).toBeDefined();
})

test('poids translation en englais', async() => {
  localStorage.setItem('userLanguage', 'en')
  render(<Poids poids="dailyPoids: 50"/>);
  const value = screen.getByText(/Weight/i);
  expect(value).toBeDefined();
})
*/