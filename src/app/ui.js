import document from 'document';
import { me as device } from "device";

export default class UI {
  _mainMenu;
  _locationButton;
  _favouriteButton;

  _infoTile;
  _infoTileText;
  _stationList;
  _stationTiles;
  _touchTiles;

  _loadingGroup;
  _loadingText;

  _panoramaView;

  _metarTitle;
  _hiddenMetarTitle;
  _metarTitleView;
  _metarTitleScroll;

  _hiddenTextarea;

  _metarInfo;
  _metarInfoView;
  _metarInfoList;

  _metarTranslate;
  _metarTranslateView;
  _metarTranslateList;

  _metarRemarks;
  _metarRemarksView;
  _metarRemarksScroll;

  _accentColour = 'deepskyblue';

  constructor() {
    this._mainMenu = document.getElementById('main-menu');
    this._locationButton = document.getElementById('location');
    this._favouriteButton = document.getElementById('favourite');

    this._infoTile = document.getElementById('info-tile');
    this._infoTileText = this._infoTile.getElementById('info-tile-text');
    this._stationList = document.getElementById('station-list');
    this._stationTiles = [];
    for (let i = 0; i < 5; i++) {
      const tile = document.getElementById(`station-${i}`);
      if (tile === undefined) break;
      this._stationTiles[i] = tile;
    }
    this._touchTiles = document.getElementsByClassName('touch-tile');

    this._loadingGroup = document.getElementById('loading');
    this._loadingText = document.getElementById('loading-text');

    this._panoramaView = document.getElementById('panoramaview');
    this._panoramaView.style.display = 'none';


    this._metarTitle = document.getElementById('metar-title');
    this._hiddenMetarTitle = document.getElementById('hidden-metar-title');
    this._metarTitleView = document.getElementById('view-1');
    this._metarTitleScroll = document.getElementById('scrollview-1');

    this._hiddenTextarea = document.getElementById('hidden-textarea');

    this._metarInfo = document.getElementById('metar-info');
    this._metarInfoView = document.getElementById('view-2');
    this._metarInfoList = document.getElementById('virtual-list-2');

    this._metarTranslate = document.getElementById('metar-translate');
    this._metarTranslateView = document.getElementById('view-3');
    this._metarTranslateList = document.getElementById('virtual-list-3');

    this._metarRemarks = document.getElementById('metar-remarks');
    this._metarRemarksView = document.getElementById('view-4');
    this._metarRemarksScroll = document.getElementById('virtual-list-4');
  }
  
  showMainMenu(state) {
    this._loadingGroup.style.display = 'none';
    this._mainMenu.style.display = 'inline';
    switch (state) {
      case 'complete':
        this._stationList.style.display = 'none';
        this._panoramaView.animate('disable');
        setTimeout(() => {
          this._panoramaView.style.display = 'none';
          this._panoramaView.value = 0;
        }, 200);
        break;
      case 'list':
        this._panoramaView.style.display = 'none';
        this._stationList.animate('disable');
        setTimeout(() => {
          this._stationList.style.display = 'none';
        }, 200);
        break;
    }
  }
  
  showStationList(stations) {
    this._mainMenu.style.display = 'none';
    this._panoramaView.style.display = 'none';
    this._loadingGroup.style.display = 'none';
    
    this._stationTiles.forEach((tile, i) => {
      const station = stations[i];
      if (station) {
        tile.style.display = 'inline';
        tile.getElementById('station-text').text = stations[i];
        switch (true) {
          case /[CKMSTckmpst]/.test(stations[i].charAt(0)):
            tile.getElementById('station-flag-1').style.display = 'inline';
            tile.getElementById('station-flag-2').style.display = 'none';
            tile.getElementById('station-flag-3').style.display = 'none';
            break;
          case /[BDEFGHLObdefghlo]/.test(stations[i].charAt(0)):
            tile.getElementById('station-flag-1').style.display = 'none';
            tile.getElementById('station-flag-2').style.display = 'inline';
            tile.getElementById('station-flag-3').style.display = 'none';
            break;
          case /[ANPRUVWYZanpruvwyz]/.test(stations[i].charAt(0)):
            tile.getElementById('station-flag-1').style.display = 'none';
            tile.getElementById('station-flag-2').style.display = 'none';
            tile.getElementById('station-flag-3').style.display = 'inline';
            break;
        }
      } else {
        tile.style.display = 'none';
      }
    });
    
    this._stationList.style.display = 'inline';

    if (stations.length < 5) {
      this._infoTileText.text = 'Add up to five favourites on your phone.';
      this._infoTileText.style.fontSize = 25;
    } else {
      this._infoTileText.text = 'Favourite Stations';
      this._infoTileText.style.fontSize = 32;
    }
    
    this._stationList.animate('enable');
    
  }
  
  showLoadingScreen() {
    this._mainMenu.style.display = 'none';
    this._panoramaView.style.display = 'none';
    this._stationList.style.display = 'none';
    this._loadingGroup.style.display = 'inline';
    this._loadingGroup.animate('enable');
  }
  
  showScrollview() {
    this._mainMenu.style.display = 'none';
    this._loadingGroup.style.display = 'none';
    this._stationList.style.display = 'none';
    this._panoramaView.style.display = 'inline';
    
    this._panoramaView.animate('enable');
  }
  
  get mainMenu() {
    return this._mainMenu;
  }
  
  get locationButton() {
    return this._locationButton;
  }
  
  get favouriteButton() {
    return this._favouriteButton;
  }
  
  get tiles() {
    return this._stationTiles;
  }
  
  get loadingScreen() {
    return this._loadingGroup;
  }
  
  get loadingText() {
    return this._loadingText
  }
  
