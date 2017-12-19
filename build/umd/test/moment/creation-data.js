
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

module$1('creation data');

test('valid date', function (assert) {
    var dat = moment('1992-10-22');
    var orig = dat.creationData();

    assert.equal(dat.isValid(), true, '1992-10-22 is valid');
    assert.equal(orig.input, '1992-10-22', 'original input is not correct.');
    assert.equal(orig.format, 'YYYY-MM-DD', 'original format is defined.');
    assert.equal(orig.locale._abbr, 'en', 'default locale is en');
    assert.equal(orig.isUTC, false, 'not a UTC date');
});

test('valid date at fr locale', function (assert) {
    var dat = moment('1992-10-22', 'YYYY-MM-DD', 'fr');
    var orig = dat.creationData();

    assert.equal(orig.locale._abbr, 'fr', 'locale is fr');
});

test('valid date with formats', function (assert) {
    var dat = moment('29-06-1995', ['MM-DD-YYYY', 'DD-MM', 'DD-MM-YYYY']);
    var orig = dat.creationData();

    assert.equal(orig.format, 'DD-MM-YYYY', 'DD-MM-YYYY format is defined.');
});

test('strict', function (assert) {
    assert.ok(moment('2015-01-02', 'YYYY-MM-DD', true).creationData().strict, 'strict is true');
    assert.ok(!moment('2015-01-02', 'YYYY-MM-DD').creationData().strict, 'strict is true');
});

})));
