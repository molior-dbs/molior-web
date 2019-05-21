/**
 * @ngdoc service
 * @name moliorApp.core.cirrina.observer.factory:Observer
 * @description
 * Wrapper around RxJS observables, so it can handle
 * unsubscribtion better with the `this.observers`-list of its parent
 * 
 * @example
 <pre>
 class Controller {
     constructor (Observer, CirrinaEvent, CirrinaSubject) {
        new Observer(this, CirrinaSubject.BUILD, CirrinaEvent.ADDED)
            .then()
            .subscribe(console.log);
     }
 }
 </pre>
 * @class Observer
 */
export class Observer {
    constructor(parent, subject, event) {
        this.parent = parent;
        this.subject = subject;
        this.event = event;
    }
    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.observer.factory:Observer
     * @name moliorApp.core.cirrina.observer.factory:Observer#then
     * @description
     * Registers the event and returns the RxJS Observable
     * 
     * @returns {Observable} Returns RxJS Observable
     * @memberof Observer
     */
    then() {
        return this.parent.rx.Observable.create((observer) => {
            this.index = this.parent.observers[this.subject][this.event].length;
            this.parent.observers[this.subject][this.event].push(observer);
        });
    }
    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.observer.factory:Observer
     * @name moliorApp.core.cirrina.observer.factory:Observer#unsubscribe
     * @description
     * Unsubscribe from events
     * 
     * @memberof Observer
     */
    unsubscribe() {
        setTimeout(() => {
            this.parent.observers[this.subject][this.event][this.index].dispose();
            this.parent.observers[this.subject][this.event].splice(this.index, 1);
        });
    }
}
