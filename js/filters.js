'use strict';

(function () {
  var housingType = document.querySelector('[name="housing-type"]');

  //  window.filters = function (obj) {
  //   return (obj.offer.type === housingType.value) || (housingType.value === 'any');
  // };

  var onFilterChange = function () {
    window.filters = function (obj) {
     return (obj.offer.type === housingType.value) || (housingType.value === 'any');
   };
 };

  housingType.addEventListener('change', onFilterChange);

})();
