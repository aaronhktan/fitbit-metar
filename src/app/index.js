import document from "document";
import * as haptics from "haptics";
import * as messaging from "messaging";
import { sendVal, stripQuotes } from "../common/utils.js";
import { display } from "display";

import UI from './ui';

var ui = new UI();

display.autoOff = false;
var state = "starting"; // Possible states are starting, disconnected, menu, loading-favourite, loading-location, complete, failed
var favouriteStation = "";
var timer, timerSet = false;

document.onkeypress = function(evt) {
  if (evt.key == "back") {
    if (state == "complete" || state == "failed") {
      state = "mainMenu";
      evt.preventDefault();
      ui.showMainMenu();
    }
  }
}

messaging.peerSocket.onopen = function() {
  state = "menu";
  setTimeout(function() {
    ui.showMainMenu();
  }, 1000);
}

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.key == "primary-color") {
    let color = stripQuotes(evt.data.newValue);
    ui.metarTitle.style.fill = color;
  } else if (evt.data.key == "station-identifier") {
    favouriteStation = JSON.parse(evt.data.newValue).name;
  } else if (evt.data.hasOwnProperty("Raw-Report")) {
    if (state == "loading-location" || (state == "loading-favourite" && evt.data.Info.ICAO == favouriteStation)) {
      state = "complete";
      ui.metarTitle.text = evt.data["Raw-Report"];

      var info = "";
      for (var i in evt.data.Info) {
        info = info + i + ": "+ evt.data.Info[i] + "\n";
      }
      ui.metarInfo.style.textLength = info.length;
      ui.metarInfo.text = info;

      var translate = "";
      for (var i in evt.data.Translations) {
        if (i === "Remarks") {
          translate += "Remarks:\n"
          for (var j in evt.data.Translations.Remarks) {
            translate += "    " + j + ": " + evt.data.Translations.Remarks[j] + "\n"; 
          }
        } else {
          translate += i + ": " + evt.data.Translations[i] + "\n";
        }
      }
      ui.metarTranslate.style.textLength = translate.length;
      ui.metarTranslate.text = translate;

      ui.showScrollview();
    }
  } else {
    state = "failed";
    ui.loadingText.text = "Something went wrong. Try relaunching the app.";
  }
}

ui.locationButton.onclick = function(evt) {
  state = "loading-location";
  haptics.vibration.start("confirmation");
  
  if (timerSet) {
    clearTimeout(timer);
    timerSet = false;
  }
  var timer = setTimeout(function() {
    if (state == "loading-location") {
      state = "failed";
      ui.loadingText.text = "This is taking a while... Check your Internet connection and connection to your phone.";
    }
  }, 15000);
  timerSet = true;
  
  let data = {
    key: "buttonPress",
    value: "location"
  };
  sendVal(data);
  
  ui.showLoadingScreen();
  ui.loadingText.text = "Sit tight, we're getting your location and grabbing METAR...";
}

ui.favouriteButton.onclick = function(evt) {
  state = "loading-favourite";
  haptics.vibration.start("confirmation");
  
  if (timerSet) {
    clearTimeout(timer);
    timerSet = false;
  }
  var timer = setTimeout(function() {
    if (state == "loading-favourite") {
      state = "failed";
      ui.loadingText.text = "This is taking a while... Check your Internet connection and connection to your phone.";
    }
  }, 15000);
  timerSet = true;
  
  if (favouriteStation != "") {
    ui.loadingText.text = "Grabbing METAR for station " + favouriteStation + "...";
    let data = {
      key: "buttonPress",
      value: "favourite"
    };
    sendVal(data);
  } else {
    state = "complete";
    ui.loadingText.text = "No favourite station set; check your settings!";
  }
  
  ui.showLoadingScreen();
}

setTimeout(function() {
  if (state == "starting") {
    state = "disconnected";
    ui.loadingText.text = "This is taking a while... Check that your watch is connected to your phone.";
  }
}, 10000);