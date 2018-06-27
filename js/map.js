'use strict';

var NUMBER_OF_ADS = 8;
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 5;
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var MAP_PIN_WIDTH = 40;
var MAP_PIN_HEIGHT = 40;

var map = document.querySelector('.map');
var pinList = document.querySelector('.map__pins');
var template = document.querySelector('template').content;
var templatePin = template.querySelector('.map__pin');
var templateAd = template.querySelector('.map__card');
var nextSibling = document.querySelector('.map__filters-container');
var form = document.querySelector('.ad-form');
var pinMain = document.querySelector('.map__pin--main');
var address = document.querySelector('#address');

// var pinButtonList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
// var adList = document.querySelectorAll('.popup');
// var adButtonClose = document.querySelectorAll('.popup__close');


// Возвращает случайное целое число из диапозона min и max;
var getRandomIntByRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

// Возвращает случайный элемент массива. Выборка берётся из входящего массива arr.
var getRandomArrayItem = function (arr) {
  return arr[getRandomIntByRange(0, arr.length - 1)];
};

// Используется в методе сортировки массива в случайном порядке - arr.sort(fn);
// Принимает два элемента массива. Возвращает значение от -0.5 до 0.5 (не включительно).
var getRandomOrder = function (_a, _b) {
  return Math.random() - 0.5;
};

// Принимает массив. Возвращает копию массива произвольно длины от 0 до arr.length.
var getArrOfRandomLenght = function (arr) {
  return arr.slice(0, getRandomIntByRange(0, arr.length));
};

// Возварщает массив из объектов. Принимает количество объектов.
var getArrayOfObject = function (numberOfObject) {
  var array = [];
  for (var i = 0; i < numberOfObject; i++) {
    array.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomArrayItem(TITLE),
        address: 'location.x location.y',
        price: getRandomIntByRange(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayItem(TYPE),
        rooms: getRandomIntByRange(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomIntByRange(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayItem(CHECKIN),
        checkout: getRandomArrayItem(CHECKOUT),
        features: getArrOfRandomLenght(FEATURES),
        description: '',
        photos: PHOTOS.sort(getRandomOrder)
      },
      location: {
        x: getRandomIntByRange(LOCATION_X_MIN, LOCATION_X_MAX) + MAP_PIN_WIDTH / 2,
        y: getRandomIntByRange(LOCATION_Y_MIN, LOCATION_Y_MAX) + MAP_PIN_HEIGHT
      }
    });
  }
  return array;
};

// Принимает массив объектов-объявлений ads.
// Создает копию разметки маркера из шаблона TemplatePin. Определяет положение маркера, адрес изображения и текстовое
//  содержимое альтернативного изображения в соответсвии со свойствами объекта.
var renderPopupPin = function (obj) {
  var popupPin = templatePin.cloneNode(true);
  popupPin.style = 'left: ' + obj.location.x + 'px; top: ' + obj.location.y + 'px;';
  popupPin.querySelector('img').src = obj.author.avatar;
  popupPin.querySelector('img').alt = obj.offer.title;
  return popupPin;
};

// Принимает число. Склоняет существительное комната по числу комнат.
var getDeclensionOfaRoom = function (number) {
  switch (number) {
    case 1: return ' комната для ';
    case 5: return ' комнат для ';
    default: return ' комнаты для ';
  }
};

// Принимает число. Склоняет существительное гость по числу гостей.
var getDeclensionOfaGuests = function (number) {
  return (number === 1) ? ' гостя' : ' гостей';
};

// Принимает объект.
// Удаляет все дочерние элементы объекта.
var deleteChildren = function (obj) {
  while (obj.firstChild) {
    obj.removeChild(obj.firstChild);
  }
};

// Принимает имя тега, класса и сождержимое текста.
// Возвращает элемент с тегом tagName, классом className и текстом text(если есть).
var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

// Принимает объект и массив.
// Удаляет дочерние элементы объекта и создает новые дочерние объекты, с классами из массива arr.
var createNewChildren = function (obj, arr) {
  deleteChildren(obj);
  for (var i = 0; i < arr.length; i++) {
    var item = makeElement('li', 'popup__feature');
    item.classList.add('popup__feature--' + arr[i]);
    obj.appendChild(item);
  }
};

