import React from "react"
import Food from './Food';

const ProteinFood = (props) => {
  return (
    <Food
      categoryKey = 'proteinFood'
      cssId = 'myDIV5'
      parentCallback = {props.parentCallback}
      macroNutrimentConsumption = {props.macroNutrimentConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default ProteinFood;