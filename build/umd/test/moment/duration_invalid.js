
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

module$1('invalid');

test('invalid duration', function (assert) {
    var m = moment.duration.invalid(); // should be invalid
    assert.equal(m.isValid(), false);
    assert.ok(isNaN(m.valueOf()));
});

test('valid duration', function (assert) {
    var m = moment.duration({d: null}); // should be valid, for now
    assert.equal(m.isValid(), true);
    assert.equal(m.valueOf(), 0);
});

test('invalid duration - only smallest unit can have decimal', function (assert) {
    var m = moment.duration({'days': 3.5, 'hours': 1.1}); // should be invalid
    assert.equal(m.isValid(), false);
    assert.ok(isNaN(m.valueOf())); // .valueOf() returns NaN for invalid durations
});

test('valid duration - smallest unit can have decimal', function (assert) {
    var m = moment.duration({'days': 3, 'hours': 1.1}); // should be valid
    assert.equal(m.isValid(), true);
    assert.equal(m.asHours(), 73.1);
});

test('invalid duration with two arguments', function (assert) {
    var m = moment.duration(NaN, 'days');
    assert.equal(m.isValid(), false);
    assert.ok(isNaN(m.valueOf()));
});

test('invalid duration operations', function (assert) {
    var invalids = [
            moment.duration(NaN),
            moment.duration(NaN, 'days'),
            moment.duration.invalid()
        ],
        i,
        invalid,
        valid = moment.duration();

    for (i = 0; i < invalids.length; ++i) {
        invalid = invalids[i];

        assert.ok(!invalid.add(5, 'hours').isValid(), 'invalid.add is invalid; i=' + i);
        assert.ok(!invalid.subtract(30, 'days').isValid(), 'invalid.subtract is invalid; i=' + i);
        assert.ok(!invalid.abs().isValid(), 'invalid.abs is invalid; i=' + i);
        assert.ok(isNaN(invalid.as('years')), 'invalid.as is NaN; i=' + i);
        assert.ok(isNaN(invalid.asMilliseconds()), 'invalid.asMilliseconds is NaN; i=' + i);
        assert.ok(isNaN(invalid.asSeconds()), 'invalid.asSeconds is NaN; i=' + i);
        assert.ok(isNaN(invalid.asMinutes()), 'invalid.asMinutes is NaN; i=' + i);
        assert.ok(isNaN(invalid.asHours()), 'invalid.asHours is NaN; i=' + i);
        assert.ok(isNaN(invalid.asDays()), 'invalid.asDays is NaN; i=' + i);
        assert.ok(isNaN(invalid.asWeeks()), 'invalid.asWeeks is NaN; i=' + i);
        assert.ok(isNaN(invalid.asMonths()), 'invalid.asMonths is NaN; i=' + i);
        assert.ok(isNaN(invalid.asYears()), 'invalid.asYears is NaN; i=' + i);
        assert.ok(isNaN(invalid.valueOf()), 'invalid.valueOf is NaN; i=' + i);
        assert.ok(isNaN(invalid.get('hours')), 'invalid.get is NaN; i=' + i);

        assert.ok(isNaN(invalid.milliseconds()), 'invalid.milliseconds is NaN; i=' + i);
        assert.ok(isNaN(invalid.seconds()), 'invalid.seconds is NaN; i=' + i);
        assert.ok(isNaN(invalid.minutes()), 'invalid.minutes is NaN; i=' + i);
        assert.ok(isNaN(invalid.hours()), 'invalid.hours is NaN; i=' + i);
        assert.ok(isNaN(invalid.days()), 'invalid.days is NaN; i=' + i);
        assert.ok(isNaN(invalid.weeks()), 'invalid.weeks is NaN; i=' + i);
        assert.ok(isNaN(invalid.months()), 'invalid.months is NaN; i=' + i);
        assert.ok(isNaN(invalid.years()), 'invalid.years is NaN; i=' + i);

        assert.equal(invalid.humanize(),
                     invalid.localeData().invalidDate(),
                     'invalid.humanize is localized invalid duration string; i=' + i);
        assert.equal(invalid.toISOString(),
                     invalid.localeData().invalidDate(),
                     'invalid.toISOString is localized invalid duration string; i=' + i);
        assert.equal(invalid.toString(),
                     invalid.localeData().invalidDate(),
                     'invalid.toString is localized invalid duration string; i=' + i);
        assert.equal(invalid.toJSON(), invalid.localeData().invalidDate(), 'invalid.toJSON is null; i=' + i);
        assert.equal(invalid.locale(), 'en', 'invalid.locale; i=' + i);
        assert.equal(invalid.localeData()._abbr, 'en', 'invalid.localeData()._abbr; i=' + i);
    }
});

})));
