
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

module$1('from_to');

test('from', function (assert) {
    var start = moment();
    moment.locale('en');
    assert.equal(start.from(start.clone().add(5, 'seconds')),  'a few seconds ago', '5 seconds = a few seconds ago');
    assert.equal(start.from(start.clone().add(1, 'minute')),  'a minute ago', '1 minute = a minute ago');
    assert.equal(start.from(start.clone().add(5, 'minutes')),  '5 minutes ago', '5 minutes = 5 minutes ago');

    assert.equal(start.from(start.clone().subtract(5, 'seconds')),  'in a few seconds', '5 seconds = in a few seconds');
    assert.equal(start.from(start.clone().subtract(1, 'minute')),  'in a minute', '1 minute = in a minute');
    assert.equal(start.from(start.clone().subtract(5, 'minutes')),  'in 5 minutes', '5 minutes = in 5 minutes');
});

test('from with absolute duration', function (assert) {
    var start = moment();
    moment.locale('en');
    assert.equal(start.from(start.clone().add(5, 'seconds'), true),  'a few seconds', '5 seconds = a few seconds');
    assert.equal(start.from(start.clone().add(1, 'minute'), true),  'a minute', '1 minute = a minute');
    assert.equal(start.from(start.clone().add(5, 'minutes'), true),  '5 minutes', '5 minutes = 5 minutes');

    assert.equal(start.from(start.clone().subtract(5, 'seconds'), true),  'a few seconds', '5 seconds = a few seconds');
    assert.equal(start.from(start.clone().subtract(1, 'minute'), true),  'a minute', '1 minute = a minute');
    assert.equal(start.from(start.clone().subtract(5, 'minutes'), true),  '5 minutes', '5 minutes = 5 minutes');
});

test('to', function (assert) {
    var start = moment();
    moment.locale('en');
    assert.equal(start.to(start.clone().subtract(5, 'seconds')),  'a few seconds ago', '5 seconds = a few seconds ago');
    assert.equal(start.to(start.clone().subtract(1, 'minute')),  'a minute ago', '1 minute = a minute ago');
    assert.equal(start.to(start.clone().subtract(5, 'minutes')),  '5 minutes ago', '5 minutes = 5 minutes ago');

    assert.equal(start.to(start.clone().add(5, 'seconds')),  'in a few seconds', '5 seconds = in a few seconds');
    assert.equal(start.to(start.clone().add(1, 'minute')),  'in a minute', '1 minute = in a minute');
    assert.equal(start.to(start.clone().add(5, 'minutes')),  'in 5 minutes', '5 minutes = in 5 minutes');
});

test('to with absolute duration', function (assert) {
    var start = moment();
    moment.locale('en');
    assert.equal(start.to(start.clone().add(5, 'seconds'), true),  'a few seconds', '5 seconds = a few seconds');
    assert.equal(start.to(start.clone().add(1, 'minute'), true),  'a minute', '1 minute = a minute');
    assert.equal(start.to(start.clone().add(5, 'minutes'), true),  '5 minutes', '5 minutes = 5 minutes');

    assert.equal(start.to(start.clone().subtract(5, 'seconds'), true),  'a few seconds', '5 seconds = a few seconds');
    assert.equal(start.to(start.clone().subtract(1, 'minute'), true),  'a minute', '1 minute = a minute');
    assert.equal(start.to(start.clone().subtract(5, 'minutes'), true),  '5 minutes', '5 minutes = 5 minutes');
});

})));