  get panoramaView() {
    return this._panoramaView;
  }
  
  get metarTitle() {
    return this._metarTitle;
  }
  
  setMetarTitleText(text) {
    this._hiddenMetarTitle.style.textLength = text.length;
    this._hiddenMetarTitle.text = text;
    
    this._metarTitle.style.textLength = text.length;
    this._metarTitle.text = text;
    // Add 5px of padding to top and bottom, subtracting for pagination dots
    let offset = device.modelName == 'Versa' ? 255 : device.screen.height - 45;
    this._metarTitle.height = Math.max(this._hiddenMetarTitle.height + 10, offset);
    
    this._metarTitle.style.fill = this._accentColour;
    
    // Account for the pagination dots
    this._metarTitleScroll.height = this._metarTitle.height + 30;
    this._hiddenMetarTitle.text = '';
  }
  
  get metarInfo() {
    return this._metarInfo;
  }
  
  setMetarInfoText(data) {
    let hiddenInfo = this._hiddenTextarea;
    let titleColour = this._accentColour;
    
    this._metarInfoList.delegate = {
      getTileInfo: index => {
        return {
          type: 'info-pool',
          title: data[index].title,
          text: data[index].text
        };
      },
      configureTile: (tile, info) => {
        if (info.type == 'info-pool') {
          let titleElement = tile.getElementById('virtual-title');
          titleElement.text = info.title;
          titleElement.style.fill = titleColour;

          let textElement = tile.getElementById('virtual-text');
          hiddenInfo.style.textLength = info.text.length;
          hiddenInfo.text = info.text;
          textElement.text = info.text == '' ? '---' : info.text;
          textElement.height = hiddenInfo.height;
          // 80 is default height of the tile, 15 is separation between two text elements, and 10 is spacing from the bottom of tile
          tile.height = Math.max(80, titleElement.height + 15 + textElement.height + 10);
          textElement.y = tile.height - textElement.height - 10;
        }
      }
    };

    // Length of the virtual tile list must be set after all tiles are configured
    this._metarInfoList.length = data.length;
  }
  
  get metarTranslate() {
    return this._metarTranslate;
  }
  
  setMetarTranslateText(data) {
    let hiddenTranslate = this._hiddenTextarea;
    let titleColour = this._accentColour;

    // Delegate for the virtual tile list consists of two functions:
    // getTileInfo should return an object containing the pool that item belongs to
    // configureTile then uses that object (here, passed in as 'info') and configures that tile
    this._metarTranslateList.delegate = {
      // Index represents the index of the tile in the virtual tile list
      // i.e. index = 5 means you should return data for the 6th tile
      getTileInfo: index => {
        // Type must match the pool ID in index.gui
        // Otherwise, can include any other data
        return {
          type: 'translate-pool',
          title: data[index].title,
          text: data[index].text
        };
      },
      configureTile: (tile, info) => {
        if (info.type == 'translate-pool') {
          let titleElement = tile.getElementById('virtual-title');
          titleElement.text = info.title;
          titleElement.style.fill = titleColour;

          let textElement = tile.getElementById('virtual-text');
          hiddenTranslate.style.textLength = info.text.length;
          hiddenTranslate.text = info.text;
          textElement.text = info.text == '' ? '---' : info.text;
          textElement.height = hiddenTranslate.height;
          // 80 is default height of the tile, 15 is separation between two text elements, and 10 is spacing from the bottom of tile
          tile.height = Math.max(80, titleElement.height + 15 + textElement.height + 10);
          textElement.y = tile.height - textElement.height - 10;
        }
      }
    };

    // Length of the virtual tile list must be set after all tiles are configured
    this._metarTranslateList.length = data.length;
  }

  get metarRemarks() {
    return this._metarRemarks;
  }
  
  setMetarRemarksText(data) {
    let hiddenRemarks = this._hiddenTextarea;
    let titleColour = this._accentColour;
    
    this._metarRemarksScroll.delegate = {
      getTileInfo: index => {
        return {
          type: 'remarks-pool',
          title: data[index].title,
          text: data[index].text
        };
      },
      configureTile: (tile, info) => {
        if (info.type == 'remarks-pool') {
          let titleElement = tile.getElementById('virtual-title');
          titleElement.text = info.title;
          titleElement.style.fill = titleColour;

          let textElement = tile.getElementById('virtual-text');
          hiddenRemarks.style.textLength = info.text.length;
          hiddenRemarks.text = info.text;
          textElement.text = info.text == '' ? '---' : info.text;
          textElement.height = hiddenRemarks.height;
          tile.height = Math.max(80, titleElement.height + 15 + textElement.height + 10);
          textElement.y = tile.height - textElement.height - 10;
        }
      }
    };

    // Length of the virtual tile list must be set after all tiles are configured
    this._metarRemarksScroll.length = data.length;
  }

  set accentColour(colour) {
    this._accentColour = colour;

    this._locationButton.style.fill = colour;
    this._infoTileText.style.fill = colour;

    switch (colour) {
      case 'aquamarine':
        this._favouriteButton.style.fill = 'mediumspringgreen';
        break;
      case 'deepskyblue':
        this._favouriteButton.style.fill = 'royalblue';
        break;
      case 'gold':
        this._favouriteButton.style.fill = 'orange';
        break;
      case 'plum':
        this._favouriteButton.style.fill = 'mediumorchid';
        break;
      case 'sandybrown':
        this._favouriteButton.style.fill = 'darksalmon';
        break;
      case 'tomato':
        this._favouriteButton.style.fill = 'crimson';
        break;
      case 'white':
        this._favouriteButton.style.fill = 'slategray';
        break;
    }
  }
}