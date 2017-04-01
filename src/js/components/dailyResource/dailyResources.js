import moment from 'moment-timezone';
let DATE_FORMAT = 'yyyy-MM-dd';
@Inject('ResourceService', 'SiteService', '$scope', 'TypeService','CommentService','AuthService','WorkerService','DailyWorkerService' , '$q')
class DailyResourceCtrl {
    constructor() {
        this.loading = true;
        this.dailyResource = {};
        this.dailyWorker = {};
        this.resourceTypes = TypeService.resourceTypes;
        this.editDisabled = {};
        this.moment = moment;
        this.SiteService.registerUserUpdateCallback(() => {
            this.initSites();
        });
        this.TypeService.registerUserUpdateCallback(() => {
            this.initResources();
        });
        this.DailyWorkerService.registerUserUpdateCallback(() => {
            this.initDailyWorkers();
        });
        this.WorkerService.registerUserUpdateCallback(() => {
            this.initWorkers();
        });
        AuthService.registerUserUpdateCallback(() => {
            this.currentUser = AuthService.currentUser;
        });
        this.currentUser = AuthService.currentUser;
        this.initSites();
        this.initResources();
        this.initDates();
        this.initWorkers()
        this.initDailyWorkers()
    }
    initResources() {
        this.resourceTypes = this.TypeService.types;
        this.dailyResource.resourceType = this.resourceTypes[0];
    }
    initWorkers() {
        this.workers = this.WorkerService.workers;
        this.dailyWorker.worker = this.workers[0];
    }
    initDailyWorkers() {
        this.dailyWorkers = this.DailyWorkerService.dailyWorkers;
    }
    initSites() {
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
    addDailyWorker(isValid) {
        if (isValid) {
            this.addingWorker = true;
            let dailyResource = Object.assign({}, this.dailyResource);
            this.dailyWorker.date = this.formatDate(dailyResource.date);
            this.dailyWorker.user = {};
            this.dailyWorker.user._id = this.currentUser._id;
            this.dailyWorker.site = this.dailyResource.site;
            this.dailyWorker.hourlyRate = this.dailyWorker.worker.hourlyRate
            this.DailyWorkerService.addDailyWorker(this.dailyWorker).then((response) => {
                // this.getTypes();
            }).finally(()=>{
                this.addingWorker = false;
            });
        }
    }
    addDefault() {
        this.adding = true;
        let dailyResource = Object.assign({}, this.dailyResource);
        dailyResource.date = this.formatDate(dailyResource.date);
        this.ResourceService.addDailyDefaultResources(dailyResource).then((response) => {
            this.getAllDailyResources();
            this.adding = false;
        });
    }
    addDailyResource(isValid) {
        if (isValid) {
            let dailyResource = Object.assign({}, this.dailyResource);
            dailyResource.date = this.formatDate(dailyResource.date);
            dailyResource.site = {};            
            dailyResource.site._id = this.dailyResource.site._id;
            this.ResourceService.addDailyResource(dailyResource).then((response) => {
                this.getAllDailyResources();
            });
        }
    }
    addLastDailyResources(siteId){
        let object = {
            siteId: siteId
        }
        object.date = this.formatDate(this.dailyResource.date);
        this.ResourceService.addLastDailyResources(object).then((res)=>{
            this.getAllDailyResources();
        })
    }
    addDailyComment(siteId) {
        if (this.dailyComments[siteId].site._id && this.dailyComments[siteId].text) {
            let dailyComment = Object.assign({}, this.dailyComments[siteId]);
            dailyComment.user = {};
            dailyComment.user._id = this.currentUser._id;
            dailyComment.date = this.formatDate(dailyComment.date);
            this.CommentService.addDailyComment(dailyComment).then((res) => {
                    this.getAllDailyResources();
            });
        }
    }
    sumSiteResources(siteId) {

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
    updateCurrentDailyWorker(dailyWorker) {
        this.DailyWorkerService.updateDailyWorker(dailyWorker)
            .then((res) => {
                this.editDisabled[dailyWorker._id] = false;
            });
    }
    increaceDailyResource(resource) {
        resource.amount += 1;
        this.ResourceService.updateDailyResource(resource)
            .then((res) => {
                this.addAllResourceSum();
                // resource.amount += 1;
            });
    }
    decreaseDailyResource(resource) {
        this.ResourceService.updateDailyResource(resource)
        resource.amount -= 1;
        this.ResourceService.updateDailyResource(resource)
            .then((res) => {
                this.addAllResourceSum();
                // resource.amount -= 1;
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
    deleteDailyComment(dailyCommentId) {
        this.CommentService.deleteDailyComment(dailyCommentId)
            .then((res) => {
                this.getAllDailyResources();
            });
    }
    getAllDailyResources() {
        if (!this.sites || this.sites.length === undefined || this.sites.length < 1) {
            return;
        }
        let object = {};
        object.date = this.formatDate(this.dailyResource.date);
        object.sites = [];
        _.mapValues(this.sites, function (o) {
            object.sites.push(o._id);
        });
        let resourceCall = this.ResourceService.getAllDailyResources(object);
        let commentCall = this.CommentService.getAllDailyComments(object);
        let dailyWorkerCall = this.DailyWorkerService.getAllDailyWorkers(object);

        this.$q.all([resourceCall, commentCall, dailyWorkerCall])
            .then((resArray)=> {
                this.resources = resArray[0].data;
                this.comments = resArray[1].data;
                this.dailyWorkers = resArray[2].data;
                this.addAllResourceSum();
            }).catch((response)=> {
                console.log('Failed to retrive daily data');
            }).finally(() => {                
                this.loading = false;
            })
        
    }
    addAllResourceSum() {
        this.overview = {
            sitesCount:0,
            totalResources:0,
        }
        this.arrayGroup = _.groupBy(this.resources, 'site._id');
        this.grouped = [];
        _.forEach(this.arrayGroup, (key,value)=>{
            let all = _.sumBy(key, function (o) { return o.amount; });
            this.grouped.push({
                resources:key,
                comments:_.filter(this.comments, function(o) { return o.site._id === key[0].site._id }),
                total:all,
                siteName:key[0].site.name,
                siteId:key[0].site._id});
            this.overview.sitesCount += 1;
            this.overview.totalResources += all;
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