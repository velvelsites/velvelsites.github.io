@Inject('MainService', 'RoleService')
class RoleCtrl {
    constructor() {
        this.initRoles()
    }
    initRoles(){
        if(this.RoleService.roles.length){
            this.roles = this.RoleService.roles;
            this.selectedUser = this.roles[0];
        } else{
            this.getRoles();
        }
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