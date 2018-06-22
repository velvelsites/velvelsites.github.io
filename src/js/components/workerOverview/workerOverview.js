import moment from 'moment-timezone';
import {GetNISFormat} from '../../utils/utils';
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
    formatShekels(amount) {
        return GetNISFormat(amount)
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
    dailyWorkerTotalByCell(cell){
        return (cell.hours * cell.hourlyRate) + cell.commute;
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
        this.workersSiteSummary = {}
        this.siteMap = {}
        this.workerGrouped = _.groupBy(this.monthYearWorkers, 'worker._id');
        _.forEach(Object.keys(this.workerGrouped), workerKey=>{
            if(!this.workersSiteSummary[workerKey]){
                this.workersSiteSummary[workerKey] = {
                    sites:[],
                    total:0,
                    totalDays:0,
                    totalHours:0,
                    totalCommute:0

                }
            }
            // 
            _.forEach(this.workerGrouped[workerKey], workerDaily=>{
                this.workersSiteSummary[workerKey].total += parseFloat(this.dailyWorkerTotal(workerDaily.hourlyRate,workerDaily.hours,workerDaily.commute).toFixed(0))
                this.workersSiteSummary[workerKey].totalHours += workerDaily.hours
                this.workersSiteSummary[workerKey].totalDays += 1
                this.workersSiteSummary[workerKey].totalCommute += workerDaily.commute
            })
            _.forEach(_.groupBy(this.workerGrouped[workerKey], 'site._id'), workerSiteDays=>{
                this.workersSiteSummary[workerKey].sites.push({
                    name: workerSiteDays[0].site.name,
                    days:workerSiteDays.length,
                    hours: _.sumBy(workerSiteDays, o=> o.hours),
                    commute: _.sumBy(workerSiteDays, o=> o.commute),
                    total: _.sumBy(workerSiteDays, o=>{return parseFloat(this.dailyWorkerTotalByCell(o))}),
                    percent: (( workerSiteDays.length / this.workerGrouped[workerKey].length ) *100).toFixed(0) + '%'
                })
            })
        })

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
    printData(elementToGet){
       var divToPrint=document.getElementById(elementToGet);
       var newWin= window.open("");
       newWin.document.write(
        '<html lang="en"><head><style>'+cssTemplate+'</style></head><body>'+divToPrint.outerHTML)+'</body></html>';
       newWin.print();
       newWin.close();
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
var cssTemplate = 'body{font-size:10px;direction:rtl;}#cell-large{width:100px;}.card{padding: 15px;border-radius: 4px;box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(63, 63, 68, 0.1);background-color: #FFFFFF;margin-bottom: 10px;margin-top: 1px;float: left;width: 100%;}.card .row {    margin: 0px;    padding: 10px;}.card .card-content {    padding: 10px;}.worker-table-header {    background: #C7DAFA;    color: #ffffff;}.worker-table-line span, .worker-table-header span {    display: inline-block;    width: 40px;    padding: 8px;    line-height: 1.42857;}.worker-table-line, .worker-table-header {    border-top: 1px solid #ddd;}.worker-site-detail {    display: flex;    flex-direction: row;    flex-wrap: nowrap;    justify-content: flex-start;    align-items: center;    align-content: stretch;}.worker-site-detail div {    width: 40px;    padding: 8px;}.worker-monthly{    padding: 10px;margin: 60px;}'
angular.module('velvel-app').component('workerOverview', {
    template: require('./workerOverview.html'),
    bindings: {
    },
    controller: WorkerOverviewCtrl
});