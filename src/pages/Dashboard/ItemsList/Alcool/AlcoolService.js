import firebase from 'firebase'
import DefaultSettings from '../../../Settings/DefaultSettings'

const getUserUID = () => localStorage.getItem('userUid');

const getDashBoardRef = (currentDate) =>
  firebase
    .database()
    .ref(
      'dashboard/'
      + getUserUID()
      + (currentDate
        ? (
          "/"
          + currentDate.startDate.getDate()
          + (currentDate.startDate.getMonth() + 1)
          + currentDate.startDate.getFullYear()
        )
        : ''
      )
    );

const updateDashBoardRef = (currentDate, dashboard) =>
  getDashBoardRef(currentDate).update(dashboard);

const getDashboardLocalStorage = () =>
  JSON.parse(localStorage.getItem('dashboard'));

const updateDashboardLocalStorage = (dashboard) =>
  localStorage.setItem('dashboard', JSON.stringify(dashboard));

const AlcoolService = {
  updateAlcools: (alcools, currentDate) => {
    const dashboard = getDashboardLocalStorage();
    dashboard.alcool.alcools = alcools;
    updateDashboardLocalStorage(dashboard);

    return updateDashBoardRef(currentDate, dashboard);
  },
  updateGlobalConsumption: (totalConsumption, currentDate) => {
    const dashboard = getDashboardLocalStorage();
    dashboard.alcool.dailyTarget.globalConsumption = totalConsumption;
    updateDashboardLocalStorage(dashboard);

    return updateDashBoardRef(currentDate, dashboard);
  },
  getSettings: () =>
    firebase
      .database()
      .ref('settings/' + getUserUID() + '/alcool')
      .once('value')
      .then(snapshot => {
        const sets = snapshot.val();
        const alcoolSettings = sets ?? {
          dailyTarget: {
            value: 0,
            unit: ''
          },
          notifications: {
            active: false
          },
          limitConsom: {
            educAlcool: true,
            weeklyTarget: 0,
            dailyTarget: 0,
            sobrietyDays: 7,
            notificationMessage: ''
          },
          alcools: DefaultSettings.alcools
        };
        return alcoolSettings;
      })
  ,
  getConsommations: () =>
    getDashBoardRef()
      .orderByKey()
      .once('value')
      .then(snapshot => snapshot.val())
};

export default AlcoolService; 