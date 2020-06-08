import document from 'document';
import * as haptics from 'haptics';
import * as messaging from 'messaging';
import { sendVal } from '../common/utils.js';
import { display } from 'display';

import UI from './ui';

var ui = new UI();

display.autoOff = false;
var state = 'starting'; // Possible states are starting, disconnected, menu, list, loading-favourite, loading-location, complete, failed
var favouriteStations = [], currentStation = '';
var timer, timerSet = false;

document.onkeypress = evt => {
  if (evt.key == 'back') {
    console.log(state);
    if (state == 'complete' || state == 'failed' || state == 'list' || state == 'emptylist') {
      ui.showMainMenu(state);
      state = 'main';
      evt.preventDefault();
    }
  }
}

function showMainMenu() {
  state = 'menu';
  setTimeout(function() {
    ui.showMainMenu();
  }, 1000);
}

messaging.peerSocket.onopen = showMainMenu;

messaging.peerSocket.onmessage = evt => {
  switch (evt.data.key) {
    case 'primary-color':
      let color = JSON.parse(evt.data.newValue);
      ui.accentColour = color;
      break;
    case 'station-identifier':
      // THIS IS NOW DEPRECATED AND KEPT ONLY FOR COMPATIBILITY WITH VERSION TWO AND BELOW
      favouriteStations[0] = JSON.parse(evt.data.newValue).name;
      break;
    case 'station-identifiers':
      favouriteStations = [];
      for (let station in JSON.parse(evt.data.newValue)) {
        favouriteStations.push(JSON.parse(evt.data.newValue)[station].name);
      }
      break;
    case 'metar':
      if (state != 'loading-location' &&
          !(state == 'loading-favourite' && evt.data.info.icao == currentStation)) {
        break;
      }
      state = 'complete';
      ui.setMetarTitleText(evt.data['raw']);

      // Get METAR metadata
      let info = [];
      let index = 0;
      for (let key in evt.data.info) {
        if (key == "runways") {
          continue;
        }

        info[index] = {
          'title': key.charAt(0).toUpperCase() + key.slice(1),
          'text': evt.data.info[key],
        }
        index++;
      }
      console.log(JSON.stringify(info));
      ui.setMetarInfoText(info);
 
      // Get remarks
      let remarks = [];
      index = 0;
      if (Object.keys(evt.data.translate.remarks).length === 0) {
        remarks[index] = {
          'title': 'Remarks',
          'text': '---',
        }
      } else {
        for (let key in evt.data.translate.remarks) {
          remarks[index] = {
            'title': key.charAt(0).toUpperCase() + key.slice(1),
            'text': evt.data.translate.remarks[key],
          }
          index++;
        }
      }
      ui.setMetarRemarksText(remarks);
      
      delete evt.data.translate.remarks;

      // Get translation
      let translate = [];
      index = 0;
      for (let key in evt.data.translate) {
        translate[index] = {
          'title': key.charAt(0).toUpperCase() + key.slice(1),
          'text': evt.data.translate[key],
        }
        index++;
      }
      ui.setMetarTranslateText(translate);

      ui.showScrollview();
      break;
    case 'noMetar':
      console.log(JSON.stringify(evt.data));
      state = 'failed';
      ui.loadingText.text = `No METAR was found for station ${evt.data.icao}.`;
      break;
    case 'noStation':
      console.log(JSON.stringify(evt.data));
      state = 'failed';
      ui.loadingText.text = 'No station was found with that name.';
      break;
    default:
      console.log(JSON.stringify(evt.data));
      state = 'failed';
      ui.loadingText.text = 'Uh oh! Something went wrong. Try relaunching the app.';
      break;
  }
}

ui.locationButton.onclick = evt => {
  state = 'loading-location';
  haptics.vibration.start('confirmation');
  
  if (timerSet) {
    clearTimeout(timer);
    timerSet = false;
  }
  timer = setTimeout(() => {
    if (state == 'loading-location') {
      state = 'failed';
      ui.loadingText.text = 'This is taking a while... Check your Internet connection and connection to your phone.';
    }
  }, 15000);
  timerSet = true;
  
  let data = {
    key: 'buttonPress',
    value: 'location'
  };
  sendVal(data);
  
  ui.showLoadingScreen();
  ui.loadingText.text = 'Sit tight, we\'re getting your location and grabbing METAR...';
}

ui.favouriteButton.onclick = evt => {
  haptics.vibration.start('confirmation');
  
  if (favouriteStations.length > 0) {
    state = 'list';
    ui.showStationList(favouriteStations);
  } else {
    state = 'emptylist';
    ui.loadingText.text = 'No favourite stations set; add some on your phone.';
    ui.showLoadingScreen();
  }
}

ui.tiles.forEach((element, index) => {
  let touch = element.getElementById('touch-tile');
  touch.onmousedown = evt => {
    // console.log(`touched: ${index}`);
    touch.style.fill = 'fb-cyan';
  }
  touch.onmouseup = evt => {
    // console.log(JSON.stringify(evt));
    touch.style.fill = 'black';
  }
  touch.onclick = evt => {
    haptics.vibration.start('confirmation');
    
    if (timerSet) {
      clearTimeout(timer);
      timerSet = false;
    }
    timer = setTimeout(() => {
      if (state == 'loading-favourite') {
        state = 'failed';
        ui.loadingText.text = 'This is taking a while... Check your Internet connection and connection to your phone.';
      }
    }, 15000);
    timerSet = true;

    state = 'loading-favourite';
    let favouriteStation = element.getElementById('station-text').text.trim();
    currentStation = favouriteStation;
    ui.loadingText.text = 'Grabbing METAR for station ' + favouriteStation + '...';
    let data = {
      key: 'buttonPress',
      value: favouriteStation,
    };
    sendVal(data);
    ui.showLoadingScreen();
  }
});

setTimeout(() => {
  if (state == 'starting') {
    state = 'disconnected';
    ui.loadingText.text = 'This is taking a while... Check that your watch is connected to your phone.';
  }
}, 10000);
