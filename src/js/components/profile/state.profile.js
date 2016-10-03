angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('profile', {
        url:'/profile',
        template : '<profile></profile>',
        params:{
            filterData: null,
        }
    });
});