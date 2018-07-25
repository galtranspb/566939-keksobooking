'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var Price = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var success = document.querySelector('.success');

  // Принимает значение. Устанавливает полю формы "Цена за ночь" минимальную цену и плейсхолдер.цена жилья
  var setMinPrice = function (value) {
    window.lib.form.price.min = value;
    window.lib.form.price.placeholder = value;
  };

  // Устанавливает полю формы "Цена за ночь" минимальную цену и плейсходер, в зависимости от выбранного поля "Тип жилья"
  var onTypeChange = function () {
    var value = window.lib.form.type.value;
    return setMinPrice(Price[value]);
  };

  // Синхронизирует поля кол-во комнат и кол-во гостей по соответсвующим правилам.
  var onRoomsChange = function () {
    var rooms = window.lib.form.rooms.value;
    var capacity = window.lib.form.capacity.value;
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
    window.lib.form.capacity.setCustomValidity(errorMessage);
    if (errorMessage) {
      return false;
    }
    return true;
  };

  // кэлбэк на успешную отправку формы. Переводит карту и форму в неактивное состояние.
  var onSuccessSave = function () {
    window.lib.isMapActive = false;
    window.pinMain.map.classList.add('map--faded');
    window.lib.form.classList.add('ad-form--disabled');
    window.lib.form.reset();
  };

  // Обработчик нажатия клавиши ESC.
  var onSuccessEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      success.classList.add('hidden');
      success.removeEventListener('click', onSuccessClick);
      window.removeEventListener('keydown', onSuccessEscPress);
    }
  };

  // Обработчик события клик на элементе success.
  var onSuccessClick = function () {
    success.classList.add('hidden');
    success.removeEventListener('click', onSuccessClick);
    window.removeEventListener('keydown', onSuccessEscPress);
  };

  // Показывает сообщение об успешной отправке формы
  var showSuccessMessage = function () {
    success.classList.remove('hidden');
    success.addEventListener('click', onSuccessClick);
    window.addEventListener('keydown', onSuccessEscPress);
  };

  // Отменяет отправку формы. Вешает обработчики 'change' на поля кол-во комнат и мест и, если onRoomsChange возвращет true, то
  // отправляет форму, иначе - показывает поля с ошибками.
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.lib.form), onSuccessSave, window.lib.onError);
    window.lib.deleteElements();
    showSuccessMessage();
    window.pinMain.centeredPinMain();
  };

  window.lib.form.type.addEventListener('change', onTypeChange);
  window.lib.form.price.addEventListener('input', onTypeChange);

  window.lib.form.rooms.addEventListener('change', onRoomsChange);
  window.lib.form.capacity.addEventListener('change', onRoomsChange);

  window.lib.form.timein.addEventListener('change', function () {
    window.lib.form.timeout.value = window.lib.form.timein.value;
  });

  window.lib.form.timeout.addEventListener('change', function () {
    window.lib.form.timein.value = window.lib.form.timeout.value;
  });

  window.lib.form.addEventListener('submit', onFormSubmit);

})();
