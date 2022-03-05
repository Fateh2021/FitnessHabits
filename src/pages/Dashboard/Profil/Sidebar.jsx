import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import React, { useState, useEffect } from "react";
import { IonList, IonGrid, IonRow, IonCol, IonHeader, IonIcon, IonInput, IonLabel, IonContent, IonItemDivider, IonItem } from "@ionic/react";
import { arrowRoundBack, logOut } from "ionicons/icons";
import { TakePicture } from "../../TakePicture/TakePicture";
import * as translate from "../../../translate/Translator";

// Note: remove picturedDisabled once TakePicture is properly implemented/fixed.
const Sidebar = ({ handleClose, pictureDisabled }) => {
    const [sidebarClass, setSidebarClass] = useState("sidebar");
    const [profile, setProfile] = useState({
        pseudo: "",
        email: "",
        size: "",
        gender: "",
        dateFormat: "",
        profilePicture: "",
    });

    // load the current profile from the local storage if it exists, otherwise load it from the DB
    useEffect(() => {
        const localProfile = localStorage.getItem("profile");
        if (localProfile) {
            setProfile(JSON.parse(localProfile));
        } else {
            const userUID = localStorage.getItem("userUid");
            console.log("Loading Profile From DB...");
            firebase.database().ref("profiles/" + userUID)
                .once("value", (snapshot) => {
                    const dbProfile = snapshot.val();
                    if (dbProfile) {
                        localStorage.setItem("profile", JSON.stringify(dbProfile));
                        setProfile(dbProfile);
                    }
                });

            // Update User Data, when applicable
            const supportedAuthProviderIds = [
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ];

            let user = firebase.auth().currentUser;
            if (supportedAuthProviderIds.includes(user.providerId)) {
                profile.pseudo = user.displayName.replace(" ", ".");
                profile.email = user.email;
                const userUID = localStorage.getItem("userUid");
                //Sauvegarde ou mise à jour dans la base de données firebase
                firebase.database().ref("profiles/" + userUID).update({
                    "pseudo": profile.pseudo,
                    "email": profile.email,
                });
            }
        }
    }, []);

    const handleInputChange = (event) => {
        const userUID = localStorage.getItem("userUid");
        const { name, value } = event.target;
        const updatedProfile = { ...profile, [name]: (value ?? "") };
        setProfile({ ...profile, [name]: value ? value : "" });
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        firebase.database().ref("profiles/" + userUID).update({
            [name]: (value ?? "")
        });
    };

    const handleUserSignOut = () => {
        firebase.auth().signOut().then(() => {
            localStorage.clear();
            window.location.replace("/");
        }).catch(console.log);
    }

    const closeHandler = (e) => {
        e.preventDefault();
        setSidebarClass("sidebarClose");
        handleClose();
    }

    return (
        <div className={sidebarClass} data-testid="sidebar">
            <IonHeader className="sideBarHeader">
                <IonGrid >
                    <IonRow >
                        { !pictureDisabled && <TakePicture />}
                        <IonCol size="5">
                            <IonInput className="userNameProfil" value="" readonly color="danger"><h3 data-testid="username">{profile.pseudo}</h3></IonInput>
                        </IonCol>
                        <IonCol size="1.5">
                            <button id="close" data-testid="btn-close" className="sideBarButton" color="danger" onClick={closeHandler}>
                                <IonIcon icon={arrowRoundBack} />
                            </button>
                            <button id="close" className="sideBarButtonLogout" color="danger" onClick={handleUserSignOut} data-testid="btn-signout">
                                <IonIcon icon={logOut} />
                            </button>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonHeader>
            <IonGrid>
                <IonRow>
                    <IonCol></IonCol>
                    <div className="divImgSettLogo">
                        <IonCol size="4">
                            <img className="logoSideBar" src="/assets/Logo2.png" alt="" />
                        </IonCol>
                    </div>
                    <IonCol ></IonCol>
                </IonRow>
            </IonGrid>
            <IonRow className="sideBarHeader">
                <IonCol>
                    <IonLabel className="headerTitleDashboard" color="danger">
                        <h3>{translate.getText("SIDEBAR_LBL_PROFILE")}</h3>
                    </IonLabel>
                </IonCol>
            </IonRow>
            <IonContent className="contentProfil">

                <IonList>
                    <IonItemDivider color="warning" className="profilText"><h2>{translate.getText("SIDEBAR_LBL_USERNAME")}</h2></IonItemDivider>
                    <IonItem>
                        <IonInput className="inputProfilText" type="text" name="pseudo" value={profile.pseudo} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_LBL_USERNAME")} clearInput ></IonInput>
                    </IonItem>

                    <IonItemDivider color="warning" className="profilText"><h2>{translate.getText("SIDEBAR_LBL_EMAIL")}</h2></IonItemDivider>
                    <IonItem>
                        <IonInput className="inputProfilText" type="email" name="email" value={profile.email} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_PLCHLDR_EMAIL")} clearInput data-testid="email"></IonInput>
                    </IonItem>

                    <IonItemDivider color="warning" className="profilText"><h2>{translate.getText("SIDEBAR_LBL_TAILLE")}</h2></IonItemDivider>
                    <IonItem>
                        <IonInput className="inputProfilText" type="number" name="size" value={profile.size} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"></IonInput>
                    </IonItem>

                    <IonItemDivider className="profilText"><h2>{translate.getText("SIDEBAR_LBL_SEXE")}</h2></IonItemDivider>
                    <IonItem>
                        <IonInput className="inputProfilText" type="text" name="gender" value={profile.gender} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_LBL_SEXE")} clearInput data-testid="gender"></IonInput>
                    </IonItem>

                    <IonItemDivider className="profilText">
                        <h2>{translate.getText("SIDEBAR_LBL_DATEFORMAT")}</h2>
                    </IonItemDivider>
                    <select name="dateFormat" value={profile.dateFormat} onChange={handleInputChange} data-testid="dateFormat">
                        <option value="LL-dd-yyyy">{translate.getText("SIDEBAR_OPTION_DATE_1")}</option>
                        <option value="dd-LL-yyyy">{translate.getText("SIDEBAR_OPTION_DATE_2")}</option>
                        <option value="yyyy-LL-dd">{translate.getText("SIDEBAR_OPTION_DATE_3")}</option>
                        <option value="yyyy-LLL-dd">{translate.getText("SIDEBAR_OPTION_DATE_4")}</option>
                        <option value="dd-LLL-yyyy">{translate.getText("SIDEBAR_OPTION_DATE_5")}</option>
                    </select>

                    <IonItemDivider color="warning" className="profilText"></IonItemDivider>

                </IonList>
            </IonContent>
        </div>
    )
}
export default Sidebar;