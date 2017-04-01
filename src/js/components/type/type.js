@Inject('MainService', 'TypeService','ResourceService')
class TypeCtrl {
    constructor() {
        this.initTypes();
        this.initDailyDefaults();
    }
    initTypes(){
        if(this.TypeService.types.length){
            this.types = this.TypeService.types;
            this.selectedType = this.types[0];
        } else{
            this.getTypes();
        }
    }
    initDailyDefaults(){
        if(this.ResourceService.dailyDefaults.length){
            this.dailyDefaults = this.ResourceService.dailyDefaults;
        } else{
            this.getDailyDefaults();
        }
    }
    addType(isValid) {
        if (isValid) {
            this.addingType = true;
            this.TypeService.addType(this.type).then((response) => {
                this.getTypes();
                this.addingType = false;
            });
        }
    }
    addDailyDefault(isValid) {
        if (isValid) {
            this.ResourceService.addDailyDefault(this.selectedType).then((response) => {
                this.getDailyDefaults();
            });
        }
    }
    getTypes() {
        this.TypeService.getTypes().then((response) => {
            console.log('Type-component');
            this.types = response.data;
            this.selectedType = this.types[0]
        }, (error) => {
            console.log('Error retriving Types');
        });
    }
    getDailyDefaults() {
        this.ResourceService.getDailyDefaults().then((response) => {
            this.dailyDefaults = response.data;
        }, (error) => {
            console.log('Error retriving Types');
        });
    }
    updateType(type) {
        this.TypeService.updateType(type)
            .then((res) => {
                this.editDisabled[type._id] = false;
            });

    }
    deleteDailyDefault(typeId) {
        this.ResourceService.deleteDailyDefault(typeId)
            .then((res) => {
                this.getDailyDefaults();
            });
    }
    deleteType(typeId) {
        this.TypeService.deleteType(typeId)
            .then((res) => {
                this.getTypes();
            });
    }
}
angular.module('velvel-app').component('type', {
    template: require('./type.html'),
    bindings: {
    },
    controller: TypeCtrl
});