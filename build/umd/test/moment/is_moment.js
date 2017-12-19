
;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../../moment')) :
   typeof define === 'function' && define.amd ? define(['../../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

function each(array, callback) {
    var i;
    for (i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
}

// Pick the first defined of two or three arguments.

function setupDeprecationHandler(test, moment$$1, scope) {
    test._expectedDeprecations = null;
    test._observedDeprecations = null;
    test._oldSupress = moment$$1.suppressDeprecationWarnings;
    moment$$1.suppressDeprecationWarnings = true;
    test.expectedDeprecations = function () {
        test._expectedDeprecations = arguments;
        test._observedDeprecations = [];
    };
    moment$$1.deprecationHandler = function (name, msg) {
        var deprecationId = matchedDeprecation(name, msg, test._expectedDeprecations);
        if (deprecationId === -1) {
            throw new Error('Unexpected deprecation thrown name=' +
                    name + ' msg=' + msg);
        }
        test._observedDeprecations[deprecationId] = 1;
    };
}

function teardownDeprecationHandler(test, moment$$1, scope) {
    moment$$1.suppressDeprecationWarnings = test._oldSupress;

    if (test._expectedDeprecations != null) {
        var missedDeprecations = [];
        each(test._expectedDeprecations, function (deprecationPattern, id) {
            if (test._observedDeprecations[id] !== 1) {
                missedDeprecations.push(deprecationPattern);
            }
        });
        if (missedDeprecations.length !== 0) {
            throw new Error('Expected deprecation warnings did not happen: ' +
                    missedDeprecations.join(' '));
        }
    }
}

function matchedDeprecation(name, msg, deprecations) {
    if (deprecations == null) {
        return -1;
    }
    for (var i = 0; i < deprecations.length; ++i) {
        if (name != null && name === deprecations[i]) {
            return i;
        }
        if (msg != null && msg.substring(0, deprecations[i].length) === deprecations[i]) {
            return i;
        }
    }
    return -1;
}

/*global QUnit:false*/

var test = QUnit.test;

var expect = QUnit.expect;

function module$1 (name, lifecycle) {
    QUnit.module(name, {
        setup : function () {
            moment.locale('en');
            moment.createFromInputFallback = function (config) {
                throw new Error('input not handled by moment: ' + config._i);
            };
            setupDeprecationHandler(test, moment, 'core');
            if (lifecycle && lifecycle.setup) {
                lifecycle.setup();
            }
        },
        teardown : function () {
            teardownDeprecationHandler(test, moment, 'core');
            if (lifecycle && lifecycle.teardown) {
                lifecycle.teardown();
            }
        }
    });
}

module$1('is moment');

test('is moment object', function (assert) {
    var MyObj = function () {},
        extend = function (a, b) {
            var i;
            for (i in b) {
                a[i] = b[i];
            }
            return a;
        };
    MyObj.prototype.toDate = function () {
        return new Date();
    };

    assert.ok(moment.isMoment(moment()), 'simple moment object');
    assert.ok(moment.isMoment(moment(null)), 'invalid moment object');
    assert.ok(moment.isMoment(extend({}, moment())), 'externally cloned moments are moments');
    assert.ok(moment.isMoment(extend({}, moment.utc())), 'externally cloned utc moments are moments');

    assert.ok(!moment.isMoment(new MyObj()), 'myObj is not moment object');
    assert.ok(!moment.isMoment(moment), 'moment function is not moment object');
    assert.ok(!moment.isMoment(new Date()), 'date object is not moment object');
    assert.ok(!moment.isMoment(Object), 'Object is not moment object');
    assert.ok(!moment.isMoment('foo'), 'string is not moment object');
    assert.ok(!moment.isMoment(1), 'number is not moment object');
    assert.ok(!moment.isMoment(NaN), 'NaN is not moment object');
    assert.ok(!moment.isMoment(null), 'null is not moment object');
    assert.ok(!moment.isMoment(undefined), 'undefined is not moment object');
});

test('is moment with hacked hasOwnProperty', function (assert) {
    var obj = {};
    // HACK to suppress jshint warning about bad property name
    obj['hasOwnMoney'.replace('Money', 'Property')] = function () {
        return true;
    };

    assert.ok(!moment.isMoment(obj), 'isMoment works even if passed object has a wrong hasOwnProperty implementation (ie8)');
});

})));
