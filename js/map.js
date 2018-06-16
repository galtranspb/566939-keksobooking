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


// Возвращает случайное целое число из диапозона min и max;
var getRandomIntByRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

// Возвращает случайный элемент массива. Выборка берётся из входящего массива arr.
var getRandomArrayItem = function (arr) {
  return arr[getRandomIntByRange(0, arr.length)];
};

// Возварщает массив из объектов. Принимает количество объектов.
var createArreyOfObject = function (numberOfObject) {
  var array = [];
  for (var i = 0; i < numberOfObject; i++) {
    array.push({
      'author': {
        'avatar': 'img/avatars/userxx.png'
      },
      'offer': {
        'title': getRandomArrayItem(TITLE),
        'address': 'location.x, location.y',
        'price': getRandomIntByRange(MIN_PRICE, MAX_PRICE),
        'type': getRandomArrayItem(TYPE),
        'rooms': getRandomIntByRange(MIN_ROOMS, MAX_ROOMS),
        'guests': getRandomIntByRange(MIN_GUESTS, MAX_GUESTS),
        'checkin': getRandomArrayItem(CHECKIN),
        'checkout': getRandomArrayItem(CHECKOUT),
        'features': getRandomArrayItem(FEATURES),
        'description': '',
        'photos': getRandomArrayItem(PHOTOS)
      },
      'location': {
        'x': getRandomIntByRange(LOCATION_X_MIN, LOCATION_X_MAX),
        'y': getRandomIntByRange(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    });
  }
  return array;
};

var ads = createArreyOfObject(NUMBER_OF_ADS);
