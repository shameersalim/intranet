(function() {
'use strict';



angular.module('sbAdminApp')
  .factory('EmployeeActionsService', EmployeeActionsService)
  .controller('EmployeeActionsController', EmployeeActionsController);

EmployeeActionsService.$inject = ["$log", "$http", "$q"];

function EmployeeActionsService($log, $http, $q) {

  function deleteEmployee(employee, loggedInUser, token) {
      $log.log("EmployeeActionsService: deleteEmployee() invoked");

var data = {
  "employee" : employee,
  "user" : loggedInUser,
  "token" : token
};

      return $http.delete('/api/delete/employee', {
        'data' : data,
        "headers": {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(response) {
        if( typeof response.data === 'object') {
          $log.log("EmployeeActionsService: deleteEmployee() successful");
          return response;
        }
      },  function(response) {
        // something went wrong
        $log.log("EmployeeActionsService: Error in connecting to server" + response);
        return $q.reject(response);
      });
  }

  function addEmployee(employee, loggedInUser, token) {
    $log.log("EmployeeActionsService: addEmployee() invoked");

    return $http.post('/api/add/employee', {
      "employee" : employee,
      "user" : loggedInUser,
      "token" : token
    })
      .then(function(response) {
        if (typeof response.data === 'object') {
          $log.log("EmployeeActionsService: addEmployee() success");
          return response;
        } else {
          // invalid response
          $log.log("EmployeeActionsService: addEmployee() failed");
          return $q.reject(response);
        }

      }, function(response) {
        // something went wrong
        $log.log("EmployeeActionsService: Error in connecting to server" + response);
        return $q.reject(response);
      });
  }

  function editEmployee(employee, loggedInUser, token) {
    $log.log("EmployeeActionsService: editEmployee() invoked");

    return $http.post('/api/edit/employee', {
      "employee" : employee,
      "user" : loggedInUser,
      "token" : token
    })
      .then(function(response) {
        if (typeof response.data === 'object') {
          $log.log("EmployeeActionsService: editEmployee() success");
          return response;
        } else {
          // invalid response
          $log.log("EmployeeActionsService: editEmployee() failed");
          return $q.reject(response);
        }

      }, function(response) {
        // something went wrong
        $log.log("EmployeeActionsService: Error in connecting to server" + response);
        return $q.reject(response);
      });
  }

  return {
    addEmployee: addEmployee,
    editEmployee : editEmployee,
    deleteEmployee : deleteEmployee
  };
}


EmployeeActionsController.$inject = ["$rootScope", "$scope", "$log", "$state",
"EmployeeActionsService", "SharedService", "AppEvents", "EmployeeDirectoryService", "action",
"AppConstants"
];

function EmployeeActionsController($rootScope, $scope, $log, $state,
  EmployeeActionsService, SharedService, AppEvents, EmployeeDirectoryService, action,
  AppConstants
) {
  $scope.employee = EmployeeDirectoryService.getEmployee();
  var masterEmployee = angular.copy($scope.employee);
  $scope.loggedInUser = $rootScope.globals.user;
  $scope.isActionButtonEnabled = (action === 'new' || action === 'edit');
  $scope.isDeleteButtonEnabled = (action === 'delete');
  $scope.isViewOnly = (action === 'view');
  $scope.submitButtonLabel = "Save";
  $scope.locationList = AppConstants.LOCATION_LIST;

  $scope.title = '';
  if(action === 'new') {
    $scope.title = "Add Employee";
    $scope.subTitle = "Add a new Employee";
    $scope.submitButtonLabel = "Add Employee";
  } else if(action === 'edit') {
    $scope.title = "Edit Employee";
    $scope.subTitle = "Edit " + $scope.employee.firstName + " 's " + "Profile";
    $scope.submitButtonLabel = "Save";
  } else if(action === 'delete') {
    $scope.title = "Delete Employee";
    $scope.subTitle = "Are you sure you want to delete " + $scope.employee.firstName + " " + $scope.employee.lastName + "'s Profile ?";
  } else if(action === 'view') {
    $scope.title = "View Profile";
    $scope.subTitle = $scope.employee.firstName + " 's Profile";
  }

  $scope.saveEmployee = function() {
    $log.log("EmployeeActionsController: saveEmployee() invoked");

    if(action === 'new') {
      EmployeeActionsService.addEmployee(this.employee, $scope.globals.user, $scope.globals.token)
        .then(function(response) {
          $log.log('EmployeeActionsController: addEmployee() successful');
          if(response && typeof response.data === 'object' && response.status === 200) {
            toastr.success('Employee added successfully', 'Success');
            toastr.options.closeButton = true;
            SharedService.broadcastEvent(AppEvents.EMPLOYEE_DIRECTORY_RELOAD_LIST);
            $state.go('dashboard.employeedirectory');
          }
        }, function(error) {
          $log.log('EmployeeActionsController: addEmployee() error' + error);
        });
    } else if(action === 'edit') {
      EmployeeActionsService.editEmployee(this.employee, $scope.globals.user, $scope.globals.token)
        .then(function(response) {
          $log.log('EmployeeActionsController: editEmployee() successful');
          if(response && typeof response.data === 'object' && response.status === 200) {
            toastr.success('Employee edited successfully', 'Success');
            toastr.options.closeButton = true;
            SharedService.broadcastEvent(AppEvents.EMPLOYEE_DIRECTORY_RELOAD_LIST);
            $state.go('dashboard.employeedirectory');
          }
        }, function(error) {
          $log.log('EmployeeActionsController: addEmployee() error' + error);
        });
    }

  };

  $scope.deleteEmployee = function() {
    $log.log("EmployeeActionsController: delete employee() invoked");
    EmployeeActionsService.deleteEmployee(this.employee, $scope.globals.user, $scope.globals.token)
    .then(function(response) {
      $log.log("EmployeeActionsController : deleteEmployee() successful");
      if(response && typeof response.data === 'object' && response.status === 200) {
        toastr.success('Employee deleted successfully', 'Success');
        toastr.options.closeButton = true;
        SharedService.broadcastEvent(AppEvents.EMPLOYEE_DIRECTORY_RELOAD_LIST);
        $state.go('dashboard.employeedirectory');
      }
    }, function(error) {
      $log.log('EmployeeActionsController: deleteEmployee() error' + error);
    });
  };

  $scope.resetForm = function() {
    $scope.employee = angular.copy(masterEmployee);
    $scope.employeeForm.$setPristine();
  };

  $scope.back = function() {
    $state.go('dashboard.employeedirectory');
  };

}

}());
