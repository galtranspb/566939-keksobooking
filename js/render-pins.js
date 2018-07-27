'use strict';

(function () {

  var templatePin = window.lib.template.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');

  // Принимает объект объявлений ads.
  // Создает копию разметки маркера из шаблона TemplatePin. Определяет положение маркера, адрес изображения и текстовое
  //  содержимое альтернативного изображения в соответсвии со свойствами объекта.
  var getPopupPin = function (pin) {
    var popupPin = templatePin.cloneNode(true);
    popupPin.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
    popupPin.querySelector('img').src = pin.author.avatar;
    popupPin.querySelector('img').alt = pin.offer.title;
    return popupPin;
  };

  // Отрисовывает сгенерированные DOM-элементы в блок .map-pins.
  window.renderPins = function (arr) {
    var fragment = document.createDocumentFragment();
    arr.forEach(function (el) {
      fragment.appendChild(getPopupPin(el));
    });
    pinList.appendChild(fragment);
  };

})();
