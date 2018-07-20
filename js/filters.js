'use strict';

(function () {

  var NUMBER_OF_ADS = 5;
  var originalData = [];
  var Price = {
    lowerLimit: 10000,
    upperLimit: 50000
  };
  var filterForm = document.querySelector('.map__filters');

  var housingTypeFilter = function (obj) {
    var housingType = document.querySelector('#housing-type');

    return (obj.offer.type === housingType.value) || (housingType.value === 'any');
  };

  var housingPriceFilter = function (obj) {
    var housingPrice = document.querySelector('#housing-price');

    switch (housingPrice.value) {
      case 'any': return true;
      case 'low': return obj.offer.price < Price.lowerLimit;
      case 'middle': return obj.offer.price >= Price.lowerLimit && obj.offer.price < Price.upperLimit;
      case 'high':
      default: return obj.offer.price >= Price.upperLimit;
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
    var isAllFeaturesEmpty = Array.from(filterArr).every(function (item) {
      return !item.checked;
    });
    if (isAllFeaturesEmpty) {
      return true;
    }
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
    window.filteredData = originalData.filter(combinedFilter).slice(0, NUMBER_OF_ADS);
  };

  var onFilterChange = window.debounce(function () {
    window.filteredData = originalData.filter(combinedFilter).slice(0, NUMBER_OF_ADS);
    window.lib.deleteElements();
    window.renderPins(window.filteredData);
    window.renderAds(window.filteredData);
  });

  window.backend.load(onSuccessLoad, window.lib.onError);
  filterForm.addEventListener('change', onFilterChange);

})();
