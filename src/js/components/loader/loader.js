@Inject('$rootScope', '$scope')
class LoaderCtrl {
    constructor() {
        this.newLoader = false;
        // this.loadingCount = 0;
        $scope.$on("loader_show",()=>{
            // if(this.newLoader === false){
                this.newLoader = true;
            // }
            // this.loadingCount++;
        });
        $scope.$on("loader_hide",()=>{
            // if(--this.loadingCount === 0){
                this.newLoader = false;                
            // }
        });
    }
}

angular.module('velvel-app').component('loader', {
    template: require('./loader.html'),
    bindings: {
    	loader: '='
    },
    controller: LoaderCtrl
});