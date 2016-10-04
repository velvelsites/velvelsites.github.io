@Inject('MainService', 'SiteService', 'UserService','AuthService')
class SiteCtrl {
    constructor() {
        // this.getSites();
        this.getUsers();
        AuthService.registerUserUpdateCallback(() => {
            this.currentUser = AuthService.currentUser;
            if (this.currentUser && this.currentUser._id) {
                if (this.currentUser.role._id == '57d27d4313d468481b1fe12e') {// if is admin TODO
                    this.SiteService.getSites().then((res) => {
                        this.userSites = res.data;
                    });
                }
                else {
                    this.getUserSites();
                }
            }
        });
        this.updateUser();
    }
    updateUser() {
        this.currentUser = this.AuthService.currentUser
        if (this.currentUser && this.currentUser._id) {
            if (this.currentUser.role._id == '57d27d4313d468481b1fe12e') {// if is admin TODO
                this.SiteService.getSites().then((res) => {
                    this.userSites = res.data;
                });
            }
            else {
                this.UserService.getUserSites(this.currentUser._id).then((res) => {
                    this.userSites = res.data;
                });
            }
        }
    }
    addSite(isValid) {
        if (isValid) {
            this.SiteService.addSite(this.site).then((response) => {
                this.getSites();
            });
        }
    }
    getUserSites() {
        this.UserService.getUserSites(this.currentUser._id).then((res) => {
            this.userSites = res.data;
        });
    }
    getSites() {
        this.SiteService.getSites().then((response) => {
            console.log('Site-component');
            this.sites = response.data;
        }, (error) => {
            console.log('Error retriving Sites');
        });
    }
    updateSite(site) {
        this.SiteService.updateSite(site)
            .then((res) => {
                this.editDisabled[site._id] = false;
            });

    }
    deleteSite(siteId) {
        this.SiteService.deleteSite(siteId)
            .then((res) => {
                this.getSites();
            });
    }
    getSiteUsers(siteId) {
        this.SiteService.getSiteUsers(siteId).then(
            (res) => {
                this.siteUsers = res.data;
            }
        ).catch((err) => {
        });
    }
    getUsers() {
        this.UserService.getUsers().then((response) => {
            console.log('User-component');
            this.users = response.data;
        }, (error) => {
            console.log('Error retriving Users');
        });
    }
    addUserToSite() {
        if (this.selectedUser && this.selectedSite)
            this.SiteService.addUserToSite(this.selectedSite._id, this.selectedUser._id).then((res) => {
                this.getSiteUsers(this.selectedSite._id);
            });
    }
    removeUserFromSite(userId, siteId) {
        this.SiteService.removeUserFromSite(userId, siteId).then((res) => {
            this.getSiteUsers(siteId);
        });
    }
}
angular.module('velvel-app').component('site', {
    template: require('./site.html'),
    bindings: {
    },
    controller: SiteCtrl
});