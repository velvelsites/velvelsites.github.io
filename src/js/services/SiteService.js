let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http','$q')
class SiteService {
	constructor() {
	}
    addUserToSite(siteId, userId){
        return this.$http.post(url + '/api/addUserToSite',{
            siteId: siteId,
            userId: userId
        });
    }
	removeUserFromSite(userId, siteId){
        return this.$http.post(url + '/api/removeUserFromSite',{
            siteId: siteId,
            userId: userId
        });
    }
	addSite(site) {
		let promise = this.validateClientObject(site);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addSite',site);

	}
	getSite(id) {
		let promise = this.validateClientObject(id);
		if (promise) {
			return promise;
		}
		return this.$http.get(url + '/api/getSite', {id:id});
	}
	getSites() {
		return this.$http.get(url + '/api/getSites');
	}
	getSiteUsers(siteId){
		return this.$http.get(url + '/api/getSiteUsers/' + siteId);
	}
	updateSite(site){
		return this.$http.put(url + '/api/updateSite/' + site._id,site);
	}
	deleteSite(siteId){
		return this.$http.delete(url + '/api/deleteSite/' + siteId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ type: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findSiteLike(searchObject){
		return this.$http.get(url + '/api/findSiteLike', {
        params: {
            searchString:searchObject.searchString
        }
    });
	}
}
angular.module('velvel-app').service('SiteService', SiteService);