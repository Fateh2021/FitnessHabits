import React from 'react';
import Food from './Food';

const Vegetables = (props) => {
  return (
    <Food
      categoryKey = 'vegetables'
      cssId = 'myDIV4'
      parentCallback = {props.parentCallback}
      macroNutrimentConsumption = {props.macroNutrimentConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default Vegetables;
