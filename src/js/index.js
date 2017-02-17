import "babel-polyfill";
import angular from 'angular';
// import $ from 'expose?jQuery!expose?$!jquery';
import "angular-ui-bootstrap";
import "angular-ui-router";
import "angular-sanitize";
import "angular-storage";
import "angular-ladda";
require('../styles/main.scss');
require('../styles/sidebar.scss');
// require('../styles/animate.min.scss');
angular.module('velvel-app', ['ngSanitize', 'angular-storage', 'ui.bootstrap', 'ui.router', 'angular-ladda']).config(function($urlRouterProvider){
    $urlRouterProvider.otherwise("/profile");
}).factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});;
 
var files = require.context('./', true, /\.js$/);
files.keys().forEach(files);
