import React from 'react';
import Nourriture from './Nourriture';

const NourriProteines = (props) => {
  return (
    <Nourriture
      name = 'Proteines'
      type = 'proteines'
      subType = 'proteines'
      cssId = 'myDIV5'
      parentCallback = {props.parentCallbackProteines}
      macroNutriment = {props.proteine}
      macroNutriments = {props.proteines}
      globalConsumption = {props.globalConsumption}
      currentDate = {props.currentDate}
      macroNutrimentToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default NourriProteines;
