import { geolocation } from 'geolocation';
import * as messaging from 'messaging';
import { me } from 'companion';
import { sendVal } from '../common/utils.js';
import { settingsStorage } from 'settings';

var locationString = '';

messaging.peerSocket.onopen = () => {
  restoreSettings();
}

messaging.peerSocket.onmessage = evt => {
  let info = evt.data.value;
  let url = '';
  if (info === 'location') {
    geolocation.getCurrentPosition(position => {
      url = 'https://avwx.rest/api/preview/metar/' + position.coords.latitude + ',' + position.coords.longitude + '?options=info,translate';
      sendMetarData(url);
    });
  } else if (info === 'favourite') {
    url = 'https://avwx.rest/api/preview/metar/' + JSON.parse(settingsStorage.getItem('station-identifier')).name + '?options=info,translate';
    sendMetarData(url);
  } else if (info) {
    url = 'https://avwx.rest/api/preview/metar/' + info + '?options=info,translate';
    sendMetarData(url);
  }
}

function sendMetarData(param) {
  return new Promise((resolve, reject) => {
    fetch(param).then(response => {
      return response.json();
    }).then(json => {
      // console.log(json);
      if (json.hasOwnProperty('Error')) {
        sendVal('error');
        reject('Invalid ICAO!');
      }
      let sendJSON = {
        'Info': json.info,
        'Raw-Report': json.raw,
        'Translations': json.translate,
      }
      sendVal(sendJSON);
      resolve(sendJSON);
    }).catch(function(error) {
      console.log('Fetching failed due to error: ' + error);
      sendVal('error');
      reject(error);
    });
  });
}

settingsStorage.onchange = evt => {
  if (evt.key == 'station-identifiers') {
    settingsStorage.removeItem('station-identifier');
  }
  
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
};

function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    }
  }
}