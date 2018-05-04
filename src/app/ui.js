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
  _metarTranslate;

  constructor() {
  this._mainMenu = document.getElementById('main-menu');
  this._locationButton = document.getElementById('location');
  this._favouriteButton = document.getElementById('favourite');
  this._loading = document.getElementById('loading');
  this._loadingText = document.getElementById('loading-text');
  this._scrollview = document.getElementById('scrollview');
  this._metarTitle = document.getElementById('metar-title');
  this._metarInfo = document.getElementById('metar-info');
  this._metarTranslate = document.getElementById('metar-translate');
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
  
  get metarTranslate() {
    return this._metarTranslate;
  }
}