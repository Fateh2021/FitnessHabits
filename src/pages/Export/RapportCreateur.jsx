import { jsPDF } from "jspdf";
import  "jspdf-autotable";
import {getWeights, getAggregateWeights, getActivities, getAggregateActivities, getSleeps, getAggregateSleeps} from "./CompilerBilan";
import "./CompilerBilan"

import * as translate from '../../translate/Translator';
//import {nourriture_test} from "./CompilerBilan";

export async function creerPdf(date){
    const doc = new jsPDF();
    let poid = getWeights();
    let headers = [];
    let values = [];
    let footer = [];
    let lineFooter_1 = [];
    let lineFooter_2 = [];
    let lineFooter_3 = [];
    let lineFooter_4 = [];

    //Le titre du tableau //TODO Find a way to add the title
    var title = translate.getText("POIDS_NOM_SECTION");

    //Entete du tableau
    var date = translate.getText("DATE_TITLE");
    var poids = translate.getText("EXP_REPORT_WEIGHT");
    headers.push(date,poids);
    // pour tester
    console.log(headers);


    //for (const [key, value] of poid[0].entries()) {
        //headers.push(key);
        //values.push(value);
    //}

    poid.forEach((data) => {
                                    values.push(data.get('date'));
                                    values.push(data.get('weight'));
                              });

    //TODO find a way to add the aggregate in the tab footer
    /*var aggregateWeight = CompilerBilan.getAggregateWeights();
    //Title Aggregate - Les aggregate
    var aggUnitTitle = translate.getText("EXP_REPORT_UNIT");
    var prefUnitePoids = aggregateWeight.get("prefUnitePoids");
    lineFooter_1.push(aggUnitTitle, prefUnitePoids);

    var aggInitialWeight = translate.getText("EXP_REPORT_INITIAL_WEIGHT");
    var initialEeight =  aggregateWeight.get("initalWeight");
    lineFooter_2.push(aggInitialWeight,initialEeight);

    var aggFinalWeight = translate.getText("EXP_REPORT_FINAL_WEIGHT");
    var finalWeight = aggregateWeight.get("finalWeight");
    lineFooter_3.push(aggFinalWeight,finalWeight);

    var aggDifference = translate.getText("EXP_REPORT_DIFF_WEIGHT");
    var difference = aggregateWeight.get("deltaWeight");
    lineFooter_4.push(aggDifference, difference );
    footer.push(lineFooter_1,lineFooter_2,lineFooter_3,lineFooter_4); */


    // creation du tableau dans le pdf avec les données du poid
    doc.autoTable({
        head: [headers],
        body: [values],
        margin: { top: 20 },
        headStyles:{
            fillColor: "#66b032"
        },
        styles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
        },
    });

    doc.save("FitnessHabits-data-" + date + ".pdf");

}

function generateTable(headers, values){


}


function getHeaders(){
//TODO
}

function getValues(){
//TODO
}

