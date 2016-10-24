@Inject('$location', '$state', 'AuthService','UserService','SiteService')
class ToolbarCtrl {
    constructor() {
        AuthService.registerUserUpdateCallback(() => {
            this.currentUser = AuthService.currentUser;
            // if (this.currentUser && this.currentUser._id) {
            //     this.SiteService.getUserSites(this.currentUser._id);
            // }
        });
    }
    login() {
    }
    logout() {
        this.AuthService.logout();
        this.$state.go('login');
    }
    go(tab) {
        this.$state.go(tab, this.$state.params);
    }
}
angular.module('velvel-app').component('toolbar', {
    template: require('./toolbar.html'),
    bindings: {
    },
    controller: ToolbarCtrl
});