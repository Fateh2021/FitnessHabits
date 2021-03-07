import { IonImg, IonIcon, IonAvatar } from '@ionic/react';
import React, { Component } from 'react';
// import { Plugins, CameraResultType } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { aperture } from 'ionicons/icons';

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
    var imageUrl = image.path;
    this.setState({
      photo: imageUrl
    })
    // console.log("Picture URL :::" + this.photo )

    // const { Camera, Filesystem } = Plugins;
    // const options = {
    //   quality: 90,
    //   allowEditing: false,
    //   resultType: CameraResultType.Uri
    // };

    // Camera.getPhoto(options).then(
    //   photo => {
    //     Filesystem.readFile({
    //       path: photo.path
    //     }).then(
    //       result => {
    //         let date = new Date(),
    //           time = date.getTime(),
    //           fileName = time + ".jpeg";

    //         Filesystem.writeFile({
    //           data: result.data,
    //           path: fileName,
    //           directory: FilesystemDirectory.Data
    //         }).then( 
    //           () => {
    //             Filesystem.getUri({
    //               directory: FilesystemDirectory.Data,
    //               path: fileName
    //             }).then(
    //               result => {
    //                 let path = Capacitor.convertFileSrc(result.uri);
    //                 console.log("Path :::::"+path);
    //               },
    //               err => {
    //                 console.log(err);
    //               }
    //             ); 
    //           },
    //           err => {  
    //             console.log(err);
    //           }
    //         );
    //       },
    //       err => { 
    //         console.log(err);
    //       }
    //     );
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  

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