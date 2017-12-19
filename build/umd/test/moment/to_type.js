
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

module$1('to type');

test('toObject', function (assert) {
    var expected = {
        years:2010,
        months:3,
        date:5,
        hours:15,
        minutes:10,
        seconds:3,
        milliseconds:123
    };
    assert.deepEqual(moment(expected).toObject(), expected, 'toObject invalid');
});

test('toArray', function (assert) {
    var expected = [2014, 11, 26, 11, 46, 58, 17];
    assert.deepEqual(moment(expected).toArray(), expected, 'toArray invalid');
});

test('toDate returns a copy of the internal date', function (assert) {
    var m = moment();
    var d = m.toDate();
    m.year(0);
    assert.notEqual(d, m.toDate());
});

test('toJSON', function (assert) {
    if (Date.prototype.toISOString) {
        var expected = new Date().toISOString();
        assert.deepEqual(moment(expected).toJSON(), expected, 'toJSON invalid');
    } else {
        // IE8
        expect(0);
    }
});

test('toJSON works when moment is frozen', function (assert) {
    if (Date.prototype.toISOString) {
        var expected = new Date().toISOString();
        var m = moment(expected);
        if (Object.freeze != null) {
            Object.freeze(m);
        }
        assert.deepEqual(m.toJSON(), expected, 'toJSON when frozen invalid');
    } else {
        // IE8
        expect(0);
    }
});

})));
