
class HomeCtrl {
    constructor() {
        console.log('home-component');
    }

}
angular.module('velvel-app').component('home', {
    template: require('./home.html'),
    bindings: {
    },
    controller: HomeCtrl
});