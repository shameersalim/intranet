var app = angular.module('sbAdminApp');
app.factory('SharedService', function($rootScope) {
    var sharedService = {};

    sharedService.eventData = '';

  sharedService.broadcastEvent = function(eventName, data) {
        this.eventData = data;
        $rootScope.$broadcast(eventName);
    };

    return sharedService;
});
