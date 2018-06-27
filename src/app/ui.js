import document from 'document';

export default class UI {
  _mainMenu;
  _locationButton;
  _favouriteButton;
  _loading;
  _loadingText;
  _pomodoroText;
  _scrollview;
  _metarTitle;
  _metarInfo;
  _hiddenMetarInfo;
  _metarInfoSection;
  _metarTranslate;
  _hiddenMetarTranslate;
  _metarTranslateSection;

  constructor() {
    this._mainMenu = document.getElementById('main-menu');
    this._locationButton = document.getElementById('location');
    this._favouriteButton = document.getElementById('favourite');
    this._loading = document.getElementById('loading');
    this._loadingText = document.getElementById('loading-text');
    this._scrollview = document.getElementById('scrollview');
    this._metarTitle = document.getElementById('metar-title');
    this._metarInfo = document.getElementById('metar-info');
    this._hiddenMetarInfo = document.getElementById('hidden-metar-info');
    this._metarInfoSection = document.getElementById('section-2');
    this._metarTranslate = document.getElementById('metar-translate');
    this._hiddenMetarTranslate = document.getElementById('hidden-metar-translate');
    this._metarTranslateSection = document.getElementById('section-3');
  }
  
  showMainMenu() {
    this._scrollview.style.display = 'none';
    this._loading.style.display = 'none';
    this._mainMenu.style.display = 'inline';
  }
  
  showLoadingScreen() {
    this._mainMenu.style.display = 'none';
    this._scrollview.style.display = 'none';
    this._loading.style.display = 'inline';
  }
  
  showScrollview() {
    this._mainMenu.style.display = 'none';
    this._loading.style.display = 'none';
    this._scrollview.style.display = 'inline';
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
    return this._loading;
  }
  
  get loadingText() {
    return this._loadingText
  }
  
  get scrollviewScreen() {
    return this._scrollview;
  }
  
  get metarTitle() {
    return this._metarTitle;
  }
  
  get metarInfo() {
    return this._metarInfo;
  }
  
  setMetarInfoText(text) {
    this._hiddenMetarInfo.style.textLength = text.length;
    this._hiddenMetarInfo.text = text;
    
    // console.log(this._hiddenMetarInfo.height);
    
    this._metarInfo.style.textLength = text.length;
    this._metarInfo.text = text;
    this._metarInfo.height = this._hiddenMetarInfo.height + 50;
    this._metarInfo.y = 30;
    
    this._metarInfoSection.height = this._metarInfo.height + 30;
    // console.log(this._metarInfoSection.height);
  }
  
  get metarTranslate() {
    return this._metarTranslate;
  }
  
  setMetarTranslateText(text) {
    this._hiddenMetarTranslate.style.textLength = text.length;
    this._hiddenMetarTranslate.text = text;

    // console.log(this._hiddenMetarTranslate.height);
    
    this._metarTranslate.style.textLength = text.length;
    this._metarTranslate.text = text;
    this._metarTranslate.height = this._hiddenMetarTranslate.height + 50;
    this._metarTranslate.y = 30;
    
    this._metarTranslateSection.height = this._metarTranslate.height + 30;
    // console.log(this._metarTranslateSection.height);
  }
}