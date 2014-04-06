/**
 * Created by abhik.mitra on 06/04/14.
 */
/* jshint globalstrict: true */
'use strict';
function Scope() {
    this.$$watchers = [];
}
function initWatchVal() { }
Scope.prototype.$watch = function (expressionFn, listenerFn) {
    var watcher = {
        watchFn: expressionFn,
        listenerFn: listenerFn,
        last: initWatchVal
        //initialized: false
        //I had used initialized as a flag to invoke listenerFn on the page load.But it seems this is unneccessary
        //as we can instead set the last to a value which we know will be unique
        /*
        * The problem we are trying to address is that whatever the value we want to call watch for the first time its rendered
        * Technically it should not be anything from undefined.But in our test cases its not that*/
    };
    this.$$watchers.push(watcher);
    //The most recent function gets added to the higher index
};

Scope.prototype.$digest = function () {
    var self = this;
    _.forEach(this.$$watchers, function (watcher) {
        console.log(watcher.watchFn);
        var current = watcher.watchFn(self);
        var old = watcher.last;
        if (old !== current) {

            //This can be substituted with ternary operators but I
            // have trouble reading ternary operators ,so I will keep it like this :)
            if(watcher.last === initWatchVal){
                watcher.listenerFn(current, current, self);
            } else {
                watcher.listenerFn(current, old, self);
            }
            watcher.last = current;


        }
//        Not needed any more as we are not using the initialized fl
//        if (!watcher.initialized) {
//            watcher.initialized = true;
//        }


    });
};