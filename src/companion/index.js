import { geolocation } from "geolocation";
import * as messaging from "messaging";
import { me } from "companion";
import { sendVal, stripQuotes } from "../common/utils.js";
import { settingsStorage } from "settings";

var locationString = "";

messaging.peerSocket.onopen = function() {
  restoreSettings();
}

messaging.peerSocket.onmessage = function(evt) {
  var info = evt.data.value;
  var url = "";
  if (info === "location") {
    geolocation.getCurrentPosition(function(position) {
      url = "https://avwx.rest/api/metar/" + position.coords.latitude + "," + position.coords.longitude + "?options=info,translate";
      sendMetarData(url);
    });
  } else if (info === "favourite") {
    url = "https://avwx.rest/api/metar/" + stripQuotes(JSON.stringify(JSON.parse(settingsStorage.getItem("station-identifier")).name)) + "?options=info,translate";
    sendMetarData(url);
  }
}

function sendMetarData(param) {
  return new Promise(function(resolve, reject) {
    fetch(param).then(function(response) {
      return response.json();
    }).then(function(json) {
      sendVal(json);
      resolve(json);
    }).catch(function(error) {
      console.log("Fetching failed due to error: " + error);
      sendVal("error");
      reject(error);
    });
  });
}

settingsStorage.onchange = evt => {
  console.log(evt.key);
  console.log(evt.newValue);
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