'use strict';

(function () {

  var templatePin = window.lib.template.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');


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

  // Отрисовывает сгенерированные DOM-элементы в блок .map-pins.
  window.createPins = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(renderPopupPin(arr[i]));
    }
    pinList.appendChild(fragment);
  };

})();