// Принимает объект и массив. Удаляет все дочерние элементы объекта. Клонирует новые элементы из шаблона, в количестве
// равном длине массива. Назначает свойство src i-му элементу объекта, равное значению i-го элемента массива.
var copyNewChildren = function (obj, arr) {
  deleteChildren(obj);
  for (var i = 0; i < arr.length; i++) {
    var element = templateAd.querySelector('.popup__photo').cloneNode();
    element.src = arr[i];
    obj.appendChild(element);
  }
};

// Принимает массив объектов-объявлений ads.
// Создает копию разметки объявления из шаблона TemplateAd. Определяет содержимое выбранных элементов, в соответсвии со
// свойствами объекта.
var renderAd = function (obj) {
  var popupAd = templateAd.cloneNode(true);
  popupAd.style = 'display: none;';
  popupAd.querySelector('.popup__avatar').src = obj.author.avatar;
  popupAd.querySelector('.popup__title').textContent = obj.offer.title;
  popupAd.querySelector('.popup__text--address').textContent = obj.offer.address;
  popupAd.querySelector('.popup__text--price').textContent = obj.offer.price + 'Р/ночь';
  popupAd.querySelector('.popup__type').textContent = obj.offer.type;
  popupAd.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + getDeclensionOfaRoom(obj.offer.rooms) +
  obj.offer.guests + getDeclensionOfaGuests(obj.offer.guests);
  popupAd.querySelector('.popup__text--time').textContent =
  'заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  createNewChildren(popupAd.querySelector('.popup__features'), obj.offer.features);
  copyNewChildren(popupAd.querySelector('.popup__photos'), obj.offer.photos);
  return popupAd;
};

// Отрисовывает сгенерированные DOM-элементы в блок .map-pins.
var createPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderPopupPin(arr[i]));
  }
  pinList.appendChild(fragment);
};

// Отрисовывает сгенерированные DOM-элементы в блок .map(map) перед блоком .map__filters-cintainer(nextSibling).
var createAds = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderAd(arr[i]));
  }
  map.insertBefore(fragment, nextSibling);
};

// Передаёт в свойство value элемента address координаты курсора мыши.
var showAddress = function (evt) {
  address.value = evt.clientX + ', ' + evt.clientY;
};

// Если у элемента map содержится класс map--faded, то удаляет этот класс.
var activateMap = function () {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  }
};

// Если у элемента form содержится класс ad-form--disabled, то убирает этот класс.
var activateForm = function () {
  if (form.classList.contains('ad-form--disabled')) {
    form.classList.remove('ad-form--disabled');
  }
};

// Принимает индекс. Скрывает все объявления и показывет объявление с входящим индексом.
var showAd = function (index) {
  var adList = document.querySelectorAll('.popup');
  for (var i = 0; i < adList.length; i++) {
    adList[i].style = 'display: none;';
  }
  adList[index].style = 'display: block;';
};

// Принимет индекс. Скрывает объявление с входящим индексом.
var hideAd = function (index) {
  var adList = document.querySelectorAll('.popup');
  adList[index].style = 'display: none;';
};

// Принимает событие-event
// Если клик по маркеру, то показывает объявление с индексом, соотв. индексу маркера, по к-му был клик.
// Если клик по кнопке закрыть, то закрывает объявление с индексом, соотв. индексу кнопке-закрыть.
var onMapClick = function (evt) {
  var pinImageList = document.querySelectorAll('.map__pin:not(.map__pin--main) img');
  var adButtonClose = document.querySelectorAll('.popup__close');
  for (var i = 0; i < pinImageList.length; i++) {
    if (pinImageList[i] === evt.target) {
      showAd(i);
    }
  }
  for (i = 0; i < adButtonClose.length; i++) {
    if (adButtonClose[i] === evt.target) {
      hideAd(i);
    }
  }
};

var ads = getArrayOfObject(NUMBER_OF_ADS);
createAds(ads);

// Активирует карту, при перетаскивании метки и добавляет координаты метки в поле адреса.
pinMain.addEventListener('mouseup', function (evt) {
  activateMap();
  activateForm();
  showAddress(evt);
  createPins(ads);
});

pinMain.removeEventListener('mouseup', function (evt) {
  activateMap();
  activateForm();
  showAddress(evt);
  createPins(ads);
});

// Обработчик клика по карте.
map.addEventListener('click', onMapClick);
