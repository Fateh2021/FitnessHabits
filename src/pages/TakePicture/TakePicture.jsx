import { IonImg, IonIcon, IonAvatar } from '@ionic/react';
import React, { Component } from 'react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { aperture } from 'ionicons/icons';
import firebase from "firebase";// import ajouté par GEFRAL

import { Plugins, CameraResultType } from '@capacitor/core';

  const { Camera } = Plugins;
  const INITIAL_STATE = {
    photo: '',
  };

export class TakePicture extends Component {
  

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    defineCustomElements(window);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    var imageUrl = image.webPath;
    this.setState({
      photo: imageUrl
    })

  }
  
  render() {
    let { photo } = this.state;
    /*GEFRAL: Dans le cas où l'utilisateur se connecte avec Google ou Facebook,
    sa photo de profil de son compte utilisé pour la connexion est automatique ajouté à son profil
    */
    if (!photo){ //
      const user = firebase.auth().currentUser;
      if (user != null) {
        photo = user.photoURL;//on récupère la photo de profil de son compte google
      }
    }

    return (       
      <div>
        <button className="sideBarButtonCamera" onClick={() => this.takePicture()} color="danger">
          <IonIcon icon={aperture}/>
        </button>
        <IonAvatar className='avatarProfil'>
          <IonImg style={{ 'border': '1px solid black', 'minHeight': '100px' }} src={photo} ></IonImg>
        </IonAvatar>
      </div>
    );
  }
}
export default TakePicture;
