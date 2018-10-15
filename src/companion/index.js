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
  var info = evt.data.value;
  var url = '';
  if (info === 'location') {
    geolocation.getCurrentPosition(position => {
      url = 'https://avwx.rest/api/metar/' + position.coords.latitude + ',' + position.coords.longitude + '?options=info,translate';
      sendMetarData(url);
    });
  } else if (info === 'favourite') {
    url = 'https://avwx.rest/api/metar/' + JSON.parse(settingsStorage.getItem('station-identifier')).name + '?options=info,translate';
    sendMetarData(url);
  } else if (info) {
    url = 'https://avwx.rest/api/metar/' + info + '?options=info,translate';
    sendMetarData(url);
  }
}

function sendMetarData(param) {
  return new Promise((resolve, reject) => {
    fetch(param).then(response => {
      return response.json();
    }).then(json => {
      if (json.hasOwnProperty('Error')) {
        sendVal('error');
        reject('Invalid ICAO!');
      }
      let sendJSON = {
        'Info': json.Info,
        'Raw-Report': json['Raw-Report'],
        'Translations': json.Translate,
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