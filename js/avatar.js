'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarChooser = document.querySelector('.ad-form-header__input');
  var preview = document.querySelector('.ad-form-header__preview img');
  var photoChooser = document.querySelector('.ad-form__input');
  var photoList = document.querySelector('.ad-form__photo-container');

  var makeElement = function (tagName, className) {
    var element = document.createElement(tagName);
    element.classList.add(className);
    return element;
  };

  var onAvatarLoad = function (evt) {
    preview.src = evt.target.result;
  };

  var onPhotoLoad = function (evt) {
    var item = makeElement('img', 'ad-form__photo');
    item.src = evt.target.result;
    photoList.appendChild(item);
  };

  var createReader = function (onLoad, file) {
    var reader = new FileReader();
    reader.addEventListener('load', onLoad);
    reader.readAsDataURL(file);
  };

  var onAvatarChange = function () {
    var files = avatarChooser.files;

    Array.from(files).forEach(function (el) {
      var fileName = el.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        createReader(onAvatarLoad, el);
      }
    });
  };

  var onPhotoChange = function () {
    var files = photoChooser.files;

    Array.from(files).forEach(function (el) {
      var fileName = el.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        createReader(onPhotoLoad, el);
      }
    });
  };

  photoList.removeChild(document.querySelector('div.ad-form__photo'));
  avatarChooser.addEventListener('change', onAvatarChange);
  photoChooser.addEventListener('change', onPhotoChange);

})();
