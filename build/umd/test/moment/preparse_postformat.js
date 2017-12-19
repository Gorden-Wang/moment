
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

var symbolMap = {
        '1': '!',
        '2': '@',
        '3': '#',
        '4': '$',
        '5': '%',
        '6': '^',
        '7': '&',
        '8': '*',
        '9': '(',
        '0': ')'
    };
var numberMap = {
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0'
    };

module$1('preparse and postformat', {
    setup: function () {
        moment.locale('symbol', {
            preparse: function (string) {
                return string.replace(/[!@#$%\^&*()]/g, function (match) {
                    return numberMap[match];
                });
            },

            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            }
        });
    },
    teardown: function () {
        moment.defineLocale('symbol', null);
    }
});

test('transform', function (assert) {
    assert.equal(moment.utc('@)!@-)*-@&', 'YYYY-MM-DD').unix(), 1346025600, 'preparse string + format');
    assert.equal(moment.utc('@)!@-)*-@&').unix(), 1346025600, 'preparse ISO8601 string');
    assert.equal(moment.unix(1346025600).utc().format('YYYY-MM-DD'), '@)!@-)*-@&', 'postformat');
});

test('transform from', function (assert) {
    var start = moment([2007, 1, 28]);

    assert.equal(start.from(moment([2007, 1, 28]).add({s: 90}), true), '@ minutes', 'postformat should work on moment.fn.from');
    assert.equal(moment().add(6, 'd').fromNow(true), '^ days', 'postformat should work on moment.fn.fromNow');
    assert.equal(moment.duration(10, 'h').humanize(), '!) hours', 'postformat should work on moment.duration.fn.humanize');
});

test('calendar day', function (assert) {
    var a = moment().hours(12).minutes(0).seconds(0);

    assert.equal(moment(a).calendar(),                   'Today at !@:)) PM',     'today at the same time');
    assert.equal(moment(a).add({m: 25}).calendar(),      'Today at !@:@% PM',     'Now plus 25 min');
    assert.equal(moment(a).add({h: 1}).calendar(),       'Today at !:)) PM',      'Now plus 1 hour');
    assert.equal(moment(a).add({d: 1}).calendar(),       'Tomorrow at !@:)) PM',  'tomorrow at the same time');
    assert.equal(moment(a).subtract({h: 1}).calendar(),  'Today at !!:)) AM',     'Now minus 1 hour');
    assert.equal(moment(a).subtract({d: 1}).calendar(),  'Yesterday at !@:)) PM', 'yesterday at the same time');
});

})));
