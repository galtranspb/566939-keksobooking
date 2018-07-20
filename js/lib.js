'use strict';

(function () {

  var map = document.querySelector('.map');

  // обработчик ошибок
  var onError = function (errorMessage) {
    var element = document.createElement('div');
    element.textContent = errorMessage;
    element.style = 'font-size: 30px; text-align: center; background-color: #ccc; color: red;';
    element.style.position = 'fixed';
    element.style.zIndex = '100';
    element.style.left = '50%';
    element.style.top = '50%';
    element.style.transform = 'translate(-50%, -50%)';
    element.style.padding = '10px 30px';
    element.style.borderRadius = '10px';
    document.body.appendChild(element);
  };

  // Удаляет все пины и объявления
  var deleteElements = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var pinList = document.querySelector('.map__pins');
    var popup = document.querySelectorAll('.popup');

    for (var i = 0; i < pins.length; i++) {
      pinList.removeChild(pins[i]);
      map.removeChild(popup[i]);
    }
  };

  window.lib = {
    isMapActive: false,
    NUMBER_OF_ADS: 5,

    LOCATION: {
      X: {
        MIN: 300,
        MAX: 900
      },
      Y: {
        MIN: 130,
        MAX: 630
      }
    },

    map: map,
    template: document.querySelector('template').content,
    form: document.querySelector('.ad-form'),
    deleteElements: deleteElements,
    onError: onError
  };

})();
