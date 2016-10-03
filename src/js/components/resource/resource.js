@Inject('ResourceService', 'TypeService')
class ResourceCtrl {
    constructor() {
        this.getResources();
        this.getTypes();
        this.resource = {};
    }
    addResource(isValid) {
        if (isValid) {
            this.ResourceService.addResource(this.resource).then((response) => {
                this.getResources();
            });
        }
    }
    getTypes() {
        this.TypeService.getTypes().then((response) => {
            console.log('Type-component');
            this.types = response.data;
            this.resource.type = this.types[0];
        }, (error) => {
            console.log('Error retriving Types');
        });
    }
    getResources() {
        this.ResourceService.getResources().then((response) => {
            console.log('resource-component');
            this.resources = response.data;
        }, (error) => {
            console.log('Error retriving resources');
        });
    }
    getDailyResources(date, siteId) {
        this.ResourceService.getDailyResources(date, siteId)
            .then((response) => {
                console.log('resource-component');
                this.resources = response.data;
            }, (error) => {
                console.log('Error retriving resources');
            });
    }
    updateResource(resource){
        this.ResourceService.updateResource(resource)
        .then((res)=>{
            this.editDisabled[resource._id] = false;
        });
        
    }
    deleteResource(resourceId){
        this.ResourceService.deleteResource(resourceId)
        .then((res)=>{
            this.getResources();
        });
    }

}
angular.module('velvel-app').component('resource', {
    template: require('./resource.html'),
    bindings: {
    },
    controller: ResourceCtrl
});