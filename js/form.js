'use strict';

(function () {

  var Price = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

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

  // Если у элемента ошибка валидации, то подсвечивает элемент тенью
  var showInvalidFields = function () {
    for (var i = 0; i < window.lib.form.elements.length; i++) {
      if (window.lib.form.elements[i].validity.valid === false) {
        window.lib.form.elements[i].style.webkitBoxShadow = '0 0 2px 2px #000';
        window.lib.form.elements[i].style.boxShadow = '0 0 2px 2px #000';
      } else {
        window.lib.form.elements[i].style.webkitBoxShadow = '';
        window.lib.form.elements[i].style.boxShadow = '';
      }
    }
  };

  // Отменяет отправку формы. Вешает обработчики 'change' на поля кол-во комнат и мест и, если onRoomsChange возвращет true, то
  // отправляет форму, иначе - показывает поля с ошибками.
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.lib.form.rooms.addEventListener('change', onRoomsChange);
    window.lib.form.capacity.addEventListener('change', onRoomsChange);
    if (onRoomsChange()) {
      window.lib.form.submit();
    } else {
      showInvalidFields();
    }
  };

  window.lib.form.type.addEventListener('change', onTypeChange);

  window.lib.form.price.addEventListener('input', onTypeChange);

  window.lib.form.timein.addEventListener('change', function () {
    window.lib.form.timeout.value = window.lib.form.timein.value;
  });

  window.lib.form.timeout.addEventListener('change', function () {
    window.lib.form.timein.value = window.lib.form.timeout.value;
  });

  window.lib.form.addEventListener('submit', onFormSubmit);

})();
