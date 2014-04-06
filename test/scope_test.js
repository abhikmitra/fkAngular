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
        //This is based on the premise that even though the old and new value are same ,
        // it should be called the first time when everything is undefined.
        it("calls listener when watch value is first undefined", function() {
            scope.counter = 0;
            scope.$watch(
                function(scope) { return scope.someValue; },
                function(newValue, oldValue, scope) { scope.counter++; }
            );
            scope.$digest();
            expect(scope.counter).toBe(1);
        });
        //This is the reason the first watch is run with the value undefined.
        // Its because first time digest cycle is run is encountered it needs to invoke all the watch functions,and in most cases the value is undefined
        it("calls listener with new value as old value the first time", function() {
            scope.someValue = 123;
            var oldValueGiven;
            scope.$watch(
                function(scope) { return scope.someValue; },
                function(newValue, oldValue, scope) { oldValueGiven = oldValue; }
            );
            scope.$digest();
            expect(oldValueGiven).toBe(123);
        });
        //The reason for this test case is we might want to know how many times digest is run for each controller.
        //The standard way is to register a watch on the scope with no listener function
        it("may have watchers that omit the listener function", function() {
            var watchFn = jasmine.createSpy().and.returnValue('something');
            scope.$watch(watchFn);
            scope.$digest();
            expect(watchFn).toHaveBeenCalled();
        });
        it("triggers chained watchers in the same digest", function() {

            scope.name = 'Jane';
            /*The watches are executed sequentially
            * So when digest is called this gets executed
            * First time nameupper is undefined*/
            scope.$watch(
                function(scope) { return scope.nameUpper; },
                function(newValue, oldValue, scope) {
                    if (newValue) {
                        scope.initial = newValue.substring(0, 1) + '.';
                    }
                }
            )
            /*
            * name upper is set here.The expected behaviour is that fkAngular should detect
            * the change and re run the digest loop itself till it stabilizes
            * otherwise it cannot act on the changes of nameupper as nameupper was udnefiend
            * when it went over it but got changed later in the $$watcher array
            * If the order was reversed, the test would pass right away because the watches would
             happen to be in just the right order*
            */
            scope.$watch(
                function(scope) { return scope.name; },

            function(newValue, oldValue, scope) {
                if (newValue) {
                    scope.nameUpper = newValue.toUpperCase();
                }
            }
            );
            scope.$digest();
            expect(scope.initial).toBe('J.');
            scope.name = 'Bob';
            scope.$digest();
            expect(scope.initial).toBe('B.');
        });
        it("gives up on the watches after 10 iterations", function () {
            scope.counterA = 0;
            scope.counterB = 0;
            scope.$watch(
                function (scope) {
                    return scope.counterA;
                },

                function (newValue, oldValue, scope) {
                    scope.counterB++;
                }
            );
            scope.$watch(
                function (scope) {
                    return scope.counterB;
                },
                function (newValue, oldValue, scope) {
                    scope.counterA++;
                }
            );
            expect((function () {
                scope.$digest();
            })).toThrow();
        });



    });

});
