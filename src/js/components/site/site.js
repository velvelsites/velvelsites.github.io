@Inject('MainService','SiteService','UserService')
class SiteCtrl {
    constructor() {
        this.getSites();
        this.getUsers();
    }
    addSite(isValid) {
        if (isValid) {
            this.SiteService.addSite(this.site).then((response)=>{
                this.getSites();
            });
        }
    }
    getSites() {
        this.SiteService.getSites().then((response) => {
            console.log('Site-component');
            this.sites = response.data;
        }, (error) => {
            console.log('Error retriving Sites');
        });
    }
    updateSite(site){
        this.SiteService.updateSite(site)
        .then((res)=>{
            this.editDisabled[site._id] = false;
        });
        
    }
    deleteSite(siteId){
        this.SiteService.deleteSite(siteId)
        .then((res)=>{
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
    addUserToSite(){
        if(this.selectedUser && this.selectedSite)
            this.SiteService.addUserToSite(this.selectedSite._id, this.selectedUser._id).then((res)=>{
                this.getSiteUsers(this.selectedSite._id);
            });
    }
    removeUserFromSite(userId, siteId){
        this.SiteService.removeUserFromSite(userId, siteId).then((res)=>{
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