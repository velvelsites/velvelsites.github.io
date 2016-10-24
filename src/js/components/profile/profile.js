@Inject('$http', 'AuthService', 'UserService', '$scope', 'SiteService')
class ProfileCtrl {
    constructor() {
        AuthService.registerUserUpdateCallback(() => {
            this.currentUser = AuthService.currentUser;
        });
    }
}
angular.module('velvel-app').component('profile', {
    template: require('./profile.html'),
    bindings: {
    },
    controller: ProfileCtrl
});