'use strict';

(function () {

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

    pins.forEach(function (el, i) {
      pinList.removeChild(el);
      window.pinMain.map.removeChild(popup[i]);
    });
  };

  window.lib = {
    isMapActive: false,
    template: document.querySelector('template').content,
    form: document.querySelector('.ad-form'),
    deleteElements: deleteElements,
    onError: onError
  };

})();
