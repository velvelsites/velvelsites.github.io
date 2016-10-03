angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('home', {
        url:'/home',
        template : '<home></home>',
        params:{
            filterData: null,
        }
    });
});