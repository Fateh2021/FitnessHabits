import { IonImg, IonIcon, IonAvatar } from '@ionic/react';
import React, { Component } from 'react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { aperture } from 'ionicons/icons';
import firebase from "firebase";
import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

const INITIAL_STATE = {
  photo: '',
  needsLoading: true,
};


export class TakePicture extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    defineCustomElements(window);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      targetHeight: 200,
      targetWidth: 200,
    });

    this.setState({
      photo: image.webPath,
      needsLoading: false,
    })

    this.uploadToStorage();
  }


  uploadToStorage() {
    const fileName = "profilPictures/" + firebase.auth().currentUser.uid;
    var getFileBlob = function (url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.addEventListener('load', function () {
        cb(xhr.response);
      });
      xhr.send();
    };
    getFileBlob(this.state.photo, blob => {
      firebase.storage().ref(fileName).put(blob).then(function (snapshot) {
        console.log('Upload réussi !');
        firebase.database().ref("profiles/" + firebase.auth().currentUser.uid).update({
          "profilPicture": fileName
        });
      });
    })
  }

  // Download image from firebase storage and set photo state
  async downloadImage() {
    // Si l'URL est connu.
    const cachedURL = localStorage.getItem("profile-picture-cache");
    if (cachedURL) {
      this.setState({ photo: cachedURL, needsLoading: false });
      return;
    }

    // Fetch image from storage or provider profile
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child("profilPictures/" + firebase.auth().currentUser.uid);
    let photoUrl = '';

    try {
      photoUrl = await imageRef.getDownloadURL();
    } catch (err) {
      // Si aucune photo custom, on utilise la photo de Fb/Google
      if (!photoUrl && firebase.auth().currentUser?.photoURL) {
        photoUrl = firebase.auth().currentUser.photoURL;
      }
    }

    localStorage.setItem("profile-picture-cache", photoUrl);
    this.setState({ photo: photoUrl, needsLoading: false });
  }

  componentDidMount() {
    let { photo, needsLoading } = this.state;
    if (!photo && needsLoading) {
      this.downloadImage();
    }
  }

  render() {
    return (
      <div>
        <button className="sideBarButtonCamera" onClick={this.takePicture} color="danger">
          <IonIcon icon={aperture} />
        </button>
        <IonAvatar className='avatarProfil'>
          <IonImg style={{ 'border': '1px solid black', 'minHeight': '100px' }} src={this.state.photo} data-testid="profile-picture" ></IonImg>
        </IonAvatar>
      </div>
    );
  }
}
export default TakePicture;
