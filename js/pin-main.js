'use strict';

(function () {

  var ESC_CODE = 27;
  var openedAdIndex;

  var address = document.querySelector('#address');
  var pinMain = document.querySelector('.map__pin--main');

  var LimitMovement = {
    x: {
      min: 0,
      max: 1135
    },
    y: {
      min: 130,
      max: 630
    }
  };

  var showAddress = function (el) {
    address.value = el.offsetLeft + ', ' + el.offsetTop;
  };

  var initiateMap = function () {
    window.lib.isMapActive = true;
    window.lib.map.classList.remove('map--faded');
    window.lib.form.classList.remove('ad-form--disabled');
    window.renderPins(window.filteredData);
    window.renderAds(window.filteredData);
    showAddress(pinMain);
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      hideAd(openedAdIndex);
    }
  };

  // Принимает индекс. Скрывает все объявления и показывет объявление с входящим индексом.
  var showAd = function (index) {
    openedAdIndex = index;
    document.addEventListener('keydown', onEscPress);
    var adList = document.querySelectorAll('.popup');

    adList.forEach(function (el) {
      el.style = 'display: none;';
    });
    adList[index].style = 'display: block;';
  };

  // Принимет индекс. Скрывает объявление с входящим индексом.
  var hideAd = function (index) {
    document.removeEventListener('keydown', onEscPress);
    var adList = document.querySelectorAll('.popup');
    adList[index].style = 'display: none;';
  };

  // Принимает событие-event
  // Если клик по маркеру, то показывает объявление с индексом, соотв. индексу маркера, по к-му был клик.
  // Если клик по кнопке закрыть, то закрывает объявление с индексом, соотв. индексу кнопке-закрыть.
  var onMapClick = function (evt) {
    var pinImageList = document.querySelectorAll('.map__pin:not(.map__pin--main) img');
    var adButtonClose = document.querySelectorAll('.popup__close');

    pinImageList.forEach(function (el, i) {
      if (el === evt.target) {
        showAd(i);
      }
    });
    adButtonClose.forEach(function (el, i) {
      if (el === evt.target) {
        hideAd(i);
      }
    });
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

      if (coord.x < LimitMovement.x.min) {
        coord.x = LimitMovement.x.min;
      } else if (coord.x > LimitMovement.x.max) {
        coord.x = LimitMovement.x.max;
      }

      if (coord.y < LimitMovement.y.min) {
        coord.y = LimitMovement.y.min;
      } else if (coord.y > LimitMovement.y.max) {
        coord.y = LimitMovement.y.max;
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
