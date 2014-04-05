/**
 * Created by abhik.mitra on 06/04/14.
 */
/* jshint globalstrict: true */
/* global Scope: false */
describe("Scope", function () {
    it("can be used as an object", function () {
        var scope = new Scope();
        scope.abhik = 1;
        expect(scope.abhik).toBe(1);
    });
    describe("digest", function () {
        var scope;
        beforeEach(function () {
            scope = new Scope();
        });
        it("calls the watch function when $digest runs first time", function () {
            var watchFn = function () {
                return 'wat';
            };
            var watchFn1 = function () {
                return 'wat1';
            };
            var watcher = jasmine.createSpy();
            var watcher1 = jasmine.createSpy();
            scope.$watch(watchFn, watcher);
            scope.$watch(watchFn1, watcher1);
            scope.$digest();
            expect(watcher).toHaveBeenCalled();
        });
        it("calls the watch function with the scope as the argument", function() {
            var watchFn = jasmine.createSpy();
            var listenerFn = function() { };
            scope.$watch(watchFn, listenerFn);
            scope.$digest();
            expect(watchFn).toHaveBeenCalledWith(scope);
        });
        it("calls the listener function when the watched value changes", function() {
            scope.someValue = 'a';
            scope.counter = 0;
            scope.$watch(
                function(scope) { return scope.someValue; },
                function(newValue, oldValue, scope) { scope.counter++; }
            );
            expect(scope.counter).toBe(0);
            scope.$digest();
            expect(scope.counter).toBe(1);
            scope.$digest();
            expect(scope.counter).toBe(1);
            scope.someValue = 'b';
            expect(scope.counter).toBe(1);
            scope.$digest();
            expect(scope.counter).toBe(2);
        });


    });

});
