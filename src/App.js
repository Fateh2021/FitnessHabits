import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LogIn from './pages/Login/LogIn';
import Register from './pages/Register/Register';
import Intro from './pages/Intro/Intro';
import Dashboard from './pages/Dashboard/Dashboard'
import Settings from './pages/Settings/Settings'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {getCurrentUser} from './firebaseConfig';

const RoutingSystem= () => {
  return ( 
    <IonApp>
      <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/logIn" component={LogIn}/>
            <Route path="/register" component={Register}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/intro" component={Intro} exact={true}/> 
            <Route path="" render={() => <Redirect to="/intro" />} exact={true} />
          </IonRouterOutlet>
      </IonReactRouter>
    </IonApp> 
  )
}

const App= () => {
  const [busy, setBusy] = useState(true)

  useEffect(() =>{
    getCurrentUser().then(user =>{
      if(user){  
        // i'm logged in
        //window.location.href='/dashboard'
        window.history.replaceState({}, '', '/dashboard')    
      }else{
       // window.location.href='/'
        window.history.replaceState({}, '', '/')
      }
      setBusy(false)
    })
  },[])
    // return <IonApp className="fondIntro">{busy ? <IonSpinner/> : <RoutingSystem/>}</IonApp>
     return <IonApp className="fondIntro">{<RoutingSystem/>}</IonApp>
}
export default App;