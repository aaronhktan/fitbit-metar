import { me } from 'companion';
import { geolocation } from 'geolocation';
import { localStorage } from "local-storage";
import * as messaging from 'messaging';
import { settingsStorage } from 'settings';

import { sendVal } from '../common/utils.js';
import { trackEvent } from './track.js';
import { propertyId, metarKey } from './keys.js';

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
      url = `https://avwx.rest/api/metar/${position.coords.latitude},${position.coords.longitude}?options=info,translate&token=${metarKey}`;
      sendMetarData(url);
    });
  } else if (info === 'favourite') {
    // No longer used; kept for backwards compatibility
    url = `https://avwx.rest/api/metar/${JSON.parse(settingsStorage.getItem('station-identifier')).name}?options=info,translate&token=${metarKey}`;
    sendMetarData(url);
  } else if (info) {
    url = 'https://avwx.rest/api/metar/' + info.trim() + '?options=info,translate';
    sendMetarData(url);
  }
}

function sendMetarData(param) {
  return new Promise((resolve, reject) => {
    fetch(param).then(response => {
      return response.json();
    }).then(json => {
      // console.log(JSON.stringify(json));
      if (json.hasOwnProperty('error')) {
        let searchString = 'icao=\'';
        let searchIndex = json.error.indexOf(searchString);
        if (searchIndex < 0) {
          sendVal({'key': 'noStation'});
          return;
        }
        let icao = json.error.substr(searchIndex + searchString.length,
          4);
        sendVal({
          'key': 'noMetar',
          'icao': icao,
        });
        return;
      }
      delete json.info.runways;
      delete json.info.type;
      let sendJSON = {
        'key': 'metar',
        'info': json.info,
        'raw': json.raw,
        'translate': json.translate,
      }
      sendVal(sendJSON);
      resolve(sendJSON);
    }).catch(error => {
      console.log('Fetching failed due to error: ' + error);
      sendVal({'key': 'error'});
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