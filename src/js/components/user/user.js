@Inject('MainService', 'UserService', 'RoleService', '$http')
class UserCtrl {
    constructor() {
        this.getUsers();
        this.getRoles();
        this.addingRole = false;
    }
    addUser(isValid) {
        if (isValid) {
            this.UserService.addUser(this.user).then((response) => {
                this.getUsers();
            }).catch((err) => {
                if ("11000\n" === err.data || "11001\n" === err.data) {
                    alert('Duplicate');
                }

            });
        }
    }
    authenticate(isValid) {
        this.UserService.authenticate(user).then((response) => {
            this.token = response.data.token;
            alert(this.token);
        }).catch((err) => {
        });
    }
    changePassword(isValid) {
        if (isValid) {
            this.passwords.oldPassword = this.selectedUser.password;
            this.passwords.email = this.selectedUser.email;
            this.UserService.changePassword(this.passwords).then((response) => {
               this.getUsers();
            }).catch((err) => {
            });
        }
    }
    getUsers() {
        this.UserService.getUsers().then((response) => {
            console.log('User-component');
            this.users = response.data;
        }, (error) => {
            console.log('Error retriving Users');
        });
    }
    getUserSites(userId) {
        this.UserService.getUserSites(userId).then(
            (res) => {
                this.userSites = res.data;
            }
        ).catch((err) => {
        });
    }
    addRole(isValid) {
        if (isValid) {
            this.addingRole = true;
            this.RoleService.addRole(this.role).then((response) => {
                this.getRoles();
                this.addingRole = false;
            });
        }
    }
    getRoles() {
        this.RoleService.getRoles().then((response) => {
            console.log('User-component');
            this.roles = response.data;
            this.user.role = this.roles[0];
        }, (error) => {
            console.log('Error retriving Roles');
        });
    }
    updateUser(user) {
        this.UserService.updateUser(user)
            .then((res) => {
                this.editDisabled[user._id] = false;
            });

    }
    deleteUser(userId) {
        this.UserService.deleteUser(userId)
            .then((res) => {
                this.getUsers();
            });
    }
}
angular.module('velvel-app').component('user', {
    template: require('./user.html'),
    bindings: {
    },
    controller: UserCtrl
});