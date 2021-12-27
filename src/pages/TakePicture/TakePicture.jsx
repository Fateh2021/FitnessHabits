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
    this.uploadToStorage();

  }


  uploadToStorage() {
    // Conversion de l'image en blob -- AJOUT TEAM APY
    const fileName = firebase.auth().currentUser.uid + "/profilPictures";
    var getFileBlob = function (url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.addEventListener('load', function() {
        cb(xhr.response);
      });
      xhr.send();
    };
    getFileBlob(this.state.photo, blob =>{
        // Upload l'image avec comme path l'ID firebase de l'utilisateur avec comme filename profilPicture -- AJOUT TEAM APY
        firebase.storage().ref(fileName).put(blob).then(function(snapshot) {
        console.log('Upload réussi !');
        firebase.database().ref("profiles/" + firebase.auth().currentUser.uid).update({
          "profilPicture" : fileName
        });
     });
   })
}

// Downlad image from firebase storage and set photo state
  downloadImage(){
    console.log("downloadImage");
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child(firebase.auth().currentUser.uid + "/profilPictures");
    imageRef.getDownloadURL().then(function(url) {
      console.log(url);
      this.setState({
        photo: url
      })
    }.bind(this));
  }


  
  render() {
    
    let { photo } = this.state;
    /*GEFRAL: Dans le cas où l'utilisateur se connecte avec Google ou Facebook,
    sa photo de profil de son compte utilisé pour la connexion est automatique ajouté à son profil
    */
    if (!photo ){ 
      this.downloadImage();
      /*
      const user = firebase.auth().currentUser;
      if (user != null) {
        photo = user.photoURL;//on récupère la photo de profil de son compte google
      }
      */
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
