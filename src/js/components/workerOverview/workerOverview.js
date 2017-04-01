@Inject('MainService', 'DailyWorkerService')
class WorkerOverviewCtrl {
    constructor() {
        this.initOverview()
        this.groupWorkers()
    }
    initOverview(){
        if(this.DailyWorkerService.allDailyWorkers.length){
            this.allDailyWorkers = this.DailyWorkerService.allDailyWorkers;
        } else{
            this.getAllDailyWorkers();
        }
    }
    getAllDailyWorkers() {
        this.DailyWorkerService.getAllDailyWorkers().then((response) => {
            this.allDailyWorkers = response.data;
            this.groupWorkers()
        }, (error) => {
            console.log('Error retriving worker overview');
        });
    }
    dailyWorkerTotal(hours, hourlyRate, commute){
        return (hours * hourlyRate) + commute;
    }



    groupWorkers(){
        this.workers = _.groupBy(this.allDailyWorkers, 'worker._id');
        this.grouped = [];
        _.forEach(this.workers, (workerUnits, workerId)=>{
            let finalObject = {
                workerId:workerId,
                workerName:workerUnits[0].worker.name,
                sites:[]
            }
            let siteGroup = _.groupBy(workerUnits, 'site._id');
            let hours = 0;
            _.forEach(siteGroup,(site, siteId)=>{
                let newSite = {id:siteId, days:0, hours:0, 
                    name:site[0].site.name,
                    hourlyRate:site[0].hourlyRate, 
                    commute:0}
                _.forEach(site, (siteDay)=>{
                    newSite.hours += siteDay.hours;
                    newSite.commute += siteDay.commute;
                    newSite.days += 1;

                })
                finalObject.sites.push(newSite)
            })
            this.grouped.push(finalObject)
        });
        // _.forEach(this.arrayGroup, (key,value)=>{
        //     let all = _.sumBy(key, function (o) { return o.amount; });
        //     this.grouped.push({
        //         resources:key,
        //         comments:_.filter(this.comments, function(o) { return o.site._id === key[0].site._id }),
        //         total:all,
        //         siteName:key[0].site.name,
        //         siteId:key[0].site._id});
        //     this.overview.sitesCount += 1;
        //     this.overview.totalResources += all;
        // });
    }

    








}
angular.module('velvel-app').component('workerOverview', {
    template: require('./workerOverview.html'),
    bindings: {
    },
    controller: WorkerOverviewCtrl
});