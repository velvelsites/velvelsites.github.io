let url = 'https://velvel-server.herokuapp.com';
// let url = 'http://localhost:3001';
@Inject('$http', '$q')
class CommentService {
	constructor() {
	}
	addDailyComment(comment) {
		let promise = this.validateClientObject(comment);
		if (promise) {
			return promise;
		}
		return this.$http.post(url + '/api/addDailyComment', comment);
	}
	getAllDailyComments(object) {
		return this.$http.get(url + '/api/getAllDailyComments', {
			params: {
				date: object.date,
				sites: object.sites
			}
		});
	}
	updateDailyComment(comment) {
		return this.$http.put(url + '/api/updateDailyComment/' + comment._id, comment);
	}
	deleteDailyComment(commentId) {
		return this.$http.delete(url + '/api/deleteDailyComment/' + commentId);
	}
	validateClientObject(clientObject) {
		if (!clientObject || clientObject == undefined) {
			var deff = this.$q.defer();
			deff.reject({ Comment: 'Invalid filter', message: 'search filter is invalid' });
			return deff.promise;
		}
		return null;
	}
	findCommentLike(searchObject) {
		return this.$http.get(url + '/api/findCommentLike', {
			params: {
				searchString: searchObject.searchString
			}
		});
	}
}
angular.module('velvel-app').service('CommentService', CommentService);