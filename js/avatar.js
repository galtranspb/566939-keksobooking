'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // ******************************загрузка аватарки******************************************

  var fileChooser = document.querySelector('.ad-form-header__input');
  var preview = document.querySelector('.ad-form-header__preview img');

  // var makeElement = function (tagName, className, text) {
  //   var element = document.createElement(tagName);
  //   element.classList.add(className);
  //   if (text) {
  //     element.textContent = text;
  //   }
  //   return element;
  // };

  var onFileChooserChange = function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (el) {
      return fileName.endsWith(el);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  fileChooser.addEventListener('change', onFileChooserChange);

  // *************************************закгрузка фото жилья********************************

  var fileChooser2 = document.querySelector('.ad-form__input');
  var previewList = document.querySelector('.ad-form__photo');

  var onFileChooserChange2 = function () {
    var fileList = fileChooser2.files;

    for (var i = 0; i < fileList.length; i++) {
      var fileName = fileList[i].name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        // var item = makeElement('img', 'ad-form__photo');
        var item = document.createElement('img');
        item.style = 'width: 70px; height: 70px;';
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          item.src = reader.result;
        });

        reader.readAsDataURL(fileList[i]);
        previewList.appendChild(item);
      }
    }
  };

  fileChooser2.addEventListener('change', onFileChooserChange2);

})();
