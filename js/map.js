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
// var MAP_PIN_WIDTH = 40;
// var MAP_PIN_HEIGHT = 40;

var template = document.querySelector('template').content;
var map = document.querySelector('.map');
var pinList = document.querySelector('.map__pins');
var templatePin = template.querySelector('.map__pin');
var templateAd = template.querySelector('.map__card');
var nextSibling = document.querySelector('.map__filters-container');

// Возвращает случайное целое число из диапозона min и max;
var getRandomIntByRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

// Возвращает случайный элемент массива. Выборка берётся из входящего массива arr.
var getRandomArrayItem = function (arr) {
  return arr[getRandomIntByRange(0, arr.length)];
};

// Возварщает массив из объектов. Принимает количество объектов.
var getArreyOfObject = function (numberOfObject) {
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
        features: getRandomArrayItem(FEATURES),
        description: '',
        photos: getRandomArrayItem(PHOTOS)
      },
      location: {
        x: getRandomIntByRange(LOCATION_X_MIN, LOCATION_X_MAX),
        y: getRandomIntByRange(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    });
  }
  return array;
};

// Принимает массив объектов-объявлений ads.
// Создает копию разметки маркера из шаблона TemplatePin. Определяет положение маркера, адрес изображения и текстовое
//  содержимое альтернативного изображения в соответсвии со свойствами объекта, входящего в массив ads.
var renderPopupPin = function (ads) {
  var popupPin = templatePin.cloneNode(true);

  popupPin.style = 'left: ' + ads.location.x + 'px; top: ' + ads.location.y + 'px;';
  popupPin.querySelector('img').src = ads.author.avatar;
  popupPin.querySelector('img').alt = ads.offer.title;

  return popupPin;
};

// Принимает массив объектов-объявлений ads.
// Создает копию разметки объявления из шаблона TemplateAd. Определяет содержимое выбранных элементов в соответсвии со
// свойствами объекта, входящего в массив ads.
var renderAd = function (ads) {
  var popupAd = templateAd.cloneNode(true);

  popupAd.querySelector('.popup__title').textContent = ads.offer.title;
  popupAd.querySelector('.popup__text--address').textContent = ads.offer.address;
  popupAd.querySelector('.popup__text--price').textContent = ads.offer.price;
  popupAd.querySelector('.popup__type').textContent = ads.offer.type;
  popupAd.querySelector('.popup__text--capacity').textContent = ads.offer.rooms + ' для' + ads.offer.guests;
  popupAd.querySelector('.popup__text--time').textContent =
  'заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
  popupAd.querySelector('.popup__features').textContent = ads.offer.features;
  popupAd.querySelector('.popup__photos').textContent = ads.offer.photos;

  return popupAd;
};

// Отрисовывает сгенерированные DOM-элементы в блок .map-pins.
var createPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPopupPin(ads[i]));
  }
  pinList.appendChild(fragment);
};

// Отрисовывает сгенерированные DOM-элементы в блок .map(map) перед блоком .map__filters-cintainer(nextSibling).
var createAds = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderAd(ads[i]));
  }
  map.insertBefore(fragment, nextSibling);
};

// Функция корректировки острия маркера. Нужна ли она?

var ads = getArreyOfObject(NUMBER_OF_ADS);
createPins();
createAds();

if (map.classList.contains('map--faded')) {
  map.classList.remove('map--faded');
}
