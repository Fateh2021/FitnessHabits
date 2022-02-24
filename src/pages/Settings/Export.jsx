import firebase from "firebase";

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
import DefaultSettings from "./DefaultSettings";
import DatePicker from "react-date-picker";
import * as translate from '../../translate/Translator'
import { jsPDF } from "jspdf";


import "../Tab1.css";
import { render } from "@testing-library/react";

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
    if (categories.length == 0) {
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
  var selected = "csv";


  const [d1, onChangeD1] = useState(new Date(new Date().setMonth(-2)));
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
                    onChange={onChangeD1}
                    value={d1}
                    minDate={new Date("01-01-2010")} // A CHANGER ICI POUR LA PLUS PETITE DATE QU'ON VEUT
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
                <IonLabel>{translate.getText("ACTIVITES_TITLE")}</IonLabel>
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
                  selected = e.detail.value;
                }}
            >
              <IonListHeader>
                <IonLabel>{translate.getText("EXPORT_FORMAT_TITLE")}</IonLabel>
              </IonListHeader>

              <IonItem data-testid="radio-csv">
                <IonLabel>CSV</IonLabel>
                <IonRadio slot="start" value="csv" checked="true"/>
              </IonItem>

              <IonItem>
                <IonLabel>PDF</IonLabel>
                <IonRadio slot="start" value="pdf" />
              </IonItem>

              <IonItem>
                <IonLabel>{translate.getText("CSV_AND_PDF_TITLE")}</IonLabel>
                <IonRadio slot="start" value="hybride" />
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
                    onClick={async () => {
                      if (dataSelected.current.length === 0) {
                        toast(toastMessage);
                      } else {
                      
                      var date = new Date().toISOString().slice(0, 10);
                      var retour = "";
                      if (selected === "pdf" || selected === "hybride") {
                        var overviewPdf = await compilerBilan(dataSelected.current, d1, d2);
                        if (overviewPdf.length <= 0) {
                          toast(
                              translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE")
                          );
                        } else {
                            dataSelected.current.forEach((data) => {
                              switch (data) {
                                case "hydratation":
                                  var hydratation = recupererHydratation();
                                  retour = retour + hydratation + "\n";
                                  break;
                                case "activities":
                                  var activite = recupererActivite();
                                  retour = retour + activite + "\n";
                                  break;
                                case "nourriture":
                                  var nourriture = recupererNourriture();
                                  retour = retour + nourriture + "\n";
                                  break;
                                case "sommeil":
                                  var sommeil = recupererSommeil();
                                  retour = retour + sommeil + "\n";
                                  break;
                                case "toilettes":
                                  var toilettes = recupererToilettes();
                                  retour = retour + toilettes + "\n";
                                  break;
                                case "alcool":
                                  var alcool = recupererAlcools();
                                  retour = retour + alcool + "\n";
                                  break;
                                case "glycémie":
                                  var glycemie = recupererGlycemie();
                                  retour = retour + glycemie + "\n";
                                  break;
                                case "poids":
                                  var poids = recupererPoids();
                                  retour = retour + poids + "\n";
                                  break;
                                case "supplements":
                                  var supplements = recupererSupplements();
                                  retour = retour + supplements + "\n";
                                  break;

                                default:
                                  break;
                              }
                            });
                            const doc = new jsPDF();
                            var splitTitle = doc.splitTextToSize(retour, 270);
                            var y = 7;
                            for (var i = 0; i < splitTitle.length; i++) {
                              if (y > 280) {
                                y = 10;
                                doc.addPage();
                              }
                              doc.text(15, y, splitTitle[i]);
                              y = y + 7;
                            }

                            doc.save("FitnessHabits-data-" + date + ".pdf");
                          }
                        }

                      if (selected === "csv" || selected === "hybride") {
                        var overviewCsv = await compilerBilan(dataSelected.current, d1, d2);
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

function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

export async function compilerBilan(dataSelected, d1, d2) {
  d1.setHours(0, 0, 0, 0)
  const userUID = localStorage.getItem("userUid");
  let dataFormat = [];
  if (!window.navigator.onLine) {
    dataFormat = [JSON.parse(localStorage.getItem("dashboard"))];
    let ajd = new Date();
    dataFormat[0].date = ('0' + ajd.getDate()).slice(-2) + '-'
        + ('0' + (ajd.getMonth() + 1)).slice(-2) + '-'
        + ajd.getFullYear();
  } else {
    let ref = firebase.database().ref("dashboard/" + userUID + "/");
    await ref.once("value", (snap) => {
      snap.forEach((data) => {
        var jour = data.key[0] + data.key[1] + "-";
        var mois = "0" + data.key[2] + "-";
        var annee = data.key[3] + data.key[4] + data.key[5] + data.key[6];
        var date = jour + mois + annee;

        var obj = data.val();
        obj.date = date;
        dataFormat.push(obj);
      });
    });
  }

  // Only uses dates in datepicker
  let datePickerDates = getDates(d1, d2);
  dataFormat = dataFormat.filter((data) => {
    return !!datePickerDates.find((item) => {
      return (
          item.getTime() ==
          new Date(
              data.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          ).getTime()
      );
    });
  });

  let retour = [];

  // Remplacer par i dans un for (de-à) lorsque les dates seront gere
  for (let i = 0; i < dataFormat.length; ++i) {
    retour[i] = {};
    retour[i].date = dataFormat[i].date
        ? dataFormat[i].date
        : new Date().toISOString().slice(0, 10);
    for (const data of dataSelected) {
      switch (data) {
        case "hydratation":
          if (dataFormat[i].hydratation.hydrates) {
            for (const hydr of dataFormat[i].hydratation.hydrates) {
              if (retour[i][data])
                retour[i][data] +=
                    (hydr.name ? hydr.name : "NO-NAME") +
                    ": " +
                    hydr.qtte +
                    " " +
                    hydr.unit +
                    "; ";
              else
                retour[i][data] =
                    (hydr.name ? hydr.name : "NO-NAME") +
                    ": " +
                    hydr.qtte +
                    " " +
                    hydr.unit +
                    "; ";
            }
          } else {
            retour[i][data] = "empty";
          }
          break;
        case "activities":
          var activite = dataFormat[i].activities;
          retour[i][data] = activite.heure + "h " + activite.minute + " min";
          break;
        case "nourriture":
          var nourriture = dataFormat[i].nourriture;
          if (nourriture.globalConsumption === "0")
            retour[i][data] = " NO DATA FOUND IN NOURRITURE";
          else retour[i][data] = nourriture.globalConsumption;
          break;
        case "sommeil":
          var sommeil = dataFormat[i].sommeil;
          retour[i][data] = sommeil.heure + "h " + sommeil.minute + " min";
          break;
        case "toilettes":
          var toilettes = dataFormat[i].toilettes;
          retour[i][data] =
              "Feces: " + toilettes.feces + "; Urine: " + toilettes.urine;
          break;
        case "alcool":
          if (dataFormat[i].alcool.alcools) {
            dataFormat[i].alcool.alcools.forEach((alc) => {
              if (retour[i][data])
                retour[i][data] +=
                    (alc.name ? alc.name : "NO-NAME") +
                    ": " +
                    alc.qtte +
                    " " +
                    alc.unit +
                    "; ";
              else
                retour[i][data] =
                    (alc.name ? alc.name : "NO-NAME") +
                    ": " +
                    alc.qtte +
                    " " +
                    alc.unit +
                    "; ";
            });
          } else {
            retour[i][data] = "empty";
          }
          break;
        case "glycémie":
          var glycemie = dataFormat[i].glycemie.dailyGlycemie;
          retour[i][data] = glycemie;
          break;
        case "poids":
          var poids = dataFormat[i].poids.dailyPoids;
          retour[i][data] = poids;
          break;
        case "supplements":
          var supplement = dataFormat[i].supplement;
          if (!supplement)
            retour[i][data] =
                "Les supplements ne sont pas encore implémentés\n";
          else retour[i][data] = supplement;
          break;

        default:
          break;
      }
    }
  }
  return retour;
}

function recupererHydratation() {
  var retour = "Hydratation: \n";
  var hydratation = JSON.parse(localStorage.getItem("dashboard")).hydratation
      .hydrates;
  hydratation.forEach((data) => {
    retour =
        retour + " " + data.name + ": " + data.qtte + " " + data.unit + "\n";
  });
  return retour;
}

function recupererAlcools() {
  var retour = "Alcool: \n";
  var alcool = JSON.parse(localStorage.getItem("dashboard")).alcool.alcools;
  alcool.forEach((data) => {
    retour =
        retour + " " + data.name + ": " + data.qtte + " " + data.unit + "\n";
  });
  return retour;
}

function recupererActivite() {
  var retour = "Activites: \n";
  var activite = JSON.parse(localStorage.getItem("dashboard")).activities;
  retour = retour + " " + activite.heure + "h " + activite.minute + " min\n";

  return retour;
}

function recupererNourriture() {
  var retour = "Nourriture: \n";
  var nourriture = JSON.parse(localStorage.getItem("dashboard")).nourriture;
  if (nourriture.globalConsumption === "0") {
    return retour + " NO DATA FOUND IN NOURRITURE \n";
  } else {
    return retour + nourriture.globalConsumption;
  }
}

function recupererSommeil() {
  var retour = "Sommeil: \n";
  var sommeil = JSON.parse(localStorage.getItem("dashboard")).sommeil;
  retour = retour + " " + sommeil.heure + "h " + sommeil.minute + " min\n";

  return retour;
}

function recupererToilettes() {
  var retour = "Toilettes: \n";
  var toilettes = JSON.parse(localStorage.getItem("dashboard")).toilettes;

  retour =
      retour +
      " Feces: " +
      toilettes.feces +
      "\n Urine: " +
      toilettes.urine +
      "\n";

  return retour;
}

function recupererGlycemie() {
  var retour = "Glycemie: \n";
  var glycemie = JSON.parse(localStorage.getItem("dashboard")).glycemie
      .dailyGlycemie;

  retour = retour + glycemie + "\n";

  return retour;
}

function recupererPoids() {
  var retour = "Poids: \n";
  var poids = JSON.parse(localStorage.getItem("dashboard")).poids.dailyPoids;
  retour = retour + poids + "\n";

  return retour;
}

function recupererSupplements() {
  var retour = "Supplements: \n";
  var supplement = JSON.parse(localStorage.getItem("dashboard")).supplement;
  if (!supplement) {
    retour = retour + "Les supplements ne sont pas encore implémentés\n";
  } else {
    retour = retour + supplement + "\n";
  }

  return retour;
}

export default Settings;
