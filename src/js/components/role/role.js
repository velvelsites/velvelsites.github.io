@Inject('MainService', 'RoleService')
class RoleCtrl {
    constructor() {
        this.getRoles();
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
            console.log('Role-component');
            this.roles = response.data;
        }, (error) => {
            console.log('Error retriving Roles');
        });
    }
    updateRole(role) {
        this.RoleService.updateRole(role)
            .then((res) => {
                this.editDisabled[role._id] = false;
            });

    }
    deleteRole(roleId) {
        this.RoleService.deleteRole(roleId)
            .then((res) => {
                this.getRoles();
            });
    }
}
angular.module('velvel-app').component('role', {
    template: require('./role.html'),
    bindings: {
    },
    controller: RoleCtrl
});