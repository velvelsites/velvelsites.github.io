import _ from 'lodash';
@Inject('$q', '$http', 'UserService', 'SiteService', 'TypeService', 'ResourceService','WorkerService','DailyWorkerService')
class AuthService {
    constructor() {
        this.adminRoles = ['57d27d4313d468481b1fe12e'];
        this.editorRoles = ['57d2805f13d468481b1fe130', '57d27d4313d468481b1fe12e'];
        this.readerRoles = ['57d2837a13d468481b1fe133', '57d27d4313d468481b1fe12e', '57d2805f13d468481b1fe130'];
        this.adminRoutes = ['role', 'user'];
        this.editRoutes = ['site', 'user'];
        this.readerRoutes = ['profile', 'type'];
        this.currentUserRole = 'None';
        this.currentUser = {};
        this.observers = [];

        this.API_ENDPOINT = {
            url: 'https://velvel-server.herokuapp.com/api'//'http://localhost:3001/api'
        };
        this.LOCAL_TOKEN_KEY = 'yourTokenKey';
        this.isAuthenticated = false;
        this.authToken;
        this.loadUserCredentials();
    }
    notifyObservers() {
        _.forEach(this.observers, (callback) => {
            callback();
        });
    };
    registerUserUpdateCallback(callback) {
        this.observers.push(callback);
    }
    getUser() {
        return this.currentUser;
    }
    validateStatePrivileges(stateName) {
        if (_.includes(this.editRoutes, stateName)) {
            return this.validateEditorRole();
        }
        else if (_.includes(this.adminRoutes, stateName)) {
            return this.validateAdminRole();
        }
        else {
            return this.validateReaderRole();
        }
    }
    validateAdminRole() {
        return _.includes(this.adminRoles, this.currentUserRole);
    }
    validateEditorRole() {
        return _.includes(this.editorRoles, this.currentUserRole) || validateReaderRole();
    }
    validateReaderRole() {
        return _.includes(this.readerRoles, this.currentUserRole);
    }
    Authenticated() {
        return this.isAuthenticated;
    }
    loadUserCredentials() {
        var token = window.localStorage.getItem(this.LOCAL_TOKEN_KEY);
        let userId = window.localStorage.getItem('currentUser');
        this.currentUserRole = window.localStorage.getItem('currentUserRole');
        if (userId) {
            if (token) {
                this.useCredentials(token);
                this.UserService.getUser(userId).then((res) => {
                    this.loadUser(res.data);
                });
            }
        }
    }
    storeUserCredentials(data) {
        window.localStorage.setItem(this.LOCAL_TOKEN_KEY, data.token);
        window.localStorage.setItem('currentUser', data.user._id);
        window.localStorage.setItem('currentUserRole', data.user.role._id);
        this.useCredentials(data.token);
    }

    useCredentials(token) {
        this.isAuthenticated = true;
        this.authToken = token;
        // Set the token as header for your requests!
        this.$http.defaults.headers.common.Authorization = this.authToken;
    }

    destroyUserCredentials() {
        this.authToken = undefined;
        this.isAuthenticated = false;
        this.currentUser = undefined;
        this.$http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(this.LOCAL_TOKEN_KEY);
        window.localStorage.removeItem('currentUser');
        window.localStorage.removeItem('currentUserRole');
    }
    register(user) {
        return $q((resolve, reject) => {
            this.$http.post(this.API_ENDPOINT.url + '/signup', user).then((result) => {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
    loadUser(user) {
        this.currentUser = user;
        this.currentUserRole = user.role._id;
        this.SiteService.getUserSites(user._id);
        this.TypeService.getTypes();
        this.WorkerService.getWorkers();
        // this.DailyWorkerService.getDailyWorkers();
        // this.ResourceService.initUser(user);
        this.notifyObservers();
    }
    login(user) {

        let promise = this.$http.post(this.API_ENDPOINT.url + '/authenticate', user).then((result)=>{
            if (result.data.success) {
                console.log('Success return from authentication');
                this.storeUserCredentials(result.data);
                this.loadUser(result.data.user);
            }
            else{
                alert('שם משתמש או סיסמה שגויים');
            }
        });
        return promise;


        // return this.$q((resolve, reject) => {
        //     this.$http.post(this.API_ENDPOINT.url + '/authenticate', user).then((result) => {
        //         if (result.data.success) {
        //             console.log('Success return from authentication');
        //             this.storeUserCredentials(result.data);
        //             this.loadUser(result.data.user);
        //             resolve(result.data.msg);
        //         } else {
        //             alert('No go!');
        //             reject(result.data.msg);
        //         }
        //     });
        // });
    };

    logout() {
        this.destroyUserCredentials();
        this.notifyObservers();
    };
    static AuthFactory($q, $http, UserService, SiteService,TypeService,ResourceService,WorkerService,DailyWorkerService) {
        return new AuthService($q, $http, UserService, SiteService,TypeService,ResourceService,WorkerService,DailyWorkerService);
    }
}
angular.module('velvel-app').factory('AuthService', AuthService.AuthFactory);



// @Inject('$rootScope', '$q')
// class AuthInterceptor {
//     constructor() {

//     }
//     responseError(response) {
//         this.$rootScope.$broadcast({
//             401: 'auth-not-authenticated',
//         }[response.status], response);
//         return this.$q.reject(response);
//     }
// }
// angular.module('velvel-app').factory('AuthInterceptor',AuthInterceptor); 


angular.module('velvel-app').factory('AuthInterceptor', ($rootScope, $q) => {
    return {
        responseError: (response) => {
            $rootScope.$broadcast({
                401: 'auth-not-authenticated',
            }[response.status], response);
            return $q.reject(response);
        }
    };
})
angular.module('velvel-app').config(($httpProvider) => {
    $httpProvider.interceptors.push('AuthInterceptor');
})
    .run(($rootScope, $state, AuthService) => {
        $rootScope.$on('$stateChangeStart', (event, next, nextParams, fromState) => {
            if (!AuthService.Authenticated() || !AuthService.validateStatePrivileges(next.name)) {
                console.log(next.name);
                if (next.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        });
        $rootScope.$on('auth-not-authenticated', function (event) {
            AuthService.logout();
            alert('Not Authorized');
            $state.go('login');
            // var alertPopup = $ionicPopup.alert({
            //     title: 'Session Lost!',
            //     template: 'Sorry, You have to login again.'
            // });
        });
    });
