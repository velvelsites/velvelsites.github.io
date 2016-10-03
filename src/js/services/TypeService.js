let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class TypeService {
	constructor() {
	}
	addType(type) {
		let promise = this.validateClientObject(type);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addType',type);

	}
	getType(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getType', {id:id});
	}
	getTypes() {
		return this.$http.get(url + '/api/getTypes');
	}
	updateType(type){
		return this.$http.put(url + '/api/updateType/' + type._id,type);
	}
	deleteType(typeId){
		return this.$http.delete(url + '/api/deleteType/' + typeId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findTypeLike(searchObject){
		return this.$http.get(url + '/api/findTypeLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('TypeService', TypeService);