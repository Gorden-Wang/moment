
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

function isNearSpringDST() {
    return moment().subtract(1, 'day').utcOffset() !== moment().add(1, 'day').utcOffset();
}

module$1('zone switching');

test('local to utc, keepLocalTime = true', function (assert) {
    var m = moment(),
        fmt = 'YYYY-DD-MM HH:mm:ss';
    assert.equal(m.clone().utc(true).format(fmt), m.format(fmt), 'local to utc failed to keep local time');
});

test('local to utc, keepLocalTime = false', function (assert) {
    var m = moment();
    assert.equal(m.clone().utc().valueOf(), m.valueOf(), 'local to utc failed to keep utc time (implicit)');
    assert.equal(m.clone().utc(false).valueOf(), m.valueOf(), 'local to utc failed to keep utc time (explicit)');
});

test('local to zone, keepLocalTime = true', function (assert) {
    test.expectedDeprecations('moment().zone');
    var m = moment(),
        fmt = 'YYYY-DD-MM HH:mm:ss',
        z;

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (z = -12; z <= 14; ++z) {
        assert.equal(m.clone().zone(z * 60, true).format(fmt), m.format(fmt),
                'local to zone(' + z + ':00) failed to keep local time');
    }
});

test('local to zone, keepLocalTime = false', function (assert) {
    test.expectedDeprecations('moment().zone');
    var m = moment(),
        z;

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (z = -12; z <= 14; ++z) {
        assert.equal(m.clone().zone(z * 60).valueOf(), m.valueOf(),
                'local to zone(' + z + ':00) failed to keep utc time (implicit)');
        assert.equal(m.clone().zone(z * 60, false).valueOf(), m.valueOf(),
                'local to zone(' + z + ':00) failed to keep utc time (explicit)');
    }
});

test('utc to local, keepLocalTime = true', function (assert) {
    // Don't test near the spring DST transition
    if (isNearSpringDST()) {
        expect(0);
        return;
    }

    var um = moment.utc(),
        fmt = 'YYYY-DD-MM HH:mm:ss';

    assert.equal(um.clone().local(true).format(fmt), um.format(fmt), 'utc to local failed to keep local time');
});

test('utc to local, keepLocalTime = false', function (assert) {
    var um = moment.utc();
    assert.equal(um.clone().local().valueOf(), um.valueOf(), 'utc to local failed to keep utc time (implicit)');
    assert.equal(um.clone().local(false).valueOf(), um.valueOf(), 'utc to local failed to keep utc time (explicit)');
});

test('zone to local, keepLocalTime = true', function (assert) {
    // Don't test near the spring DST transition
    if (isNearSpringDST()) {
        expect(0);
        return;
    }

    test.expectedDeprecations('moment().zone');

    var m = moment(),
        fmt = 'YYYY-DD-MM HH:mm:ss',
        z;

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (z = -12; z <= 14; ++z) {
        m.zone(z * 60);

        assert.equal(m.clone().local(true).format(fmt), m.format(fmt),
                'zone(' + z + ':00) to local failed to keep local time');
    }
});

test('zone to local, keepLocalTime = false', function (assert) {
    test.expectedDeprecations('moment().zone');
    var m = moment(),
        z;

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (z = -12; z <= 14; ++z) {
        m.zone(z * 60);

        assert.equal(m.clone().local(false).valueOf(), m.valueOf(),
                'zone(' + z + ':00) to local failed to keep utc time (explicit)');
        assert.equal(m.clone().local().valueOf(), m.valueOf(),
                'zone(' + z + ':00) to local failed to keep utc time (implicit)');
    }
});

})));
