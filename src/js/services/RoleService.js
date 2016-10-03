let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class RoleService {
	constructor() {
	}
	getRole(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getRole', {id:id});
	}
	addRole(role) {
		let promise = this.validateClientObject(role);
		if (promise) {
			return promise;
		}
		// role.value = 35;
		return this.$http.post(url + '/api/addRole',role);

	}
	getRoles() {
		return this.$http.get(url + '/api/getRoles');
	}
	updateRole(role){
		return this.$http.put(url + '/api/updateRole/' + role._id,role);
	}
	deleteRole(roleId){
		return this.$http.delete(url + '/api/deleteRole/' + roleId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findRoleLike(searchObject){
		return this.$http.get(url + '/api/findRoleLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('RoleService', RoleService);