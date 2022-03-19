import firebase from "firebase";
import * as CompilerBilan from "./CompilerBilan"
import React, { useState, useEffect , useRef} from "react";
import { ExportToCsv } from "export-to-csv";
import { toast } from "../../Toast";
import {
  IonList,
  IonTabBar,
  IonTabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonFooter,
  IonContent,
  IonPage,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonCheckbox,
  IonItemDivider,
  IonButton,
} from "@ionic/react";
import {
  home,
  arrowDropleftCircle,
  globe,
  mail,
  download,
} from "ionicons/icons";

import DefaultSettings from "../Settings/DefaultSettings";
import DatePicker from "react-date-picker";

import { jsPDF } from "jspdf";
import "../Tab1.css";
import { render } from "@testing-library/react";

import * as translate from '../../translate/Translator'
import { getLang } from "../../translate/Translator";
import {compilerBilan} from "./CompilerBilan";
import {creerPdf} from "./RapportCreateur";


const Settings = (props) => {

  const [settings, setSettings] = useState({
    hydratation: {
      dailyTarget: {
        value: 0,
        unit: "",
      },
      hydrates: DefaultSettings.hydrates,
    },

    alcool: {
      dailyTarget: {
        value: 0,
        unit: "",
      },
      alcools: DefaultSettings.alcools,
    },

    gras: {
      dailyTarget: {
        value: 0,
        unit: "",
      },
      gras: DefaultSettings.gras,
    },

    proteines: {
      dailyTarget: {
        value: 0,
        unit: "",
      },
      proteines: DefaultSettings.proteines,
    },

    legumes: {
      dailyTarget: {
        value: 0,
        unit: "",
      },
      legumes: DefaultSettings.legumes,
    },

    cereales: {
      dailyTarget: {
        value: 0,
        unit: "",
      },
      cereales: DefaultSettings.cereales,
    },
  });

  var toastMessage = translate.getText("SELECT_DATA_REQUIRED_TITLE");

  // rerender a chaque fois que l'utilisateur fait une nouvelle selection
  const [dataSelected, changeSelection] = useState(userCategories());

  // fonction qui recupere les objectifs de l'utilisateur
  function userCategories() {
    var categories = [];
    if (settings.hydratation.dailyTarget.value > 0) {
      categories.push("hydratation");
    }
    if (settings.alcool.dailyTarget.value > 0) {
      categories.push("alcool");
    }
    if (
        settings.legumes.dailyTarget.value > 0 ||
        settings.gras.dailyTarget.value > 0 ||
        settings.cereales.dailyTarget.value > 0 ||
        settings.proteines.dailyTarget.value > 0
    ) {
      categories.push("nourriture");
    }
    // Par défaut si l'utilisateur n'a pas personnalisé ses objectifs l'ensemble des données sera exporté
    if (categories.length === 0) {
      categories = [
        "hydratation",
        "alcool",
        "supplements",
        "nourriture",
        "glycémie",
        "poids",
        "toilettes",
        "sommeil",
        "activities",
      ];
    }
    return categories;
  }

  //Logique gérant la liste des catégories sélectionnées par l'utilisateur
  function manageCategories(item) {
    const index = dataSelected.indexOf(item);
    let newSelection = dataSelected
    if (index > -1) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(item);
    }
    changeSelection([...newSelection])
  }

  // variable qui va contenir le format d'exportation désiré, par défaut csv
  const [exportType, onChangeExport ] = useState('pdf');
  // contient la date de debut et la date de fin choisi par l'utilisateur
  const [d1, onChangeD1] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [d2, onChangeD2] = useState(new Date());

  // load the current settings from the local storage if it exists, otherwise load it from the DB
  useEffect(() => {
    const localSettings = localStorage["settings"];
    if (localSettings) {
      const sets = addMissingSettings(JSON.parse(localSettings));
      localStorage.setItem("settings", JSON.stringify(sets));
      setSettings(JSON.parse(localSettings));

    } else {
      const userUID = localStorage.getItem("userUid");
      firebase
          .database()
          .ref("settings/" + userUID)
          .once("value", (snapshot) => {
            const sets = snapshot.val();
            if (sets) {
              if (!sets.hydratation.hydrates) {
                sets.hydratation.hydrates = [];
              }
              if (!sets.alcool.alcools) {
                sets.alcool.alcools = [];
              }
              const updatedSets = addMissingSettings(sets);
              localStorage.setItem("settings", JSON.stringify(updatedSets));
              setSettings(updatedSets);
            } else {
              localStorage.setItem("settings", JSON.stringify(settings));
            }
          });
    }
  }, []);

  const addMissingSettings = (settings) => {
    if (!settings.hydratation) {
      settings.hydratation = {
        dailyTarget: {
          value: 0,
          unit: "",
        },
        hydrates: DefaultSettings.hydrates,
      };
    }

    if (!settings.alcool) {
      settings.alcool = {
        dailyTarget: {
          value: 0,
          unit: "",
        },
        alcools: DefaultSettings.alcools,
      };
    }

    if (!settings.gras) {
      settings.gras = {
        dailyTarget: {
          value: 0,
          unit: "",
        },
        gras: DefaultSettings.gras,
      };
    }

    if (!settings.proteines) {
      settings.proteines = {
        dailyTarget: {
          value: 0,
          unit: "",
        },
        proteines: DefaultSettings.proteines,
      };
    }

    if (!settings.legumes) {
      settings.legumes = {
        dailyTarget: {
          value: 0,
          unit: "",
        },
        legumes: DefaultSettings.legumes,
      };
    }

    if (!settings.cereales) {
      settings.cereales = {
        dailyTarget: {
          value: 0,
          unit: "",
        },
        cereales: DefaultSettings.cereales,
      };
    }

    return settings;
  };

  return (
      <IonPage className="SizeChange">
        <IonHeader className="exportHeader">
          <IonTabBar slot="bottom" color="light">
            <IonTabButton tab="" href="/dashboard">
              <IonIcon className="arrowDashItem" icon={arrowDropleftCircle} />
            </IonTabButton>
            <IonTabButton tab="menu" href="/sidbar">
              <IonLabel className="headerTitle">{translate.getText("EXPORT_TITLE")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/languages">
            <IonIcon className="targetProfil " icon={globe} />
          </IonTabButton>
          </IonTabBar>
        </IonHeader>

        <IonContent>
          <IonItemDivider>{translate.getText("DATES_EXPORTATION_TITLE")}</IonItemDivider>
          <div className="datePickersExportation">
            <div data-testid="startDate">
              {translate.getText("DE")}: &nbsp;

                <DatePicker
                    locale={getLang()}
                    onChange={onChangeD1}
                    value={d1}
                    minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))} // max 10 ans plus tôt
                    maxDate={d2}
                    clearIcon={null}
                    autoFocus={true}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                />
            </div>
           
            <div data-testid="endDate">
            &nbsp;{translate.getText("A")} &nbsp;  
              <DatePicker
                  locale={getLang()}
                  onChange={onChangeD2}
                  value={d2}
                  minDate={d1}
                  maxDate={new Date()}
                  clearIcon={null}
                  onKeyDown={(e) => {
                    e.preventDefault()
                  }}
              />
            </div>
          </div>

          <IonList>
            <IonItemDivider>{translate.getText("EXPORT_DATA_SELECTION_TITLE")}</IonItemDivider>
            <div role="checkbox" aria-checked={dataSelected.includes("activities")} data-testid="checkbox-activities">
              <IonItem>
                <IonLabel>{translate.getText("EXPORT_ACTIVITES_TITLE")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("activities")}
                    onIonChange={(e) => {
                      manageCategories("activities");
                    }}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("nourriture")} data-testid="checkbox-food" onClick={() => {manageCategories("nourriture")}}>
              <IonItem>
                <IonLabel>{translate.getText("NOURRITURE_TITLE")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("nourriture")}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("hydratation")} data-testid="checkbox-hydration" onClick={() => {manageCategories("hydratation")}}>
              <IonItem>
                <IonLabel>{translate.getText("HYDR_TITLE")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("hydratation")}
                />
              </IonItem>
              </div>
            <div role="checkbox" aria-checked={dataSelected.includes("supplements")} data-testid="checkbox-supplements" onClick={() => {manageCategories("supplements")}}>
              <IonItem>
                <IonLabel>{translate.getText("SUPPL_TITLE")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("supplements")}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("sommeil")} data-testid="checkbox-sleep" onClick={() => {manageCategories("sommeil")}}>
              <IonItem>
                <IonLabel>{translate.getText("SLEEP")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("sommeil")}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("poids")} data-testid="checkbox-weight" onClick={() => {manageCategories("poids")}}>
              <IonItem>
                <IonLabel>{translate.getText("POIDS_NOM_SECTION")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("poids")}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("glycémie")} data-testid="checkbox-glycemia" onClick={() => {manageCategories("glycémie")}}>
              <IonItem>
                <IonLabel>{translate.getText("GLYC_TITLE")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("glycémie")}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("alcool")} data-testid="checkbox-alcool" onClick={() => {manageCategories("alcool")}}>
              <IonItem>
                <IonLabel >{translate.getText("ALCOOL_TITLE")}</IonLabel>
                <IonCheckbox 
                    checked={dataSelected.includes("alcool")}
                />
              </IonItem>
            </div>
            <div role="checkbox" aria-checked={dataSelected.includes("toilettes")} data-testid="checkbox-toilet" onClick={() => {manageCategories("toilettes")}}>
              <IonItem>
                <IonLabel>{translate.getText("TOILETS_TITLE")}</IonLabel>
                <IonCheckbox
                    checked={dataSelected.includes("toilettes")}
                />
              </IonItem>
            </div>

            <IonRadioGroup
                onIonChange={(e) => {
                  onChangeExport(e.detail.value);
                }}
            >
              <IonListHeader>
                <IonLabel>{translate.getText("EXPORT_FORMAT_TITLE")}</IonLabel>
              </IonListHeader>

              <IonItem data-testid="radio-pdf">
                <IonLabel>PDF</IonLabel>
                <IonRadio slot="start" value="pdf" checked={exportType === "pdf"}/>
              </IonItem>

              <IonItem data-testid="radio-csv">
                <IonLabel>CSV</IonLabel>
                <IonRadio slot="start" value="csv" checked={exportType === "csv"} disabled="true"/>
              </IonItem>

              <IonItem data-testid="radio-csv-and-pdf">
                <IonLabel>{translate.getText("CSV_AND_PDF_TITLE")}</IonLabel>
                <IonRadio slot="start" value="hybride" checked={exportType === "hybride"} disabled="true"/>
              </IonItem>
            </IonRadioGroup>
          </IonList>
          <ion-grid>
            <ion-row class="ion-justify-content-center">
              <ion-col size="6">
                <IonButton
                    disabled="true"
                    color="secondary"
                    expand="full"
                    class="ion-text-wrap"
                    onClick={() => {
                      window.open(
                          `mailto:?subject=Fitnesshabits données du ${new Date()
                              .toISOString()
                              .slice(0, 10)}&body=Ceci est un body test`
                      );
                    }}
                >
                  {translate.getText("SEND_MAIL")}
                  <IonIcon slot="start" icon={mail} />
                </IonButton>
              </ion-col>
              <ion-col size="6">
                <IonButton
                    expand="full"
                    class="ion-text-wrap"
                    onClick= {async () => {
                      if (dataSelected.length === 0) {
                        toast(toastMessage);
                      } else {
                      var date = new Date().toISOString().slice(0, 10);
                      if (exportType === "pdf" || exportType === "hybride") {
                        await compilerBilan(dataSelected, d1, d2);
                        await creerPdf(date,dataSelected);
                      }
                      if (exportType === "csv" || exportType === "hybride") {
                        var overviewCsv = await compilerBilan(dataSelected, d1, d2);
                        if (overviewCsv.length <= 0) {
                          toast(
                              translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE")
                          );
                        } else {
                          const options = {
                            title: `FitnessHabits-data-${new Date()
                                .toISOString()
                                .slice(0, 10)}`,
                            filename: `FitnessHabits-data-${new Date()
                                .toISOString()
                                .slice(0, 10)}`,
                            useKeysAsHeaders: true,
                          };

                          const csvExporter = new ExportToCsv(options);
                          await csvExporter.generateCsv(overviewCsv);
                        }
                      }
                    }
                    }}
                >
                  {translate.getText("SAVE_TO_DEV")}
                  <IonIcon slot="start" icon={download} />
                </IonButton>
              </ion-col>
            </ion-row>
          </ion-grid>
        </IonContent>

        <IonFooter>
          <IonTabBar slot="bottom" color="light">
            <IonTabButton tab="" href="/dashboard">
              <IonIcon color="warning" className="target" icon={home} />
              <IonLabel className="text">
                <h3>Home</h3>
              </IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonFooter>
      </IonPage>
  );
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default Settings;
