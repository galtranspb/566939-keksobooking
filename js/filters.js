'use strict';

(function () {

  var originalData = [];
  var housingType = document.querySelector('[name="housing-type"]');

  var deleteElements = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var pinList = document.querySelector('.map__pins');
    var popup = window.lib.map.querySelectorAll('.popup');

    for (var i = 0; i < pins.length; i++) {
      pinList.removeChild(pins[i]);
      window.lib.map.removeChild(popup[i]);
    }
  };

  var housingTypeFilter = function (obj) {
    return (obj.offer.type === housingType.value) || (housingType.value === 'any');
  };

  var onSuccessLoad = function (data) {
    originalData = data;
    window.filteredData = originalData.filter(housingTypeFilter);
  };

  var onFilterChange = function () {
    window.filteredData = originalData.filter(housingTypeFilter);
    deleteElements();
    window.renderPins(window.filteredData);
    window.renderAds(window.filteredData);
  };

  window.backend.load(onSuccessLoad, window.lib.onError);
  housingType.addEventListener('change', onFilterChange);

})();
