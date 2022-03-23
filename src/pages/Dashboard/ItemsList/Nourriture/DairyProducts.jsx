import React from 'react';
import Food from './Food';

const DairyProducts = (props) => {
  return (
    <Food
      categoryKey = 'dairyProducts'
      cssId = 'myDIV2'
      parentCallback = {props.parentCallback}
      macroNutrimentConsumption = {props.macroNutrimentConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default DairyProducts;
