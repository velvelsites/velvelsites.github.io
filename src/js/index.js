import "babel-polyfill";
import angular from 'angular';
import $ from 'expose?jQuery!expose?$!jquery';
import "angular-ui-bootstrap";
import "angular-ui-router";
import "angular-sanitize";
import "angular-storage";
import "angular-ladda";
import "angular-material";
require('../styles/main.scss');
require('../styles/sidebar.scss');
// require('../styles/animate.min.scss');
angular.module('velvel-app', ['ngSanitize', 'angular-storage', 'ui.bootstrap', 'ngMaterial', 'ui.router', 'angular-ladda']).config(function($urlRouterProvider){
    $urlRouterProvider.otherwise("/profile");
});;
 
var files = require.context('./', true, /\.js$/);
files.keys().forEach(files);
