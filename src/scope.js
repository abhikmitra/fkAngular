/**
 * Created by abhik.mitra on 06/04/14.
 */
/* jshint globalstrict: true */
'use strict';
function Scope() {
    this.$$watchers = [];
}
Scope.prototype.$watch = function (expressionFn, listenerFn) {
    var watcher = {
        watchFn: expressionFn,
        listenerFn: listenerFn
    };
    this.$$watchers.push(watcher);
    //The most recent function gets added to the higher index
};
Scope.prototype.$digest = function () {
    var self=this;
    _.forEach(this.$$watchers,function(watcher){
        console.log(watcher.watchFn);
        var current = watcher.watchFn(self);
        var old = watcher.last;
        if(old!==current){
            watcher.last = current;
            watcher.listenerFn(current,old,self);
        }

    });
};