'use strict';

(function () {

  // var isMapActive = false;
  var address = document.querySelector('#address');
  var pinMain = document.querySelector('.map__pin--main');

  var showAddress = function (el) {
    address.value = el.offsetLeft + ', ' + el.offsetTop;
  };

  var initiateMap = function () {
    window.lib.isMapActive = true;
    window.lib.map.classList.remove('map--faded');
    window.lib.form.classList.remove('ad-form--disabled');
    showAddress(pinMain);
    window.renderPins(window.data);
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

  // Обработчик mousedown на pinMain
  var onPinMainMousedown = function (evt) {
    evt.preventDefault();

    // Обработчик mousmove на document
    var onDocumentMousemove = function (moveEvt) {
      moveEvt.preventDefault();

      var coord = {
        x: pinMain.offsetLeft + moveEvt.movementX,
        y: pinMain.offsetTop + moveEvt.movementY
      };

      if (coord.x < window.lib.LOCATION.X.MIN) {
        coord.x = window.lib.LOCATION.X.MIN;
      } else if (coord.x > window.lib.LOCATION.X.MAX) {
        coord.x = window.lib.LOCATION.X.MAX;
      }

      if (coord.y < window.lib.LOCATION.Y.MIN) {
        coord.y = window.lib.LOCATION.Y.MIN;
      } else if (coord.y > window.lib.LOCATION.Y.MAX) {
        coord.y = window.lib.LOCATION.Y.MAX;
      }

      pinMain.style.top = coord.y + 'px';
      pinMain.style.left = coord.x + 'px';
      showAddress(pinMain);
    };

    // Обработчик mouseup на document
    var onDocumentMouseup = function (upEvt) {
      upEvt.preventDefault();
      if (!window.lib.isMapActive) {
        initiateMap();
      }
      document.removeEventListener('mousemove', onDocumentMousemove);
      document.removeEventListener('mouseup', onDocumentMouseup);
    };

    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
  };

  window.lib.map.addEventListener('click', onMapClick);
  pinMain.addEventListener('mousedown', onPinMainMousedown);

})();
