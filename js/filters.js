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

  // var checkboxFilter = function (obj) {
  //   var checkbox = document.querySelector('#housing-features');
  //   var dataArr = obj.offer.features;
  //   var boolean = false;
  //   for (var i = 0; i < checkbox.elements.length; i++) {
  //     if (checkbox.elements[i].checked) {
  //       boolean = true;
  //       if (dataArr.indexOf(checkbox.elements[i].value)) {
  //         boolean *= true;
  //       } else {
  //         boolean *= false;
  //       }
  //     }
  //   }
  //   return boolean;
  // };

  var wifiFilter = function (obj) {
    var wifi = document.querySelector('#filter-wifi');
    if (wifi.checked && obj.offer.features.indexOf('wifi')) {
      return true;
    } else {
      return false;
    }
  };

  var combinedFilter = function (obj) {
    return housingTypeFilter(obj) && housingPriceFilter(obj) && housingRoomsFilter(obj) && housingGuestsFilter(obj) && wifiFilter(obj);
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
