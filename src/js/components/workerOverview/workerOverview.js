import moment from 'moment-timezone';
let DATE_FORMAT = 'yyyy-MM';

@Inject('MainService', 'DailyWorkerService')
class WorkerOverviewCtrl {
    constructor() {
        this.sites = {}
        this.siteObject = {}
        this.sitesArray =[]
        this.showSection = {}
        this.moment = moment;
        this.monthlyTotal = 0;
        this.initOverview()
        this.getMonthlyWorkers()
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
            this.getMonthlyWorkers()
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
            let workerName = workerUnits[0].worker.name
            let finalObject = {
                workerId: workerId,
                workerName: workerName,
                sites: []
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
        this.sites = {};    
        this.monthlyTotal = 0;
        _.forEach(this.workers, (workerUnits, workerId)=>{
            let workerName = workerUnits[0].worker.name
            let finalObject = {
                workerId:workerId,
                workerMonthly:0,
                workerName:workerName,
                sites:[]
            }
            let siteGroup = _.groupBy(workerUnits, 'site._id');
            let hours = 0;
            _.forEach(siteGroup,(site, siteId)=>{
                let newSite = {id:siteId, days:0, hours:0, 
                    name:site[0].site.name,
                    hourlyRate:site[0].hourlyRate, 
                    commute:0,
                    monthlyTotal:0}
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
                    newSite.siteTotal = this.dailyWorkerTotal(newSite.hourlyRate,newSite.hours,newSite.commute)
                    this.monthlyTotal += newSite.siteTotal;
                    finalObject.workerMonthly = newSite.siteTotal
                    finalObject.sites.push(newSite);
                    this.manageSites(siteId, site[0].site.name, workerId,workerName, newSite.siteTotal, newSite.days)
                }
            })
            if(finalObject.sites.length > 0){
                this.grouped.push(finalObject)    
            }
        });
    }
    manageSites(siteId, siteName, workerId, workerName, amount, days){
        if(!this.sites[siteId]){
            this.sites[siteId] = {name:siteName, monthlyTotal:0}
        }
        if(!this.sites[siteId]["workers"]){
            this.sites[siteId]["workers"]=[]
        }
        this.sites[siteId].monthlyTotal += amount
        this.sites[siteId]["workers"].push({id:workerId,name:workerName,"amount":amount,"days":days})

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