angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('resource', {
        url:'/resource',
        template : '<resource></resource>',
        params:{
            filterData: null,
        }
    });
});