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

var Price = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

// *****************************************Определения функций****************************************

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

// Принимает мин и макс число. Возвращает случайное число от мин до макс, округлённое до 100.
var getRoundingPriceToOneHundred = function (minNumber, maxNumber) {
  return (getRandomIntByRange(minNumber, maxNumber) / 100).toFixed(0) * 100;
};

// Возварщает массив из объектов. Принимает количество объектов.
var getArrayOfObject = function (numberOfObject) {
  var array = [];
  for (var i = 0; i < numberOfObject; i++) {
    var x = getRandomIntByRange(LOCATION_X_MIN, LOCATION_X_MAX) + MAP_PIN_WIDTH / 2;
    var y = getRandomIntByRange(LOCATION_Y_MIN, LOCATION_Y_MAX) + MAP_PIN_HEIGHT;
    array.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomArrayItem(TITLE),
        address: x + ', ' + y,
        price: getRoundingPriceToOneHundred(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayItem(TYPE),
        rooms: getRandomIntByRange(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomIntByRange(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayItem(CHECKIN),
        checkout: getRandomArrayItem(CHECKOUT),
        features: getArrOfRandomLenght(FEATURES),
        description: '',
        photos: PHOTOS.slice().sort(getRandomOrder)
      },
      location: {
        x: x,
        y: y
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

// Получает строку. Возвращает строку на русском, соответствующее входящей строке на английском.
var getTranslatedType = function (string) {
  switch (string) {
    case 'palace': return 'Дворец';
    case 'flat': return 'Квартира';
    case 'house': return 'Дом';
    case 'bungalo': return 'Бунгало';
    default: return string;
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
  popupAd.querySelector('.popup__type').textContent = getTranslatedType(obj.offer.type);
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
  for (var j = 0; j < adButtonClose.length; j++) {
    if (adButtonClose[j] === evt.target) {
      hideAd(j);
    }
  }
};

// Принимает значение. Устанавливает полю формы "Цена за ночь" минимальную цену и плейсхолдер.цена жилья
var setMinPrice = function (value) {
  form.price.min = value;
  form.price.placeholder = value;
};

// Устанавливает полю формы "Цена за ночь" минимальную цену и плейсходер, в зависимости от выбранного поля "Тип жилья"
var onTypeChange = function () {
  var value = form.type.value;
  switch (value) {
    case 'bungalo': return setMinPrice(Price.bungalo);
    case 'flat': return setMinPrice(Price.flat);
    case 'house': return setMinPrice(Price.house);
    case 'palace': return setMinPrice(Price.palace);
    default: return setMinPrice(Price.flat);
  }
};

// Синхронизирует поля кол-во комнат и кол-во гостей по соответсвующим правилам.
var onRoomsChange = function () {
  var rooms = form.rooms.value;
  var capacity = form.capacity.value;
  var errorMessage = '';
  switch (rooms) {
    case '1':
      if (capacity !== '1') {
        errorMessage = 'Для 1 комнаты соответсвует 1 гость';
      }
      break;
    case '2':
      if (capacity === '3' || capacity === '0') {
        errorMessage = 'Для 2 комнат соответсвуют 1 или 2 гостя';
      }
      break;
    case '3':
      if (capacity === '0') {
        errorMessage = 'Для 3 комнат соответствуют 1, 2 или 3 гостя';
      }
      break;
    case '100':
      if (capacity !== '0') {
        errorMessage = 'Для 100 комнат соответствует опция "не для гостей"';
      }
      break;
    default:
      errorMessage = '';
  }
  form.capacity.setCustomValidity(errorMessage);
  if (errorMessage) {
    return false;
  }
  return true;
};

// Если у элемента ошибка валидации, то подсвечивает элемент тенью
var showInvalidFields = function () {
  for (var i = 0; i < form.elements.length; i++) {
    if (form.elements[i].validity.valid === false) {
      form.elements[i].style.webkitBoxShadow = '0 0 2px 2px #000';
      form.elements[i].style.boxShadow = '0 0 2px 2px #000';
    } else {
      form.elements[i].style.webkitBoxShadow = '';
      form.elements[i].style.boxShadow = '';
    }
  }
};

// Отменяет отправку формы. Вешает обработчики 'change' на поля кол-во комнат и мест и, если onRoomsChange возвращет true, то
// отправляет форму, иначе - показывает поля с ошибками.
var onFormSubmit = function (evt) {
  evt.preventDefault();
  form.rooms.addEventListener('change', onRoomsChange);
  form.capacity.addEventListener('change', onRoomsChange);
  if (onRoomsChange()) {
    form.submit();
  } else {
    showInvalidFields();
  }
};

// ************************************задание 5*****************************************

// Обработчик mousedown на pinMain
var onPinMainMousedown = function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Обработчик mousmove на document
  var onDocumentMousemove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: 0,
      y: 0
    };

    if (moveEvt.pageX < 80 || moveEvt.pageX > 1200) {
      document.removeEventListener('mousemove', onDocumentMousemove);
    } else {
      shift.x = startCoords.x - moveEvt.clientX;
    }

    if (moveEvt.pageY < 130 || moveEvt.pageY > 630) {
      document.removeEventListener('mousemove', onDocumentMousemove);
    } else {
      shift.y = startCoords.y - moveEvt.clientY;
    }

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
    pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
    showAddress(moveEvt);
  };

  // Обработчик mouseup на document
  var onDocumentMouseup = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onDocumentMousemove);
    document.removeEventListener('mouseup', onDocumentMouseup);
  };

  document.addEventListener('mousemove', onDocumentMousemove);
  document.addEventListener('mouseup', onDocumentMouseup);
};

// *******************************Вызов функций***************************************

var ads = getArrayOfObject(NUMBER_OF_ADS);
createAds(ads);

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

map.addEventListener('click', onMapClick);

form.type.addEventListener('change', onTypeChange);

form.price.addEventListener('input', onTypeChange);

form.timein.addEventListener('change', function () {
  form.timeout.value = form.timein.value;
});

form.timeout.addEventListener('change', function () {
  form.timein.value = form.timeout.value;
});

form.addEventListener('submit', onFormSubmit);

pinMain.addEventListener('mousedown', onPinMainMousedown);
