import moment from 'moment-timezone';
let DATE_FORMAT = 'yyyy-MM-dd';
@Inject('ResourceService', 'SiteService', '$scope', 'TypeService')
class DailyResourceCtrl {
    constructor() {
        this.dailyResource = {};
        this.resourceTypes = TypeService.resourceTypes;
        this.editDisabled = {};
        this.moment = moment;
        this.SiteService.registerUserUpdateCallback(() => {
            this.initSites();
        });
        this.TypeService.registerUserUpdateCallback(() => {
            this.initResources(); 
        });
        this.initSites();
        this.initResources(); 
        this.initDates();
    }
    initResources(){
        this.resourceTypes = this.TypeService.types;
        this.dailyResource.resourceType = this.resourceTypes[0];
    }
    initSites(){
        this.sites = this.SiteService.userSites;
        this.dailyResource.site = this.sites[0];
        this.getAllDailyResources();
    }
    getTypes() {
        this.TypeService.getTypes().then((response) => {
            this.resourceTypes = response.data;
            this.dailyResource.resourceType = this.resourceTypes[0];
        }, (error) => {
            console.log('Error retriving Types');
        });
    }
    initDates() {
        this.format = DATE_FORMAT;
        this.dailyResource.date = this.resourcesDate = new Date();
        this.popupsOpen = {
            addDate: false,
            resourcesDate: false
        };
        this.selectedDateOptions = {
            minDate: new Date(2013, 3, 25),
            maxDate: new Date(),
            showWeeks: false,
            dateFormat: DATE_FORMAT
        };
    }
    openDate(dateField) {
        this.popupsOpen[dateField] = !this.popupsOpen[dateField];
    }
    setSelectedResource($item) {
        this.dailyResource.resource = $item;
    }
    addType(isValid) {
        if (isValid) {
            this.addingType = true;
            this.TypeService.addType(this.type).then((response) => {
                this.getTypes();
                this.addingType = false;
            });
        }
    }
    addDefault() {
        this.loading = true;
        let dailyResource = Object.assign({}, this.dailyResource);
        dailyResource.date = this.formatDate(dailyResource.date);
        this.ResourceService.addDailyDefaultResources(dailyResource).then((response) => {
            this.getAllDailyResources();
            this.loading = false;
        });
    }
    addDailyResource(isValid) {
        if (isValid) {
            let dailyResource = Object.assign({}, this.dailyResource);
            dailyResource.date = this.formatDate(dailyResource.date);
            this.ResourceService.addDailyResource(dailyResource).then((response) => {
                this.getAllDailyResources();
            });
        }
    }
    editField(item) {
        if (this.editDisabled[item._id] === true) {
            this.updateDailyResource(item);
        }
        this.editDisabled[item._id] = !this.editDisabled[item._id];
    }
    updateDailyResource(resource) {
        this.ResourceService.updateDailyResource(resource)
            .then((res) => {
                this.editDisabled[resource._id] = false;
            });

    }
    formatDate(date) {
        return this.moment(date).format('YYYY-MM-DD');
    }
    findResourceLike(searchString) {
        let searchObject = {};
        searchObject.date = this.currentDate;
        searchObject.searchString = searchString;
        searchObject.currentSite = this.dailyResource.site;
        let results = this.ResourceService.findResourceLike(searchObject).then((res) => {
            return res.data;
        });
        console.log(results);
        return results;
    }
    deleteDailyResource(dailyResourceId) {
        this.ResourceService.deleteDailyResource(dailyResourceId)
            .then((res) => {
                this.getAllDailyResources();
            });
    }
    getAllDailyResources() {
        if(!this.sites || this.sites.length < 1){
            return;
        }
        let object = {};
        object.date = this.formatDate(this.dailyResource.date);
        object.sites = [];
        _.mapValues(this.sites, function(o){
            object.sites.push(o._id);
        });
        this.ResourceService.getAllDailyResources(object)
            .then((response) => {
                console.log('resource-component');
                this.resources = response.data;
                this.grouped = _.groupBy(this.resources, 'site._id');
                let dummy;
            }, (error) => {
                console.log('Error retriving resources');
            });
    }
    getDailyResources() {
        if (this.dailyResource.site) {
            let resourcesDate = this.dailyResource.date;
            resourcesDate = this.formatDate(resourcesDate);
            this.ResourceService.getAllDailyResources(resourcesDate, this.dailyResource.site._id)
                .then((response) => {
                    console.log('resource-component');
                    this.resources = response.data;
                    // this.grouped = _.groupBy(this.resources,'resourceType.name');
                    //    let dummy;
                }, (error) => {
                    console.log('Error retriving resources');
                });
        }
    }

}
angular.module('velvel-app').component('dailyResources', {
    template: require('./dailyResources.html'),
    bindings: {
    },
    controller: DailyResourceCtrl
});