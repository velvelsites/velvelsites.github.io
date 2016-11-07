@Inject('$location', '$state', 'AuthService','UserService','SiteService')
class ToolbarCtrl {
    constructor() {
        AuthService.registerUserUpdateCallback(() => {
            this.currentUser = AuthService.currentUser;
        });
    }
    login() {
    }
    logout() {
        this.AuthService.logout();
        this.$state.go('login');
    }
    go(tab) {
        this.current = tab;
        this.toggle = !this.toggle; 
        this.$state.go(tab, this.$state.params);
    }
}
angular.module('velvel-app').component('toolbar', {
    template: require('./toolbar.html'),
    bindings: {
        toggle: '='
    },
    controller: ToolbarCtrl
});