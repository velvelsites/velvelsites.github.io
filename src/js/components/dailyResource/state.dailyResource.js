angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('dailyResources', {
        url:'/dailyResources',
        template : '<daily-resources></daily-resources>',
        params:{
            filterData: null,
        }
    });
});