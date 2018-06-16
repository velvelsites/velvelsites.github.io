import moment from 'moment-timezone';
let DATE_FORMAT = 'yyyy-MM';

@Inject('MainService', 'DailyWorkerService','SiteService')
class WorkerOverviewCtrl {
    constructor() {
        this.SiteService.registerUserUpdateCallback(() => {
            this.initSites();
        });
        this.allSites = {}
        this.siteObject = {}
        this.sitesArray =[]
        this.showSection = {}
        this.monthDays = []
        this.moment = moment;
        this.monthlyTotal = 0;
        this.initOverview()
        this.initDates()
        this.getDaysArrayByMonth()
        this.getMonthlyWorkers()
        
        this.initSites()
    }
    initOverview(){
        if(this.DailyWorkerService.allDailyWorkers.length){
            this.allDailyWorkers = this.DailyWorkerService.allDailyWorkers;
        } else{
            this.getAllDailyWorkers();
        }
    }
    getSiteName(_id){
        let site = _.find(this.allSites,{_id})
        if(site){
            return site.name;
        }
    }
    getWorkerName(_id){
        let worker = _.find(this.allDailyWorkers,(o)=>{
            return o.worker._id == _id;
        })
        if(worker && worker.worker){
            return worker.worker.name;   
        }
    }
    initSites() {
        this.allSites = this.SiteService.userSites;
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
        var newMoment = this.moment
        var selectedDate = this.date
        this.workers = _.groupBy(this.allDailyWorkers, 'worker._id');
        this.monthYearWorkers = _.filter(this.allDailyWorkers, function(o) { 
            if(o){
                return ((newMoment(o.date).month() == newMoment(selectedDate).month()) && (newMoment(o.date).year() == newMoment(selectedDate).year()));
            }
            return false
        });
        this.workerDataMap = {}
        this.workerDataMap2 = {}
        this.workerGrouped = _.groupBy(this.monthYearWorkers, 'worker._id');
        _.forEach(Object.keys(this.workerGrouped), workerKey=>{
            if(!this.workerDataMap2[workerKey]){
                this.workerDataMap2[workerKey] = {
                    sites:[],
                    total:0
                }
            }
            _.forEach(this.workerGrouped[workerKey], workerDaily=>{
                this.workerDataMap2[workerKey].total += parseFloat(this.dailyWorkerTotal(workerDaily.hourlyRate,workerDaily.hours,workerDaily.commute).toFixed(0))
            })
            _.forEach(_.groupBy(this.workerGrouped[workerKey], 'site._id'), workerSiteDays=>{
                this.workerDataMap2[workerKey].sites.push({
                    name: workerSiteDays[0].site.name,
                    days:workerSiteDays.length,
                    percent: (( workerSiteDays.length / this.workerGrouped[workerKey].length ) *100).toFixed(0) + '%'
                })
            })
        })
        this.workerMap = Object.keys(this.workerGrouped).map( workerId => {
            var obj = {}
            obj[workerId] = _.groupBy(_.sortBy(this.workerGrouped[workerId],'date'), 'site._id')
            _.forEach(Object.keys(obj[workerId]), workeSiteKey => {
                if(!this.workerDataMap[workerId]){
                    this.workerDataMap[workerId]= {
                        total:0,
                        sites:[],
                    }
                }
                this.workerDataMap[workerId].sites.push({
                    name: obj[workerId][workeSiteKey][0].site.name,
                    days:obj[workerId][workeSiteKey].length,
                    percent: (( obj[workerId][workeSiteKey].length / this.workerGrouped[workerId].length ) *100).toFixed(0) + '%'
                })
            })
            return obj
        })

        console.log(this.workerMap)
        this.filteredDailyWorkers = _.filter(this.allDailyWorkers, (o)=>{
            let siteDayYear = this.moment(o.date).year()
            let siteDayMonth = this.moment(o.date).month()
            return siteDayMonth == month && siteDayYear == year
        })
        this.workersSites = _.groupBy(this.filteredDailyWorkers, 'site._id');
        this.monthlyWorkers = _.groupBy(this.filteredDailyWorkers, 'worker._id');
        _.forEach(this.monthlyWorkers, (worker, key) =>{
            this.monthlyWorkers[key] = _.groupBy(worker, 'date');
            this.monthlyWorkers[key] = _.mapKeys(this.monthlyWorkers[key], o => {
                return this.moment(o[0].date).date()
            })
        })

        this.groupedSites = {}

        _.forEach(this.workersSites, (workerSite, key)=>{
            this.groupedSites[key] = _.groupBy(workerSite, 'worker._id');
        })
        this.grouped = [];
        this.sites = {};    
        this.monthlyTotal = 0
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
                    newSite.siteTotal = parseFloat(this.dailyWorkerTotal(newSite.hourlyRate,newSite.hours,newSite.commute).toFixed(0))
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
    floatDown(number, digits){
        return parseFloat(number.toFixed(digits));
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
    getDaysArrayByMonth() {
      let daysInMonth = moment().daysInMonth();
      let arrDays = [];

      while(daysInMonth) {
        let current = moment().date(daysInMonth);
        arrDays.push(current);
        daysInMonth--;
      }

      this.monthDays = arrDays;
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