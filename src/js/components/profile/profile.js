@Inject('$http', 'AuthService', 'UserService', '$scope', 'SiteService')
class ProfileCtrl {
    constructor() {
        AuthService.registerUserUpdateCallback(() => {
            this.currentUser = AuthService.currentUser;
            if (this.currentUser && this.currentUser._id) {
                if (this.currentUser.role._id == '57d27d4313d468481b1fe12e') {// if is admin TODO
                    this.SiteService.getSites().then((res)=>{
                        this.userSites = res.data;
                    });
                }
                else{
                    this.UserService.getUserSites(this.currentUser._id).then((res) => {
                        this.userSites = res.data;
                    });
                }
            }
        });
        this.updateUser();
    }
    updateUser() {
        this.currentUser = this.AuthService.currentUser
        if (this.currentUser && this.currentUser._id) {
                if (this.currentUser.role._id == '57d27d4313d468481b1fe12e') {// if is admin TODO
                    this.SiteService.getSites().then((res)=>{
                        this.userSites = res.data;
                    });
                }
                else{
                    this.UserService.getUserSites(this.currentUser._id).then((res) => {
                        this.userSites = res.data;
                    });
                }
            }
    }
}
angular.module('velvel-app').component('profile', {
    template: require('./profile.html'),
    bindings: {
    },
    controller: ProfileCtrl
});