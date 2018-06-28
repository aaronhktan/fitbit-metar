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
    if (state == 'complete' || state == 'failed' || state == 'list') {
      state = 'main';
      evt.preventDefault();
      ui.showMainMenu();
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
  if (evt.data.key == 'primary-color') {
    let color = JSON.parse(evt.data.newValue);
    ui.metarTitle.style.fill = color;
  } else if (evt.data.key == 'station-identifier') {
    // THIS IS NOW DEPRECATED AND KEPT ONLY FOR COMPATIBILITY WITH VERSION TWO AND BELOW
    favouriteStations[0] = JSON.parse(evt.data.newValue).name;
  } else if (evt.data.key == 'station-identifiers') {
    favouriteStations = [];
    for (let station in JSON.parse(evt.data.newValue)) {
      favouriteStations.push(JSON.parse(evt.data.newValue)[station].name);
    }
  } else if (evt.data.hasOwnProperty('Raw-Report')) {
    if (state == 'loading-location' || 
        (state == 'loading-favourite' && evt.data.Info.ICAO == currentStation)) {
      state = 'complete';
      ui.setMetarTitleText(evt.data['Raw-Report']);

      let info = '';
      for (var i in evt.data.Info) {
        info = info + i + ': '+ (evt.data.Info[i] == '' ? '---' : evt.data.Info[i]) + '\n';
      }
      ui.setMetarInfoText(info);

      let translate = '';
      let remarks = '';
      for (let i in evt.data.Translations) {
        if (i === 'Remarks') {
          remarks += 'Remarks:\n\n';
          if (Object.keys(evt.data.Translations.Remarks).length === 0) {
            remarks += '---\n\n';
          } else {
            for (let j in evt.data.Translations.Remarks) {
              remarks += j + ':\n' + evt.data.Translations.Remarks[j] + '\n\n'; 
            }
          }
        } else {
          translate += i + ':\n' + (evt.data.Translations[i] == '' ? '---' : evt.data.Translations[i]) + '\n\n';
        }
      }
      
      remarks = remarks.slice(0, -2);
      translate = translate.slice(0, -2);
      ui.setMetarTranslateText(translate);
      
      ui.setMetarRemarksText(remarks);

      ui.showScrollview();
    }
  } else {
    console.log(JSON.stringify(evt.data));
    state = 'failed';
    ui.loadingText.text = 'Uh oh! Something went wrong. Try relaunching the app.';
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
    state = 'complete';
    ui.loadingText.text = 'No favourite station set; check your settings!';
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
    let favouriteStation = element.getElementById('station-text').text;
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