
class MainComponentCtrl {
    constructor() {
        console.log('main-component');
    }

}
angular.module('velvel-app').component('mainComponent', {
    template: require('./mainComponent.html'),
    bindings: {
    },
    controller: MainComponentCtrl
});