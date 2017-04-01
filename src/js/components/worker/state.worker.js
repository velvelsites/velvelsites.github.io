angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('worker', {
        url:'/worker',
        template : '<worker></worker>'
    });
});