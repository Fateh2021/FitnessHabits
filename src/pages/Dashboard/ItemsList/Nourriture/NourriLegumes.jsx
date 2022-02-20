import React from 'react';
import Nourriture from './Nourriture';

const NourriLegumes = (props) => {
  return (
    <Nourriture
      name = 'Legumes'
      type = 'legumes'
      subType = 'legumes'
      cssId = 'myDIV4'
      parentCallback = {props.parentCallbackLegumes}
      macroNutriment = {props.legume}
      macroNutriments = {props.legumes}
      globalConsumption = {props.globalConsumption}
      currentDate = {props.currentDate}
      macroNutrimentToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default NourriLegumes;
