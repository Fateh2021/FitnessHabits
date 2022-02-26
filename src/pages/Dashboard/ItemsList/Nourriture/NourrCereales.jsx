import React from 'react';
import Nourriture from './Nourriture';

const NourrCereales = (props) => {
  return (
    <Nourriture
      translationKey = 'grain'
      dashboardKey = 'cereales'
      dashboardSubKey = 'cereales'
      cssId = 'myDIV3'
      parentCallback = {props.parentCallbackCereales}
      macroNutriment = {props.cereale}
      macroNutriments = {props.cereales}
      globalConsumption = {props.globalConsumption}
      currentDate = {props.currentDate}
      macroNutrimentToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default NourrCereales;
