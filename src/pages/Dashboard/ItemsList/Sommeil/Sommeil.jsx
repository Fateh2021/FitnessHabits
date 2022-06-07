import React, { useEffect, useState } from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton, IonDatetime, IonGrid, IonSelect, IonSelectOption, IonText, IonModal } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import { toast } from '../../../../Toast'
import * as translate from '../../../../translate/Translator'
import '../../../Tab1.css';
import './Sommeil.css';
import './SommeilModal';
import SommeilModal from "./SommeilModal";


const Sommeil = (props) => {

  const [showModal, setShowModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
  const [selectedHeureDebut, setSelectedHeureDebut] = useState(props.sommeil.heureDebut || "00:00");
  const [selectedHeureFin, setSelectedHeureFin] = useState(props.sommeil.heureFin || "00:00");
  const [nbReveils, setNbReveils] = useState(props.sommeil.nbReveils || 0);
  const [selectedEtatReveil, setEtatReveil] = useState(props.sommeil.etatReveil || null);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setSelectedHeureDebut(props.sommeil.heureDebut);
  }, [props.sommeil.heureDebut])

  useEffect(() => {
    setSelectedHeureFin(props.sommeil.heureFin);
  }, [props.sommeil.heureFin])

  useEffect(() => {
    setNbReveils(props.sommeil.nbReveils);
  }, [props.sommeil.nbReveils])

  useEffect(() => {
    setEtatReveil(props.sommeil.etatReveil);
  }, [props.sommeil.etatReveil])


  /**
   * Fonction qui calcule la duréee.
   * @return Durée en minutes
   **/
  const calculer_duree = () => {
    const heure_debut = +selectedHeureDebut.substring(0, 2);
    const heure_fin = +selectedHeureFin.substring(0, 2);
    const minutes_debut = +selectedHeureDebut.substring(3, 5);
    const minutes_fin = +selectedHeureFin.substring(3, 5);

    const heure_duree = heure_debut > heure_fin ? (heure_fin + 24) - heure_debut : heure_fin - heure_debut;
    const minutes_duree = minutes_debut > minutes_fin ? 0 - minutes_debut + minutes_fin : minutes_fin - minutes_debut;
    const duree_totale = (heure_duree * 60) + minutes_duree;

    return duree_totale;
  }


  // Formattage de la durée 
  const duree = calculer_duree();
  const duree_heures = Math.floor(duree / 60)
  const duree_minutes = duree % 60;
  const duree_format_heure = duree_heures + ":" + (duree_minutes < 10 ? "0" : "") + duree_minutes;


  // Fontion qui sauvegarde les resultat dans le local storage et dans le backend
  const handleSave = () => {

    if (duree === 0)
      return toast(translate.getText("SOMMEIL_DUREE_ERROR"))
    else if (selectedEtatReveil === null)
      return toast(translate.getText("SOMMEIL_ETAT_REVEIL_ERROR"))

    // Calcul de l'heure
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.sommeil.heureDebut = selectedHeureDebut;
    dashboard.sommeil.heureFin = selectedHeureFin;
    dashboard.sommeil.nbReveils = nbReveils;
    dashboard.sommeil.etatReveil = selectedEtatReveil;
    dashboard.sommeil.duree = duree;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));

    // Sauvegarder 
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);

    // Feedback pour le succès
    setIsOpen(false);
    toast(translate.getText("DATA_SAVED"))
  }


  return (
    <div>
      <IonModal isOpen={showModal} class="modal-sommeil">
        <SommeilModal></SommeilModal>
        <IonButton color="success" onClick={() => setShowModal(false)}>
          Fermer
        </IonButton>
      </IonModal>
      <ion-grid class="tab-sommeil">
        <ion-row>
          <ion-col class="tab-icon" size="auto">
            <img width="50" class="moon"
              src="https://cdn-sharing.adobecc.com/content/storage/id/urn:aaid:sc:US:16ea145b-ccaa-4052-8e60-6130c324c6aa;revision=0?component_id=99a406e6-778a-4c46-baf4-18b271040690&api_key=CometServer1&access_token=1654668333_urn%3Aaaid%3Asc%3AUS%3A16ea145b-ccaa-4052-8e60-6130c324c6aa%3Bpublic_396eaa7d0ba2a2d8500abf7ed6ee012abab5d2cb" alt="Moon" />
          </ion-col>
          <ion-col class=" white-bg" onClick={() => setShowModal(true)}>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <IonText color="dark" class="sommeil-title">
                    <b>
                      {translate.getText("SLEEP")}
                    </b>
                  </IonText>
                </ion-col>
                <ion-col class="ion-text-right">
                  <IonText color="dark" class="compte">
                    <b>
                      0 : 00
                    </b>
                  </IonText>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <IonText class="cible" color="dark">Cible | 9:00</IonText>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <IonText color="dark">Moyenne quotidienne / 7j | 00:00</IonText>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
      </ion-grid>

      <IonItem className="divTitre7">
        <IonAvatar slot="start">
          <img src="/assets/Sommeil3.png" alt="Moon" />
        </IonAvatar>
        <IonLabel><h2><b className="text-white">{translate.getText("SLEEP")}</b></h2></IonLabel>
        <IonInput className='inputTextGly etiquette-sommeil ion-text-center' value={duree_format_heure} readonly></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => setShowModal(true)} />
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => setIsOpen(!isOpen)} />
      </IonItem>

      {isOpen &&
        <IonItem className="bg-sommeil" >
          <IonGrid>

            {/* ROW 1 */}
            <IonRow className="ion-text-center">
              {/* ENDORMI À */}
              <IonCol size="6">
                <IonRow>
                  <IonCol size="12">
                    <IonLabel><b className="text-white">{translate.getText("BED_TIME")}</b></IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonDatetime className="input-sommeil"
                      cancelText={translate.getText("CANCEL")}
                      doneText="OK"
                      displayFormat="HH:mm"
                      value={selectedHeureDebut}
                      onIonChange={e => setSelectedHeureDebut(e.detail.value)}></IonDatetime>
                  </IonCol>
                </IonRow>
              </IonCol>

              {/* Éveillé À */}
              <IonCol size="6">
                <IonRow>
                  <IonCol size="12">
                    <IonLabel><b className="text-white">{translate.getText("WAKE_UP_TIME")}</b></IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonDatetime className="input-sommeil"
                      cancelText={translate.getText("CANCEL")}
                      doneText="OK"
                      displayFormat="HH:mm" value={selectedHeureFin}
                      onIonChange={e => setSelectedHeureFin(e.detail.value)}></IonDatetime>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>

            {/* ROW 2 - Nombre de réveils */}
            <IonRow className="text-white ion-justify-content-center ion-align-items-center ion-text-center">
              <IonCol size="7" className="ion-text-end">
                <IonText style={{ width: "100%" }} className="ion-wrap">{translate.getText("I_WOKE_UP")}</IonText>
              </IonCol>

              <IonCol size="5" className="side-by-side ion-justify-content-start ion-align-items-center ion-text-justify">
                <IonInput style={{ maxWidth: "40px", color: "black" }} className='input-sommeil ion-text-center ion-margin' type="number" value={nbReveils} onIonChange={e => setNbReveils(e.detail.value)}></IonInput>
                <IonText className="ion-text-justify">{translate.getText("TIMES")}</IonText>
              </IonCol>
            </IonRow>

            <IonRow className="ion-align-items-center">
              {/* Select */}
              <IonCol size="8">
                <IonItem className="ion-no-padding" lines="none" >
                  <IonLabel className="ion-hide">{translate.getText("STATE_OF_MIND")}</IonLabel>
                  <IonSelect style={{ minWidth: "100%" }} className="input-sommeil" cancelText={translate.getText("CANCEL")} value={selectedEtatReveil} placeholder={translate.getText("STATE_OF_MIND")} onIonChange={(e) => setEtatReveil(e.detail.value)}>
                    <IonSelectOption value="repose">{translate.getText("RESTED")}</IonSelectOption>
                    <IonSelectOption value="heureux">{translate.getText("HAPPY")}</IonSelectOption>
                    <IonSelectOption value="fatigue">{translate.getText("FATIGUE")}</IonSelectOption>
                    <IonSelectOption value="colere">{translate.getText("ANGRY")}</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol className="ion-align-items-center ion-text-center">
                <IonButton className="btn-rounded" onClick={handleSave}><b>OK</b></IonButton>
              </IonCol>
            </IonRow>

          </IonGrid>
        </IonItem>
      }

    </div>
  );
}
export default Sommeil;