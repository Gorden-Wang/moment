
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

module$1('normalize units');

test('normalize units', function (assert) {
    var fullKeys = ['year', 'quarter', 'month', 'isoWeek', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'date', 'dayOfYear', 'weekday', 'isoWeekday', 'weekYear', 'isoWeekYear'],
        aliases = ['y', 'Q', 'M', 'W', 'w', 'd', 'h', 'm', 's', 'ms', 'D', 'DDD', 'e', 'E', 'gg', 'GG'],
        length = fullKeys.length,
        fullKey,
        fullKeyCaps,
        fullKeyPlural,
        fullKeyCapsPlural,
        fullKeyLower,
        alias,
        index;

    for (index = 0; index < length; index += 1) {
        fullKey = fullKeys[index];
        fullKeyCaps = fullKey.toUpperCase();
        fullKeyLower = fullKey.toLowerCase();
        fullKeyPlural = fullKey + 's';
        fullKeyCapsPlural = fullKeyCaps + 's';
        alias = aliases[index];
        assert.equal(moment.normalizeUnits(fullKey), fullKey, 'Testing full key ' + fullKey);
        assert.equal(moment.normalizeUnits(fullKeyCaps), fullKey, 'Testing full key capitalised ' + fullKey);
        assert.equal(moment.normalizeUnits(fullKeyPlural), fullKey, 'Testing full key plural ' + fullKey);
        assert.equal(moment.normalizeUnits(fullKeyCapsPlural), fullKey, 'Testing full key capitalised and plural ' + fullKey);
        assert.equal(moment.normalizeUnits(alias), fullKey, 'Testing alias ' + fullKey);
    }
});

})));
