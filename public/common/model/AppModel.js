(function() {
  'use strict';
  angular.module('sbAdminApp')
    .constant('AppModel', {
      'APP_NAME': 'CLEAR MARKETS',
      'APP_VERSION': 0.1
    })
    .constant('APIConstants', {
      'AUTHENTICATE_URL': '/api/authenticate',
      'EMPLOYEE_DIRECTORY_URL': '/api/employees'
    })
    .constant("AppEvents", {
      'EMPLOYEE_DIRECTORY_RELOAD_LIST' : 'EMPLOYEE_DIRECTORY_RELOAD_LIST'
    })
    .constant("AppConstants", {
      "LOCATION_LIST" : [
        "Charlotte, NC", "New York", "London", "Japan"
      ]
    })
    ;

})();
