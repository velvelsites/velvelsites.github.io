@Inject('MainService', 'WorkerService')
class WorkerCtrl {
    constructor() {
        this.getWorkers();
    }
    addWorker(isValid) {
        if (isValid) {
            this.addingWorker = true;
            this.WorkerService.addWorker(this.worker).then((response) => {
                this.getWorkers();
                this.addingWorker = false;
            }).catch((err)=>{
                console.log("err adding user " + err)
            });;
        }
    }
    getWorkers() {
        this.WorkerService.getWorkers().then((response) => {
            console.log('worker-component');
            this.workers = response.data;
        }, (error) => {
            console.log('Error retriving workers');
        });
    }
    updateWorker(worker) {
        this.WorkerService.updateWorker(worker)
            .then((res) => {
                this.editDisabled[worker._id] = false;
            }).catch((err)=>{
                console.log("err updating user " + err)
            });

    }
    deleteWorker(workerId) {
        this.WorkerService.deleteWorker(workerId)
            .then((res) => {
                this.getWorkers();
            });
    }
}
angular.module('velvel-app').component('worker', {
    template: require('./worker.html'),
    bindings: {
    },
    controller: WorkerCtrl
});