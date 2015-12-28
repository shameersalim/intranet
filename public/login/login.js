'use strict';

angular.module('sbAdminApp')
  .factory('LoginService', LoginService)
  .controller('LoginController', LoginController);

LoginService.$inject =  ["$q", "$log", "$http", "APIConstants"];

function LoginService($q, $log, $http, APIConstants) {
  function authenticate(username, password) {
    $log.log("LoginService: authenticate() invoked");
    return $http.post(APIConstants.AUTHENTICATE_URL, {
        username: username,
        password: password
      })
      .then(function(response) {
        if (typeof response.data === 'object') {
          $log.log("LoginService: Valid Credentials. Login successful");
          return response;
        } else {
          // invalid response
          $log.log("LoginService: Invalid Credentials. Please try again")
          return $q.reject(response);
        }

      }, function(response) {
        // something went wrong
        $log.log("LoginService: Error in connecting to server" + response);
        return $q.reject(response);
      });
  }

  return {
    authenticate: authenticate
  };
}


LoginController.$inject = ["$rootScope", "$scope", "$log", "$state", "LoginService"];

function LoginController($rootScope, $scope, $log, $state, LoginService) {
  $rootScope.globals = {};

  $scope.authenticate = function() {
    $log.log("LoginController: authenticate() invoked" + $scope.username);
    LoginService.authenticate($scope.username, $scope.password)
      .then(function(response) {
        $log.log('LoginController: authenticate() successful');
        if (typeof response.data === 'object' && response.status == 200) {
          $rootScope.globals.user = response.data.message;
          $rootScope.globals.token = response.data.token;
          $state.go('dashboard.home');
        }
      }, function(error) {
        $log.log('LoginController: authenticate() error' + error);
      })
  }
}
