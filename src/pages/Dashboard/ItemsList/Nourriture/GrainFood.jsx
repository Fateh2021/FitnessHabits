import React from 'react';
import Food from './Food';

const GrainFood = (props) => {
  return (
    <Food
      categoryKey = 'grainFood'
      cssId = 'myDIV3'
      parentCallback = {props.parentCallback}
      macroNutrimentConsumption = {props.macroNutrimentConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default GrainFood;
