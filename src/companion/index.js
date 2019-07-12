import { me } from 'companion';
import { geolocation } from 'geolocation';
import { localStorage } from "local-storage";
import * as messaging from 'messaging';
import { settingsStorage } from 'settings';

import { sendVal } from '../common/utils.js';
import { trackEvent } from './track.js';
import { propertyId } from './keys.js';

var locationString = '';

const clientId = localStorage.getItem('clientId') || Math.floor(Math.random() * 10000000000000000);
localStorage.setItem('clientId', clientId);

messaging.peerSocket.onopen = () => {
  restoreSettings();
  trackEvent({
    propertyId: propertyId,
    clientId: clientId,
    hitType: 'event',
    eventCategory: 'lifecycle',
    eventAction: 'load',
  });
}

messaging.peerSocket.onmessage = evt => {
  let info = evt.data.value;
  let url = '';
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
      // console.log(JSON.stringify(json));
      if (json.hasOwnProperty('Error')) {
        sendVal('error');
        reject('Invalid ICAO!');
      }
      delete json.info.runways;
      delete json.info.type;
      let sendJSON = {
        'Info': json.info,
        'Raw-Report': json.raw,
        'Translations': json.translate,
      }
      sendVal(sendJSON);
      resolve(sendJSON);
    }).catch(error => {
      console.log('Fetching failed due to error: ' + error);
      sendVal('error');
      trackEvent({
        propertyId: propertyId,
        clientId: clientId,
        hitType: 'exception',
        exceptionDescription: param + ' ' + error,
        data: [param],
      });
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