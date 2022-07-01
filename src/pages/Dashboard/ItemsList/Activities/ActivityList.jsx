import React, {useState} from "react"
import firebase from 'firebase'
import { IonModal, IonContent, IonIcon, IonLabel} from '@ionic/react';
import {settings, addCircle} from 'ionicons/icons';
import * as translate from "../../../../translate/Translator";
import '../../../Tab1.css';
import ActivityItem from "./ActivityItem";
import ActivityAddForm from "./ActivityAddForm";

const ActivityList = (props) =>  {
    const [activities, setActivities] = useState (props.activities);
    const [showAddForm, setShowAddForm] = useState(false)

    /*
      Add a new activity to the firebase database.
      Give the activity an unique id.
      Concatenate the new activity to the list.
    */
    const addActivity = (activityToAdd) => {
        const userUID = localStorage.getItem('userUid')
        let newId = 1
        if (activities.length !== 0) {
            newId = Math.max.apply(Math, activities.map((practice) => {return practice.id})) + 1
        }
        let newActivity = {
            id: newId,
            name: activityToAdd.name,
            time: activityToAdd.time,
            duration: activityToAdd.duration,
            intensity: activityToAdd.intensity
        }
        firebase.database().ref('activity/'+userUID).update({activities: activities.concat(newActivity)}).then(() => {
            setActivities(activities.concat(newActivity))
        })
    }

    /*
      Modify a activity in the firebase database.
      Filter the old activity from the current list.
      Concatenate the new activity to the list.
    */
    const modifyActivity = (activityToModify) => {
        const userUID = localStorage.getItem('userUid')

        let activityWithoutOld = activities.filter((activity) => {
            return activity.id !== activityToModify.id
        }).concat({...activityToModify})

        firebase.database().ref('activity/'+userUID).update({activities: activityWithoutOld}).then(() => {
          setActivities(activityWithoutOld)
        })

    }

    /*
      Remove a activity from the firebase database.
      Filter the activity from the current list.
    */
    const removeActivity = (activityToDelete) => {
        const remainingActivities = activities.filter( (activity) => {
            if(activity.id === activityToDelete.id) {
                return false
            }
            return true
        })

        const userUID = localStorage.getItem('userUid')
        firebase.database().ref('activity/'+userUID).update({activities: remainingActivities}).then(() => {
          setActivities(remainingActivities)
        })
    };

    return (
        <div>

            <IonModal data-testid="activityList" className="activity-modal-big"
                      isOpen={props.showActivityList} onDidDismiss={() => props.setShowActivityList(false)}>
                <IonContent className="activity-content">
                    <IonLabel data-testid="activityTitle"><h1 className='activityTitle' >{translate.getText("USUAL_ACTIVITES")}</h1></IonLabel>
                    <br/>
                    {
                        activities.map(activity => (
                            <ActivityItem key={activity.id} activity={activity} modifyActivity={modifyActivity} onRemoveActivity={removeActivity} />
                        ))
                    }
                    <br/>
                    <IonIcon className='addButtonActivity' data-testid="addActivity" icon={addCircle} onClick={() => setShowAddForm(true)} />
                    <ActivityAddForm onSubmitAction={addActivity} isOpen={showAddForm} onDidDismiss={setShowAddForm} />
                </IonContent>
            </IonModal>
        </div>
    );
}
export default ActivityList;