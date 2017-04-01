let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class DailyWorkerService {
	constructor() {
		this.observers = [];
		this.dailyWorkers = {}
	}
	notifyObservers() {
        _.forEach(this.observers, (callback) => {
            callback();
        });
    };
	registerUserUpdateCallback(callback) {
        this.observers.push(callback);
    }
	getDailyWorker(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getDailyWorker', {id:id});
	}
	addDailyWorker(dailyWorker) {
		let promise = this.validateClientObject(dailyWorker);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addDailyWorker',dailyWorker);

	}
	getDailyWorkers() {
		let promise =  this.$http.get(url + '/api/getDailyWorkers');
		promise.then((res) => {
			this.dailyWorkers = res.data;
			this.notifyObservers();
		});
		return promise;
	}
	getAllDailyWorkers(object) {
		return this.$http.get(url + '/api/getDailyWorkers', {
			params: {
				date: object.date,
				sites: object.sites
			}
		});
	}
	updateDailyWorker(dailyWorker){
		return this.$http.put(url + '/api/updateDailyWorker/' + dailyWorker._id,dailyWorker);
	}
	deleteDailyWorker(DailyWorkerId){
		return this.$http.delete(url + '/api/deleteDailyWorker/' + dailyWorkerId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findDailyWorkerLike(searchObject){
		return this.$http.get(url + '/api/findDailyWorkerLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('DailyWorkerService', DailyWorkerService);