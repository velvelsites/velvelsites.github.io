let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class UserService {
	constructor() {
		this.users = [];
		this.userSites = [];
	}
	addUser(user) {
		let promise = this.validateClientObject(user);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/signup',user);
	}
	getUser(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getUser/' + id);
	}
	getUsers() {
		let promise = this.$http.get(url + '/api/getUsers');
		promise.then((res) => {
			this.users = res.data
		});
		return promise;
	}
	authenticate(user){
		let promise = this.validateClientObject(user);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/authenticate',user);
	}
	changePassword(user){
		let promise = this.validateClientObject(user);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/changePassword', user);
	}
	getUserSites(userId) {
		let promise = this.$http.get(url + '/api/getUserSites/' + userId);
		promise.then((res) => {
			this.userSites = res.data
		});
		return promise;
	}
	updateUser(user){
		return this.$http.put(url + '/api/updateUser/' + user._id,user);
	}
	deleteUser(userId){
		return this.$http.delete(url + '/api/deleteUser/' + userId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findUserLike(searchObject){
		return this.$http.get(url + '/api/findUserLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('UserService', UserService);