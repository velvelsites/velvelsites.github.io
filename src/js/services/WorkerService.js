let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class WorkerService {
	constructor() {
		this.observers = [];
		this.workers = {}
	}
	notifyObservers() {
        _.forEach(this.observers, (callback) => {
            callback();
        });
    };
	registerUserUpdateCallback(callback) {
        this.observers.push(callback);
    }
	getWorker(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getWorker', {id:id});
	}
	addWorker(worker) {
		let promise = this.validateClientObject(worker);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addWorker',worker);
	}
	getWorkers() {
		let promise =  this.$http.get(url + '/api/getWorkers');
		promise.then((res) => {
			this.workers = res.data;
			this.notifyObservers();
		});
		return promise;
	}
	updateWorker(worker){
		return this.$http.put(url + '/api/updateWorker/' + worker._id,worker);
	}
	deleteWorker(workerId){
		return this.$http.delete(url + '/api/deleteWorker/' + workerId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findWorkerLike(searchObject){
		return this.$http.get(url + '/api/findWorkerLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('WorkerService', WorkerService);