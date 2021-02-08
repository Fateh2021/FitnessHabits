import * as firebase from 'firebase'
import "firebase/auth";
import "firebase/firestore";
import React, {useState, useEffect} from "react"
import { IonList, IonGrid, IonRow, IonCol, IonHeader, IonIcon, IonInput, IonLabel, IonContent, IonItemDivider, IonItem} from "@ionic/react";
import { arrowRoundBack, logOut } from "ionicons/icons";
import { TakePicture } from "../../TakePicture/TakePicture"

const Sidebar = (props) => {
    const [sidebarClass, setSidebarClass] = useState(props.sidebarClass); 
    const [profile, setProfile] = useState({
        pseudo: "",
        email: "",
        size: "",
        gender: ""
      });

    // load the current profile from the local storage id it exists, otherwise load it from the DB
    useEffect(() => {
        const localProfile = localStorage['profile'];
        if (localProfile) {
            setProfile(JSON.parse(localProfile));
        } else {
            const userUID = localStorage.getItem('userUid');
            console.log("Loading Profile From DB...");
            firebase.database().ref('profiles/'+userUID)
            .once("value", (snapshot) => {
                const prof = snapshot.val();
                if (prof) {
                    localStorage.setItem('profile', JSON.stringify(prof));
                    setProfile(prof);
                }               
            });
        }
    }, []);

    const handleInputChange = event => {
        const userUID = localStorage.getItem('userUid');
        const { name, value } = event.target;
        const updatedProfile = { ...profile, [name]: value ? value : "" };
        setProfile({ ...profile, [name]: value ? value : "" });
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        firebase.database().ref('profiles/'+userUID).update({
            "pseudo": profile.pseudo,
            "email": profile.email,
            "size": profile.size,
            "gender": profile.gender
          }
        )
      };

    const signOutUser = () => {
        firebase.auth().signOut().then(function() {
            // clear the localstorage
            localStorage.clear();
            // Sign-out successful.
            window.location.href='/intro' 
          }).catch(function(error) {
            // An error happened.
          });
    }

    const closeHandler = (e) => {
        e.preventDefault();
        setSidebarClass('sidebarClose');
        props.close()
    }

    return (
        <div className={sidebarClass}>
            <IonHeader className="sideBarHeader">
                <IonGrid >
                    <IonRow >
                        <TakePicture/>
                        <IonCol size="5">
                            <IonInput className='userNameProfil' value="" readonly color="danger"><h3>{profile.pseudo}</h3></IonInput>
                        </IonCol>
                        <IonCol size="1.5">
                            <button id="close" className="sideBarButton" color="danger" onClick={(e) => closeHandler(e)}> 
                                <IonIcon  icon={arrowRoundBack}/>
                            </button>
                            <button id="close" className="sideBarButtonLogout" color="danger" onClick={signOutUser}> 
                                <IonIcon  icon={logOut}/>
                            </button>
                        </IonCol>
                    </IonRow>
                </IonGrid>          
            </IonHeader>
            <IonGrid >
                <IonRow>
                    <IonCol ></IonCol>
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
                    <IonLabel className='headerTitleDashboard' color='danger'>
                        <h3>Profil</h3>
                    </IonLabel> 
                </IonCol>
            </IonRow>
            <IonContent className='contentProfil'>

                <IonList>
                    <IonItemDivider color='warning' className = 'profilText'><h2>Pseudo</h2></IonItemDivider>
                    <IonItem>
                    <IonInput className = 'inputProfilText' type='text' name="pseudo" value={profile.pseudo} onIonChange={handleInputChange} placeholder="Nom" clearInput ></IonInput>
                    </IonItem>

                    <IonItemDivider color='warning' className = 'profilText'><h2>Email</h2></IonItemDivider>
                    <IonItem>
                    <IonInput className = 'inputProfilText' type='url' name="email" value={profile.email} onIonChange={handleInputChange} placeholder="URL" clearInput></IonInput>
                    </IonItem>

                    <IonItemDivider color='warning' className = 'profilText'><h2>Taille</h2></IonItemDivider>
                    <IonItem>
                    <IonInput className = 'inputProfilText' type='text' name="size" value={profile.size} onIonChange={handleInputChange} placeholder="Centimètres" clearInput></IonInput>
                    </IonItem>

                    <IonItemDivider className = 'profilText'><h2>Sexe</h2></IonItemDivider>
                    <IonItem>
                    <IonInput className = 'inputProfilText' type= 'text' name="gender" value={profile.gender} onIonChange={handleInputChange} placeholder="Genre" clearInput></IonInput>
                    </IonItem>

                    <IonItemDivider color='warning' className = 'profilText'></IonItemDivider>
                
                </IonList>
            </IonContent>
        </div>
    )
}
export default Sidebar;