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
require('../styles/simple-sidebar.scss');
require('../styles/pp.scss');
require('../styles/rtl.scss');
require('../styles/simple-sidebar-rtl.scss');
angular.module('velvel-app', ['ngSanitize', 'angular-storage', 'ui.bootstrap', 'ngMaterial', 'ui.router']);
 
var files = require.context('./', true, /\.js$/);
files.keys().forEach(files);
