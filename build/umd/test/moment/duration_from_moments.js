
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

module$1('duration from moments');

test('pure year diff', function (assert) {
    var m1 = moment('2012-01-01T00:00:00.000Z'),
        m2 = moment('2013-01-01T00:00:00.000Z');

    assert.equal(moment.duration({from: m1, to: m2}).as('years'), 1, 'year moment difference');
    assert.equal(moment.duration({from: m2, to: m1}).as('years'), -1, 'negative year moment difference');
});

test('month and day diff', function (assert) {
    var m1 = moment('2012-01-15T00:00:00.000Z'),
        m2 = moment('2012-02-17T00:00:00.000Z'),
        d = moment.duration({from: m1, to: m2});

    assert.equal(d.get('days'), 2);
    assert.equal(d.get('months'), 1);
});

test('day diff, separate months', function (assert) {
    var m1 = moment('2012-01-15T00:00:00.000Z'),
        m2 = moment('2012-02-13T00:00:00.000Z'),
        d = moment.duration({from: m1, to: m2});

    assert.equal(d.as('days'), 29);
});

test('hour diff', function (assert) {
    var m1 = moment('2012-01-15T17:00:00.000Z'),
        m2 = moment('2012-01-16T03:00:00.000Z'),
        d = moment.duration({from: m1, to: m2});

    assert.equal(d.as('hours'), 10);
});

test('minute diff', function (assert) {
    var m1 = moment('2012-01-15T17:45:00.000Z'),
        m2 = moment('2012-01-16T03:15:00.000Z'),
        d = moment.duration({from: m1, to: m2});

    assert.equal(d.as('hours'), 9.5);
});

})));
