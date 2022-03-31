import React from 'react';
import Food from './Food';

const Vegetables = (props) => {
  return (
    <Food
      categoryKey = 'vegetables'
      updateFoodConsumptionCallback = {props.updateFoodConsumptionCallback}
      macroNutrimentConsumption = {props.macroNutrimentConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default Vegetables;
