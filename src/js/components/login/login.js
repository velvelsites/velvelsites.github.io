@Inject('$location', '$state', 'UserService', 'AuthService')
class LoginCtrl {
    constructor() {
        this.isAdmin = false;// auth.isadmin...
    }
    login() {
        this.AuthService.login(this.user).then((response) => {
            this.$state.go('profile');
        }).catch((err) => {
        });
    }
    logout() {
    }
    go(tab) {
        this.$state.go(tab, this.$state.params);
    }
}
angular.module('velvel-app').component('login', {
    template: require('./login.html'),
    bindings: {
    },
    controller: LoginCtrl
});