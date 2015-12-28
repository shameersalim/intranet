'use strict';

angular.module('sbAdminApp')
  .factory('EmployeeDirectoryService', EmployeeDirectoryService)
  .controller('EmployeeDirectoryController', EmployeeDirectoryController);

EmployeeDirectoryService.$inject = ["$log", "$http"];

function EmployeeDirectoryService($log, $http) {
  function getAllEmployees(username, token) {
    $log.log("EmployeeDirectoryService: getAllEmployees() invoked");
    return $http.get('/api/employees', {
        username: username
      })
      .then(function(response) {
        if (typeof response.data === 'object') {
          $log.log("EmployeeDirectoryService: getAllEmployees() success");
          return response;
        } else {
          // invalid response
          $log.log("EmployeeDirectoryService: getAllEmployees() success");
          return $q.reject(response);
        }

      }, function(response) {
        // something went wrong
        $log.log("EmployeeDirectoryService: Error in connecting to server" + error);
        return $q.reject(response);
      });
  }

  var employee;
  function getEmployee() {
    return this.employee;
  }

  function setEmployee(emp) {
    this.employee = emp;
  }

  return {
    getAllEmployees: getAllEmployees,
    getEmployee : getEmployee,
    setEmployee : setEmployee
  };
}


EmployeeDirectoryController.$inject = ["$rootScope", "$scope", "$log", "$state", "AppEvents", "EmployeeDirectoryService"];

function EmployeeDirectoryController($rootScope, $scope, $log, $state, AppEvents, EmployeeDirectoryService) {
  $scope.employeeList = [];
  $scope.selectedRow = -1;
  $scope.loggedInUser = $rootScope.globals.user;

  $scope.addEmployee = function() {
      EmployeeDirectoryService.setEmployee({});
    $state.go('dashboard.employeeactions', {action : 'new'});
  };

  $scope.editEmployee = function(rowIndex) {
    var selectedEmployee = $scope.employeeList[rowIndex];
    if(selectedEmployee == null || selectedEmployee == undefined) {
      return;
    }
    EmployeeDirectoryService.setEmployee(selectedEmployee);
    $state.go('dashboard.employeeactions', {action : 'edit'});
  };

  $scope.viewEmployeeDetails = function(rowIndex) {
    var selectedEmployee = $scope.employeeList[rowIndex];
    if(selectedEmployee == null || selectedEmployee == undefined) {
      return;
    }
    EmployeeDirectoryService.setEmployee(selectedEmployee);
    $state.go('dashboard.employeeactions', {action : 'view'});
  };

  $scope.deleteEmployee = function(rowIndex) {
    var selectedEmployee = $scope.employeeList[rowIndex];
    if(selectedEmployee == null || selectedEmployee == undefined) {
      return;
    }
    EmployeeDirectoryService.setEmployee(selectedEmployee);
    $state.go('dashboard.employeeactions', {action : 'delete'});
  };

  // $scope.$on(AppEvents.EMPLOYEE_DIRECTORY_RELOAD_LIST, function() {
  //   getAllEmployees();
  // });

  $scope.rowClickHandler = function(index){
		$scope.selectedRow = index;
	}

  var getAllEmployees = function() {
    $log.log("EmployeeDirectoryController: getAllEmployees() invoked");
    EmployeeDirectoryService.getAllEmployees($rootScope.globals.user.username, $rootScope.globals.token)
      .then(function(response) {
        $log.log('EmployeeDirectoryController: getAllEmployees() successful');
        if(response && typeof response.data === 'object' && response.status == 200) {
          $scope.employeeList = response.data;
        }
      }, function(error) {
        $log.log('EmployeeDirectoryController: getAllEmployees() error');
      })
  }


    getAllEmployees();


}
