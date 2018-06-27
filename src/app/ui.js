import document from 'document';
import { me as device } from "device";

export default class UI {
  _mainMenu;
  _locationButton;
  _favouriteButton;
  _loadingGroup;
  _loadingText;
  _panoramaGroup;
  _panoramaview;
  _metarTitle;
  _hiddenMetarTitle;
  _metarTitleView;
  _metarTitleScroll;
  _metarInfo;
  _hiddenMetarInfo;
  _metarInfoView;
  _metarInfoScroll;
  _metarTranslate;
  _hiddenMetarTranslate;
  _metarTranslateView;
  _metarTranslateScroll;
  _metarRemarks;
  _hiddenMetarRemarks;
  _metarRemarksView;
  _metarRemarksScroll;

  constructor() {
    this._mainMenu = document.getElementById('main-menu');
    this._locationButton = document.getElementById('location');
    this._favouriteButton = document.getElementById('favourite');
    this._loadingGroup = document.getElementById('loading');
    this._loadingText = document.getElementById('loading-text');
    this._panoramaGroup = document.getElementById('panoramaview');
    this._panoramaGroup.style.display = 'none';
    this._panoramaview = document.getElementById('panoramaview');
    this._metarTitle = document.getElementById('metar-title');
    this._hiddenMetarTitle = document.getElementById('hidden-metar-title');
    this._metarTitleView = document.getElementById('view-1');
    this._metarTitleScroll = document.getElementById('scrollview-1');
    this._metarInfo = document.getElementById('metar-info');
    this._hiddenMetarInfo = document.getElementById('hidden-metar-info');
    this._metarInfoView = document.getElementById('view-2');
    this._metarInfoScroll = document.getElementById('scrollview-2');
    this._metarTranslate = document.getElementById('metar-translate');
    this._hiddenMetarTranslate = document.getElementById('hidden-metar-translate');
    this._metarTranslateView = document.getElementById('view-3');
    this._metarTranslateScroll = document.getElementById('scrollview-3');
    this._metarRemarks = document.getElementById('metar-remarks');
    this._hiddenMetarRemarks = document.getElementById('hidden-metar-remarks');
    this._metarRemarksView = document.getElementById('view-4');
    this._metarRemarksScroll = document.getElementById('scrollview-4');
  }
  
  showMainMenu() {
    this._panoramaGroup.style.display = 'none';
    this._panoramaview.value = 0;
    this._loadingGroup.style.display = 'none';
    this._mainMenu.style.display = 'inline';
  }
  
  showLoadingScreen() {
    this._mainMenu.style.display = 'none';
    this._panoramaGroup.style.display = 'none';
    this._loadingGroup.style.display = 'inline';
  }
  
  showScrollview() {
    this._mainMenu.style.display = 'none';
    this._loadingGroup.style.display = 'none';
    this._panoramaGroup.style.display = 'inline';
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
  
  get loadingScreen() {
    return this._loadingGroup;
  }
  
  get loadingText() {
    return this._loadingText
  }
  
  get scrollviewScreen() {
    return this._panoramaGroup;
  }
  
  get metarTitle() {
    return this._metarTitle;
  }
  
  setMetarTitleText(text) {
    this._hiddenMetarTitle.style.textLength = text.length;
    this._hiddenMetarTitle.text = text;
    
    this._metarTitle.style.textLength = text.length;
    this._metarTitle.text = text;
    // Add 5px of padding to top and bottom, subtracting for pagination
    let offset = device.modelName == 'Versa' ? 255 : device.screen.height - 45;
    this._metarTitle.height = Math.max(this._hiddenMetarTitle.height + 10, offset);
    
    // Account for the pagination dots
    this._metarTitleScroll.height = this._metarTitle.height + 30;
    this._hiddenMetarTitle.text = '';
  }
  
  get metarInfo() {
    return this._metarInfo;
  }
  
  setMetarInfoText(text) {
    this._hiddenMetarInfo.style.textLength = text.length;
    this._hiddenMetarInfo.text = text;
    
    this._metarInfo.style.textLength = text.length;
    this._metarInfo.text = text;
    // Add 10px of padding to top and bottom
    this._metarInfo.height = this._hiddenMetarInfo.height + 20;
    
    // Account for the pagination dots
    this._metarInfoScroll.height = this._metarInfo.height + 30;
    this._hiddenMetarInfo.text = '';
  }
  
  get metarTranslate() {
    return this._metarTranslate;
  }
  
  setMetarTranslateText(text) {
    this._hiddenMetarTranslate.style.textLength = text.length;
    this._hiddenMetarTranslate.text = text;

    
    this._metarTranslate.style.textLength = text.length;
    this._metarTranslate.text = text;
    this._metarTranslate.height = this._hiddenMetarTranslate.height + 20;
    
    this._metarTranslateScroll.height = this._metarTranslate.height + 30;
    this._hiddenMetarTranslate.text = '';
  }

  get metarRemarks() {
    return this._metarRemarks;
  }
  
  setMetarRemarksText(text) {
    this._hiddenMetarRemarks.style.textLength = text.length;
    this._hiddenMetarRemarks.text = text;

    
    this._metarRemarks.style.textLength = text.length;
    this._metarRemarks.text = text;
    this._metarRemarks.height = this._hiddenMetarRemarks.height + 20;
    
    this._metarRemarksScroll.height = this._metarRemarks.height + 30;
    this._hiddenMetarRemarks.text = '';
  }
}