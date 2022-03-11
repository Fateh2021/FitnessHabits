import { IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react'
import * as translate from "../../../translate/Translator";
import React, { useState } from 'react'
import { convertToCM, convertToImperial  } from './UnitDisplay';

export default function UnitDisplay({dbProfile,}) {
    const [currentUnitDisplay, setUnitSizeDisplay] = useState("M");
    const [unitSize,setUnitSize] = useState('');
    const [unitDisplayLong,setUnitDisplayLong] = useState(translate.getText("SIDEBAR_TAILLE_M_DISPLAY"))
    const [isImperial,setIsImperial] = useState(false);
    const [imperial,setImperial] = useState({feet:5,inches:6});

    const unitDisplayCalculations = (newUnitDisplay,value) => {
        (newUnitDisplay === "IMP") ? setIsImperial(true) :setIsImperial(false);

        if (newUnitDisplay === "IMP" && currentUnitDisplay !== "IMP") {
                setImperial(convertToImperial(currentUnitDisplay,value));
                setUnitSizeDisplay("IMP");
        }

        if (newUnitDisplay === "CM") {
            switch (currentUnitDisplay) {
                case "M":
                    setUnitSize(value*100);    
                    break;
                case "IMP":
                    setUnitSize(convertToCM(currentUnitDisplay,value,imperial));
                    break;
                default:
                    setUnitSize(value);
                    break;
            }
            setUnitDisplayLong(translate.getText("SIDEBAR_TAILLE_CM_DISPLAY"));
            setUnitSizeDisplay("CM");
        }

        if (newUnitDisplay === "M") {
            switch (currentUnitDisplay) {
                case "CM":
                    setUnitSize(value/100)
                    break;
                case "M":
                    setUnitSize(value)
                    break;
                default:
                    setUnitSize(convertToCM(currentUnitDisplay,(value),imperial)/100);
                    break;
            }
            setUnitDisplayLong(translate.getText("SIDEBAR_TAILLE_M_DISPLAY"));
            setUnitSizeDisplay("M");
        }
    }

  return (
    <div>
            <IonItem>
                    {!isImperial && <IonInput className="inputProfilText"  type="number" name="size" value={unitSize} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"/>}
                    {isImperial && <IonInput className="inputProfilText" style={{maxWidth:"150px"}} type="number" name="feet" value={imperial.feet} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"><span>'</span></IonInput>}  
                    {isImperial && <IonInput className="inputProfilText" style={{maxWidth:"150px"}} type="number" name="inches" onIonBlur={handleInputChange} value={imperial.inches} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"><span>"</span></IonInput>}
                      <IonLabel >
                        <h2 style={{padding:"0px",color:"black"}}>
                        <b>Unité:</b>
                        </h2>
                    </IonLabel>               
                    <IonSelect
                    color="black"
                    okText={translate.getText("POIDS_PREF_CHOISIR")}
                    cancelText={translate.getText("POIDS_PREF_ANNULER")}
                    onIonChange={handleUniteSizDisplayChange}
                    >
                    <IonSelectOption value="M">M</IonSelectOption>
                    <IonSelectOption value="CM">CM</IonSelectOption>
                    <IonSelectOption value="IMP">IMPÉRIALE</IonSelectOption>
                    </IonSelect>
                    </IonItem>
    </div>
  )
}
