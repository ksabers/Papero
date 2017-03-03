//papero-app.js

(function () {
    "use strict";

    angular.module("papero-app", ['treeControl', 'datatables', 'ui.select', 'ngSanitize'])

    .config(function (uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
    });

})();