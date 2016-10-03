angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('login', {
        url:'/login',
        template : '<login></login>',
        params:{
            filterData: null,
        }
    });
});