import moment from 'moment-timezone';
let DATE_FORMAT = 'yyyy-MM';

@Inject('MainService', 'DailyWorkerService')
class WorkerOverviewCtrl {
    constructor() {
        this.initOverview()
        this.groupWorkers()
        this.moment = moment;
        this.initDates();
    }
    initOverview(){
        if(this.DailyWorkerService.allDailyWorkers.length){
            this.allDailyWorkers = this.DailyWorkerService.allDailyWorkers;
        } else{
            this.getAllDailyWorkers();
        }
    }
    getMonthlyWorkers(){
        let month = this.moment(this.date).month()
        let year = this.moment(this.date).year()
        this.groupWorkersByYearMonth(year, month)
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
    }
    groupWorkersByYearMonth(year, month){
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
                    let siteDayYear = this.moment(siteDay.date).year()
                    let siteDayMonth = this.moment(siteDay.date).month()
                    if(siteDayYear === year && siteDayMonth === month){
                        newSite.hours += siteDay.hours;
                        newSite.commute += siteDay.commute;
                        newSite.days += 1;
                    }
                })
                if(newSite.days > 0){
                    finalObject.sites.push(newSite)    
                }
            })
            this.grouped.push(finalObject)
        });
    }
    initDates() {
        this.format = DATE_FORMAT;
        this.date = new Date();
        this.popupsOpen = {
            addDate: false,
            resourcesDate: false
        };
        this.selectedDateOptions = {
            minDate: new Date(2016, 3, 25),
            maxDate: new Date(),
            showWeeks: false,
            dateFormat: DATE_FORMAT,
            minMode: 'month',
            datepickerMode:'month'
        };
    }
    openDate(dateField) {
        this.popupsOpen[dateField] = !this.popupsOpen[dateField];
    }
    








}
angular.module('velvel-app').component('workerOverview', {
    template: require('./workerOverview.html'),
    bindings: {
    },
    controller: WorkerOverviewCtrl
});