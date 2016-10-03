angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('site', {
        url:'/site',
        template : '<site></site>'
    });
});