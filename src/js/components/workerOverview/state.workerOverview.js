angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('workerOverview', {
        url:'/workerOverview',
        template : '<worker-overview></worker-overview>'
    });
});