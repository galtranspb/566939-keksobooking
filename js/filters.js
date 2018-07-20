'use strict';

(function () {

  var originalData = [];
  var filterForm = document.querySelector('.map__filters');

  var housingTypeFilter = function (obj) {
    var housingType = document.querySelector('#housing-type');

    return (obj.offer.type === housingType.value) || (housingType.value === 'any');
  };

  var housingPriceFilter = function (obj) {
    var housingPrice = document.querySelector('#housing-price');

    switch (housingPrice.value) {
      case 'any': return true;
      case 'low': return obj.offer.price < 10000;
      case 'middle': return obj.offer.price >= 10000 && obj.offer.price < 50000;
      case 'high':
      default: return obj.offer.price >= 50000;
    }
  };

  var housingRoomsFilter = function (obj) {
    var housingRooms = document.querySelector('#housing-rooms');

    return (obj.offer.rooms === +housingRooms.value) || (housingRooms.value === 'any');
  };

  var housingGuestsFilter = function (obj) {
    var housingGuests = document.querySelector('#housing-guests');

    return (obj.offer.guests === +housingGuests.value) || (housingGuests.value === 'any');
  };

  var find = function (arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return true;
      }
    }
    return false;
  };

  var checkboxFilter = function (obj) {
    var dataArr = obj.offer.features;
    var filterArr = document.querySelectorAll('.map__features [name="features"]');
    for (var i = 0; i < filterArr.length; i++) {
      if (filterArr[i].checked && find(dataArr, filterArr[i].value)) {
        return true;
      }
    }
    return false;
  };

  var combinedFilter = function (obj) {
    return housingTypeFilter(obj) && housingPriceFilter(obj) && housingRoomsFilter(obj) && housingGuestsFilter(obj) && checkboxFilter(obj);
  };

  var onSuccessLoad = function (data) {
    originalData = data;
    window.filteredData = originalData.filter(combinedFilter);
  };

  var onFilterChange = function () {
    window.filteredData = originalData.filter(combinedFilter);
    window.lib.deleteElements();
    window.renderPins(window.filteredData);
    window.renderAds(window.filteredData);
  };

  window.backend.load(onSuccessLoad, window.lib.onError);
  filterForm.addEventListener('change', onFilterChange);

})();
