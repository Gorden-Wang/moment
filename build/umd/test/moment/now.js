
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

module$1('now');

test('now', function (assert) {
    var startOfTest = new Date().valueOf(),
        momentNowTime = moment.now(),
        afterMomentCreationTime = new Date().valueOf();

    assert.ok(startOfTest <= momentNowTime, 'moment now() time should be now, not in the past');
    assert.ok(momentNowTime <= afterMomentCreationTime, 'moment now() time should be now, not in the future');
});

test('now - Date mocked', function (assert) {
    // We need to test mocking the global Date object, so disable 'Read Only' jshint check
    /* jshint -W020 */
    var RealDate = Date,
        customTimeMs = moment('2015-01-01T01:30:00.000Z').valueOf();

    function MockDate() {
        return new RealDate(customTimeMs);
    }

    MockDate.now = function () {
        return new MockDate().valueOf();
    };

    MockDate.prototype = RealDate.prototype;

    Date = MockDate;

    try {
        assert.equal(moment().valueOf(), customTimeMs, 'moment now() time should use the global Date object');
    } finally {
        Date = RealDate;
    }
});

test('now - custom value', function (assert) {
    var customTimeStr = '2015-01-01T01:30:00.000Z',
        customTime = moment(customTimeStr, moment.ISO_8601).valueOf(),
        oldFn = moment.now;

    moment.now = function () {
        return customTime;
    };

    try {
        assert.equal(moment().toISOString(), customTimeStr, 'moment() constructor should use the function defined by moment.now, but it did not');
        assert.equal(moment.utc().toISOString(), customTimeStr, 'moment() constructor should use the function defined by moment.now, but it did not');
    } finally {
        moment.now = oldFn;
    }
});

test('empty object, empty array', function (assert) {
    function assertIsNow(gen, msg) {
        var before = +(new Date()),
            mid = gen(),
            after = +(new Date());
        assert.ok(before <= +mid && +mid <= after, 'should be now : ' + msg);
    }
    assertIsNow(function () {
        return moment();
    }, 'moment()');
    assertIsNow(function () {
        return moment([]);
    }, 'moment([])');
    assertIsNow(function () {
        return moment({});
    }, 'moment({})');
    assertIsNow(function () {
        return moment.utc();
    }, 'moment.utc()');
    assertIsNow(function () {
        return moment.utc([]);
    }, 'moment.utc([])');
    assertIsNow(function () {
        return moment.utc({});
    }, 'moment.utc({})');
});

})));
