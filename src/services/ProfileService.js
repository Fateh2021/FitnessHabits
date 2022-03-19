import firebase from 'firebase'

const getUserUID = () => localStorage.getItem('userUid');

const getProfileRef = () =>
  firebase
    .database()
    .ref(
      'dashboard/'
      + getUserUID()
    );


const ProfileService = {
  get: () => {
    let profile = localStorage.getItem('profile');
    if (profile) {
      profile = JSON.parse(profile);
      return Promise.resolve(profile);
    }

    return getProfileRef()
      .once('value')
      .then(snapshot => {
        const profile = snapshot.val();
        if (profile) {
          localStorage.setItem('profile', JSON.stringify(profile));
        }
        return profile;
      })
  }
};

export default ProfileService;