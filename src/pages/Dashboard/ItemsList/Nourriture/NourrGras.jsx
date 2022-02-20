import React from "react"
import Nourriture from './Nourriture';

const NourrGras = (props) => {
  return (
    <Nourriture
      name = 'Gras'
      type = 'gras'
      subType = 'grass'
      cssId = 'myDIV2'
      parentCallback = {props.parentCallbackGras}
      macroNutriment = {props.gras}
      macroNutriments = {props.grass}
      globalConsumption = {props.globalConsumption}
      currentDate = {props.currentDate}
      macroNutrimentToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default NourrGras;