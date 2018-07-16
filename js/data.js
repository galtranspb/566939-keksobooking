'use strict';

(function () {

  // var NUMBER_OF_ADS = 8;
  // var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  //   'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  //   'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  // var PRICE = {
  //   MIN: 1000,
  //   MAX: 1000000
  // };
  // var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  // var ROOMS = {
  //   MIN: 1,
  //   MAX: 5
  // };
  // var GUESTS = {
  //   MIN: 1,
  //   MAX: 5
  // };
  // var CHECKIN = ['12:00', '13:00', '14:00'];
  // var CHECKOUT = ['12:00', '13:00', '14:00'];
  // var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  // var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  //   'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  //   'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  // var MAP_PIN = {
  //   WIDTH: 40,
  //   HEIGHT: 40
  // };

  // // Возвращает случайное целое число из диапозона min и max;
  // var getRandomIntByRange = function (min, max) {
  //   return Math.floor(Math.random() * (max + 1 - min) + min);
  // };

  // // Возвращает случайный элемент массива. Выборка берётся из входящего массива arr.
  // var getRandomArrayItem = function (arr) {
  //   return arr[getRandomIntByRange(0, arr.length - 1)];
  // };

  // // Используется в методе сортировки массива в случайном порядке - arr.sort(fn);
  // // Принимает два элемента массива. Возвращает значение от -0.5 до 0.5 (не включительно).
  // var getRandomOrder = function (_a, _b) {
  //   return Math.random() - 0.5;
  // };

  // // Принимает массив. Возвращает копию массива произвольно длины от 0 до arr.length.
  // var getArrOfRandomLenght = function (arr) {
  //   return arr.slice(0, getRandomIntByRange(0, arr.length));
  // };

  // // Принимает мин и макс число. Возвращает случайное число от мин до макс, округлённое до 100.
  // var getRoundingPriceToOneHundred = function (minNumber, maxNumber) {
  //   return (getRandomIntByRange(minNumber, maxNumber) / 100).toFixed(0) * 100;
  // };

  // // Возварщает массив из объектов. Принимает количество объектов.
  // var getArrayOfObject = function (numberOfObject) {
  //   var array = [];
  //   for (var i = 0; i < numberOfObject; i++) {
  //     var x = getRandomIntByRange(window.lib.LOCATION.X.MIN, window.lib.LOCATION.X.MAX) + MAP_PIN.WIDTH / 2;
  //     var y = getRandomIntByRange(window.lib.LOCATION.Y.MIN, window.lib.LOCATION.Y.MAX) + MAP_PIN.HEIGHT;
  //     array.push({
  //       author: {
  //         avatar: 'img/avatars/user0' + (i + 1) + '.png'
  //       },
  //       offer: {
  //         title: getRandomArrayItem(TITLE),
  //         address: x + ', ' + y,
  //         price: getRoundingPriceToOneHundred(PRICE.MIN, PRICE.MAX),
  //         type: getRandomArrayItem(TYPE),
  //         rooms: getRandomIntByRange(ROOMS.MIN, ROOMS.MAX),
  //         guests: getRandomIntByRange(GUESTS.MIN, GUESTS.MAX),
  //         checkin: getRandomArrayItem(CHECKIN),
  //         checkout: getRandomArrayItem(CHECKOUT),
  //         features: getArrOfRandomLenght(FEATURES),
  //         description: '',
  //         photos: PHOTOS.slice().sort(getRandomOrder)
  //       },
  //       location: {
  //         x: x,
  //         y: y
  //       }
  //     });
  //   }
  //   return array;
  // };

  // window.data = getArrayOfObject(NUMBER_OF_ADS);

  window.data = [];
  var onSuccessLoad = function (ads) {
    window.data = ads;
  };

  var onErrorLoad = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onSuccessLoad, onErrorLoad);

})();
