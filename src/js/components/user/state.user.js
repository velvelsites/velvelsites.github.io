angular.module('velvel-app').config(function($stateProvider){
    $stateProvider.state('user', {
        url:'/user',
        template : '<user></user>',
        params:{
            filterData: null,
        }
    });
});