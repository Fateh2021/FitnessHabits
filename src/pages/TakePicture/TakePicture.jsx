import { IonImg, IonIcon, IonAvatar } from '@ionic/react';
import React, { Component } from 'react';
import { Plugins, CameraResultType } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { aperture } from 'ionicons/icons';

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
    const { photo } = this.state;
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
  };
}
export default TakePicture;