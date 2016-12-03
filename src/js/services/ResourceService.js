let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class ResourceService {
	constructor() {
	}
	addResource(resource) {
		let promise = this.validateClientObject(resource);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addResource',resource);

	}
	getResource(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getResource', {id:id});
	}
	addLastDailyResources(object){
		let promise = this.validateClientObject(object);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addLastSiteResources',object);
	}
	addDailyDefaultResources(resource){
		let promise = this.validateClientObject(resource);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addDailyDefaultResources',resource);
	}
	addDailyDefault(resource) {
		let promise = this.validateClientObject(resource);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addDailyDefault',resource);
	}
	addDailyResource(resource) {
		let promise = this.validateClientObject(resource);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addDailyResource',resource);
	}
    getDailyDefaults(date, site){
		return this.$http.get(url + '/api/getDailyDefaults',{
			params:{
				date:date,
				site:site
			}
		});
	}
	deleteDailyDefault(resourceId){
		return this.$http.delete(url + '/api/deleteDailyDefault/' + resourceId);
	}
	getAllDailyResources(object){
		return this.$http.get(url + '/api/getAllDailyResources',{
			params:{
				date:object.date,
				sites: object.sites
			}
		});
	}
	getResources() {
		return this.$http.get(url + '/api/getResources');
	}
	updateResource(resource){
		return this.$http.put(url + '/api/updateResource/' + resource._id,resource);
	}
	updateDailyResource(resource){
		return this.$http.put(url + '/api/updateDailyResource/' + resource._id,resource);
	}
	deleteResource(resourceId){
		return this.$http.delete(url + '/api/deleteResource/' + resourceId);
	}
	deleteDailyResource(resourceId){
		return this.$http.delete(url + '/api/deleteDailyResource/' + resourceId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ resource: 'Invalid filter', message: 'search filter is invalid' });
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
angular.module('velvel-app').service('ResourceService', ResourceService);