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
var address = document.getElementById('address');


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
//  содержимое альтернативного изображения в соответсвии со свойствами объекта, входящего в массив ads.
var renderPopupPin = function (ads) {
  var popupPin = templatePin.cloneNode(true);
  popupPin.style = 'left: ' + ads.location.x + 'px; top: ' + ads.location.y + 'px;';
  popupPin.querySelector('img').src = ads.author.avatar;
  popupPin.querySelector('img').alt = ads.offer.title;
  return popupPin;
};

// Принимает число. Склоняет существительное комната по числу комнат.
var getDeclensionOfaRoom = function (number) {
  if (number === 1) {
    return ' комната для ';
  } else if (number === 5) {
    return ' комнат для ';
  }
  return ' комнаты для ';
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
  for (i = 0; i < arr.length; i++) {
    var item = makeElement('li', 'popup__feature');
    item.classList.add('popup__feature--' + arr[i]);
    obj.appendChild(item);
  }
};

// Принимает массив объектов-объявлений ads.
// Создает копию разметки объявления из шаблона TemplateAd. Определяет содержимое выбранных элементов в соответсвии со
// свойствами объекта, входящего в массив ads.
var renderAd = function (ads) {
  var popupAd = templateAd.cloneNode(true);
  var features = template.querySelector('.popup__features');
  popupAd.querySelector('.popup__avatar').src = ads.author.avatar;
  popupAd.querySelector('.popup__title').textContent = ads.offer.title;
  popupAd.querySelector('.popup__text--address').textContent = ads.offer.address;
  popupAd.querySelector('.popup__text--price').textContent = ads.offer.price + 'Р/ночь';
  popupAd.querySelector('.popup__type').textContent = ads.offer.type;
  popupAd.querySelector('.popup__text--capacity').textContent = ads.offer.rooms + getDeclensionOfaRoom(ads.offer.rooms) +
  ads.offer.guests + getDeclensionOfaGuests(ads.offer.guests);
  popupAd.querySelector('.popup__text--time').textContent =
  'заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
  features = createNewChildren(features, ads.offer.features);
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

var ads = getArreyOfObject(NUMBER_OF_ADS);
createPins();
createAds();


// 4 задание.

// Активирует карту, при перетаскивании метки и добавляет координаты метки в поле адреса.
pinMain.addEventListener('mouseup', function (evt) {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  }
  if (form.classList.contains('ad-form--disabled')) {
    form.classList.remove('ad-form--disabled');
  }
  address.value = evt.clientX + ' ' + evt.clientY;
});


var pinButtonList = map.querySelectorAll('.map__pin:not(.map__pin--main)');
var adList = map.querySelectorAll('.popup');
var adButtonClose = map.querySelectorAll('.popup__close');


// скрыл все объявления.
for (var i = 0; i < adList.length; i++) {
  adList[i].style = 'display: none;';
}

// Принимает индекс. Скрывает все объявления и показывет объявление с входящим индексом.
var showAd = function (index) {
  for (i = 0; i < adList.length; i++) {
    adList[i].style = 'display: none;';
  }
  adList[index].style = 'display: block;';
};

// Принимет индекс. Скрывает объявление с входящим индексом.
var hideAd = function (index) {
  adList[index].style = 'display: none;';
};

// Принимает событие-event
// Если клик по маркеру, то показывает объявление с индексом, соотв. индексу маркера, по к-му был клик.
// Если клик по кнопке закрыть, то закрывает объявление с индексом, соотв. индексу кнопке-закрыть.
var onMapClick = function (evt) {
  for (i = 0; i < pinButtonList.length; i++) {
    if (pinButtonList[i] === evt.target) {
      showAd(i);
    }
  }
  for (i = 0; i < adButtonClose.length; i++) {
    if (adButtonClose[i] === evt.target) {
      hideAd(i);
    }
  }
};

// Обработчик клика по карте.
map.addEventListener('click', onMapClick);


// Принимает массив и элемент-target
// Возвращает элемент массива, если он соответсвует элементу-target
// var getClickedElement = function (arr, target) {
//   for(var i = 0; i < arr.length; i++) {
//     if (arr[i] === target) {
//       return arr[i];
//     }
//   }
// };

// var onMapClick = function (evt) {
//   switch (evt.target) {
//     case кнопка из pinButtonList: 'показать соответвующее окно из adList';
//       break;
//     case кнопка из adButtonClose: 'закрыть соотв окно adList'
//       break;
//   }
// };

// var onMapClick = function (evt) {

//   switch (evt.target) {
//     case getClickedElement(pinButtonList, evt.target): showAd();
//       break;
//     case getClickedElement(adButtonClose, evt.target): hideAd();
//       break;
//   }
// };
