let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class MainService {
	constructor() {
	}
	addResource(resource) {
		let promise = this.validateClientObject(resource);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addResource',resource);

	}
	addDailyResource(resource) {
		let promise = this.validateClientObject(resource);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addDailyResource',resource);

	}
	getResource(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getResource', {id:id});
	}
	
	getResources() {
		return this.$http.get(url + '/api/getResources');
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findResourceLike(searchObject){
		return this.$http.get(url + '/api/findResourceLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('MainService', MainService);