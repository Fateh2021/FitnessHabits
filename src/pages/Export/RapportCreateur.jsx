import { jsPDF } from "jspdf";
import  "jspdf-autotable";
import {getMacrosTotalAndAveragePerDay, getNourriture, getWeights} from "./CompilerBilan";


export async function creerPdf(date){

    const doc = new jsPDF();
    let poid = getWeights();
    let headers = []
    let values = []

    // getNourriture()
    // getMacrosTotalAndAveragePerDay("nourriture")


    // réccupérer les headers et les données (à changer)
    //TODO
    for (const [key, value] of poid[0].entries()) {
        headers.push(key);
        values.push(value);
    }

    // pour tester
    console.log(headers);

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

function getHeaders(){
//TODO
}

function getValues(){
//TODO
}

