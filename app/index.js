import document from "document";
import * as messaging from "messaging";
import { sendVal, stripQuotes } from "../common/utils.js";
import { display } from "display";
display.autoOff = false;

console.log("App Started");

var connected = false;
var offline = true;
var favouriteStation = "";
let back = document.getElementById("back");
let locationButton = document.getElementById("location");
let favouriteButton = document.getElementById("favourite");
let bannerText = document.getElementById("banner-text");
let loadingText = document.getElementById("loading-text");
let scrollview = document.getElementById("scrollview");
let metarTitle = document.getElementById("metar-title");
let metarInfo = document.getElementById("metar-info");
let metarTranslate = document.getElementById("metar-translate");

messaging.peerSocket.onopen = function() {
  connected = true;
  setTimeout(function() {
    locationButton.style.display = "inline";
    favouriteButton.style.display = "inline";
    bannerText.style.display = "inline";
    loadingText.style.display = "none";
  }, 1000);
}

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.key == "primary-color") {
    let color = stripQuotes(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    metarTitle.style.fill = color;
  } else if (evt.data.key == "station-identifier") {
    favouriteStation = stripQuotes(JSON.stringify(JSON.parse(evt.data.newValue).name));
    console.log(`Setting favourite station: ${favouriteStation}`);
  } else if (evt.data.hasOwnProperty("Raw-Report")) {
    var offline = false;
    console.log(evt.data["Raw-Report"]);
    metarTitle.text = evt.data["Raw-Report"];
    
    var info = "";
    for (var i in evt.data.Info) {
      info = info + i + ": "+ evt.data.Info[i] + "\n";
    }
    console.log(info);
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
    console.log(translate);
    metarTranslate.style.textLength = translate.length;
    metarTranslate.text = translate;
    
    loadingText.style.display = "none";
    scrollview.style.display = "inline";
  } else {
    var offline = false;
    loadingText.text = "Something went wrong. Try relaunching the app.";
  }
}

locationButton.onactivate = function(evt) {
  console.log("Location button clicked");
  setTimeout(function() {
    if (offline) {
      loadingText.text = "This is taking a while... Check your Internet connection, then try exiting and launching again.";
    }
  }, 30000);
  let data = {
    key: "buttonPress",
    value: "location"
  };
  sendVal(data);
  locationButton.style.display = "none";
  favouriteButton.style.display = "none";
  bannerText.style.display = "none";
  loadingText.text = "Sit tight, we're getting your location and grabbing METAR...";
  loadingText.style.display = "inline";
}

favouriteButton.onactivate = function(evt) {
  console.log("Favourite button clicked");
  var timer = setTimeout(function() {
    if (offline) {
      loadingText.text = "This is taking a while... Check your Internet connection, then try exiting and launching again.";
    }
  }, 10000);` `
  let data = {
    key: "buttonPress",
    value: "favourite"
  };
  locationButton.style.display = "none";
  favouriteButton.style.display = "none";
  bannerText.style.display = "none";
  
  if (favouriteStation != "") {
    loadingText.text = "Grabbing METAR for station " + favouriteStation + "...";
    sendVal(data);
  } else {
    offline = false;
    loadingText.text = "No favourite station set; check your settings!";
  }
  loadingText.style.display = "inline";
}

setTimeout(function() {
  if (!connected) {
    loadingText.text = "This is taking a while... Check that your watch is connected to your phone.";
  }
}, 10000);