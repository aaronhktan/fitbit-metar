import document from "document";
import * as messaging from "messaging";
import { sendVal, stripQuotes } from "../common/utils.js";
import { display } from "display";
display.autoOff = false;

var state = "starting"; // Possible states are starting, disconnected, menu, loading, complete, failed
var favouriteStation = "";
var timer, timerSet = false;
let mainMenu = document.getElementById("main-menu");
let locationButton = document.getElementById("location");
let favouriteButton = document.getElementById("favourite");
let loading = document.getElementById("loading");
let loadingText = document.getElementById("loading-text");
let scrollview = document.getElementById("scrollview");
let metarTitle = document.getElementById("metar-title");
let metarInfo = document.getElementById("metar-info");
let metarTranslate = document.getElementById("metar-translate");

document.onkeypress = function(evt) {
  if (evt.key == "back") {
    if (state == "complete" || state == "failed") {
      state = "mainMenu";
      evt.preventDefault();
      loading.style.display = "none";
      mainMenu.style.display = "inline";
      scrollview.style.display = "none";
    }
  }
}

messaging.peerSocket.onopen = function() {
  state = "menu";
  setTimeout(function() {
    mainMenu.style.display = "inline";
    loading.style.display = "none";
  }, 1000);
}

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.key == "primary-color") {
    let color = stripQuotes(evt.data.newValue);
    metarTitle.style.fill = color;
  } else if (evt.data.key == "station-identifier") {
    favouriteStation = JSON.parse(evt.data.newValue).name;
  } else if (evt.data.hasOwnProperty("Raw-Report")) {
    if (state == "loading") {
      state = "complete";
      metarTitle.text = evt.data["Raw-Report"];

      var info = "";
      for (var i in evt.data.Info) {
        info = info + i + ": "+ evt.data.Info[i] + "\n";
      }
      metarInfo.style.textLength = info.length;
      metarInfo.text = info;

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
      metarTranslate.style.textLength = translate.length;
      metarTranslate.text = translate;

      loading.style.display = "none";
      scrollview.style.display = "inline";
    }
  } else {
    state = "failed";
    loadingText.text = "Something went wrong. Try relaunching the app.";
  }
}

locationButton.onclick = function(evt) {
  state = "loading";
  if (timerSet) {
    clearTimeout(timer);
  }
  var timer = setTimeout(function() {
    if (state != "menu" && state != "complete") {
      state = "failed";
      loadingText.text = "This is taking a while... Check your Internet connection and connection to your phone.";
    }
  }, 15000);
  timerSet = true;
  let data = {
    key: "buttonPress",
    value: "location"
  };
  sendVal(data);
  mainMenu.style.display = "none";
  loadingText.text = "Sit tight, we're getting your location and grabbing METAR...";
  loading.style.display = "inline";
}

favouriteButton.onclick = function(evt) {
  state = "loading";
  if (timerSet) {
    clearTimeout(timer);
  }
  var timer = setTimeout(function() {
    if (state != "menu" && state != "complete") {
      state = "failed";
      loadingText.text = "This is taking a while... Check your Internet connection and connection to your phone.";
    }
  }, 15000);
  timerSet = true;
  let data = {
    key: "buttonPress",
    value: "favourite"
  };
  
  if (favouriteStation != "") {
    loadingText.text = "Grabbing METAR for station " + favouriteStation + "...";
    sendVal(data);
  } else {
    state = "complete";
    loadingText.text = "No favourite station set; check your settings!";
  }
  
  mainMenu.style.display = "none";
  loading.style.display = "inline";
}

setTimeout(function() {
  if (state == "starting") {
    state = "disconnected";
    loadingText.text = "This is taking a while... Check that your watch is connected to your phone.";
  }
}, 10000);