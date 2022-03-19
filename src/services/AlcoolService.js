import firebase from 'firebase'
import DefaultSettings from '../pages/Settings/DefaultSettings'

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

const getSettingsRef = () =>
  firebase
    .database()
    .ref(
      'settings/'
      + getUserUID()
    );

const updateDashBoardRef = (currentDate, dashboard) =>
  getDashBoardRef(currentDate).update(dashboard);

const getDashboardLocalStorage = () =>
  JSON.parse(localStorage.getItem('dashboard'));

const getSettingsLocalStorage = () =>
  JSON.parse(localStorage.getItem('settings'));

const updateDashboardLocalStorage = (dashboard) =>
  localStorage.setItem('dashboard', JSON.stringify(dashboard));

const updateSettingsRef = (settings) =>
  getSettingsRef().update(settings);

const updateSettingsLocalStorage = (settings) =>
  localStorage.setItem('settings', JSON.stringify(settings));

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
  ,
  addDashboardAlcool: (alcoolToRemove, currentDate) => {
    const dashboard = getDashboardLocalStorage();
    dashboard.alcool.alcools.unshift(alcoolToRemove);
    updateDashboardLocalStorage(dashboard);

    return updateDashBoardRef(currentDate, dashboard);
  },
  dashboard: {
    removeAlcool: (alcoolToRemove, currentDate) => {
      const dashboard = getDashboardLocalStorage();
      dashboard.alcool.alcools.unshift(alcoolToRemove);
      updateDashboardLocalStorage(dashboard);
      
      return updateDashBoardRef(currentDate, dashboard);
    }
  },
  settings: {
    updateAlcools: (alcools) => {
      const settings = getSettingsLocalStorage();
      settings.alcool.alcools = alcools;
      updateSettingsLocalStorage(settings);
  
      return updateSettingsRef(settings);
    }
  }
};

export default AlcoolService; 