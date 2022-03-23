import React from "react"
import Food from './Food';

const Fruit = (props) => {
  return (
    <Food
      categoryKey = 'fruit'
      cssId = 'myDIV6'
      parentCallback = {props.parentCallback}
      macroNutrimentConsumption = {props.macroNutrimentConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default Fruit;