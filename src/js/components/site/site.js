@Inject('MainService', 'SiteService', 'UserService','AuthService')
class SiteCtrl {
    constructor() {
        this.SiteService.registerUserUpdateCallback(() => {
            this.initSites();
        });
        this.initSites();
        this.initUsers();
    }
    initSites(){
        if(this.SiteService.userSites.length){
            this.userSites = this.SiteService.userSites;
            this.selectedSite = this.userSites[0];
        } else{
            this.getSites();
        }
    }
    initUsers(){
        if(this.UserService.users.length){
            this.users = this.UserService.users;
            this.selectedUser = this.users[0];
        } else{
            this.getUsers();
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
        alert('אין מחיקת אתרים כרגע')
        return
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
            if(this.users[0]){
                this.selectedUser = this.users[0];   
            }
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