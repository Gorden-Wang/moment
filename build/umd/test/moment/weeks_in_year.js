
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

module$1('weeks in year');

test('isoWeeksInYear', function (assert) {
    assert.equal(moment([2004]).isoWeeksInYear(), 53, '2004 has 53 iso weeks');
    assert.equal(moment([2005]).isoWeeksInYear(), 52, '2005 has 53 iso weeks');
    assert.equal(moment([2006]).isoWeeksInYear(), 52, '2006 has 53 iso weeks');
    assert.equal(moment([2007]).isoWeeksInYear(), 52, '2007 has 52 iso weeks');
    assert.equal(moment([2008]).isoWeeksInYear(), 52, '2008 has 53 iso weeks');
    assert.equal(moment([2009]).isoWeeksInYear(), 53, '2009 has 53 iso weeks');
    assert.equal(moment([2010]).isoWeeksInYear(), 52, '2010 has 52 iso weeks');
    assert.equal(moment([2011]).isoWeeksInYear(), 52, '2011 has 52 iso weeks');
    assert.equal(moment([2012]).isoWeeksInYear(), 52, '2012 has 52 iso weeks');
    assert.equal(moment([2013]).isoWeeksInYear(), 52, '2013 has 52 iso weeks');
    assert.equal(moment([2014]).isoWeeksInYear(), 52, '2014 has 52 iso weeks');
    assert.equal(moment([2015]).isoWeeksInYear(), 53, '2015 has 53 iso weeks');
});

test('weeksInYear doy/dow = 1/4', function (assert) {
    moment.locale('1/4', {week: {dow: 1, doy: 4}});

    assert.equal(moment([2004]).weeksInYear(), 53, '2004 has 53 weeks');
    assert.equal(moment([2005]).weeksInYear(), 52, '2005 has 53 weeks');
    assert.equal(moment([2006]).weeksInYear(), 52, '2006 has 53 weeks');
    assert.equal(moment([2007]).weeksInYear(), 52, '2007 has 52 weeks');
    assert.equal(moment([2008]).weeksInYear(), 52, '2008 has 53 weeks');
    assert.equal(moment([2009]).weeksInYear(), 53, '2009 has 53 weeks');
    assert.equal(moment([2010]).weeksInYear(), 52, '2010 has 52 weeks');
    assert.equal(moment([2011]).weeksInYear(), 52, '2011 has 52 weeks');
    assert.equal(moment([2012]).weeksInYear(), 52, '2012 has 52 weeks');
    assert.equal(moment([2013]).weeksInYear(), 52, '2013 has 52 weeks');
    assert.equal(moment([2014]).weeksInYear(), 52, '2014 has 52 weeks');
    assert.equal(moment([2015]).weeksInYear(), 53, '2015 has 53 weeks');
});

test('weeksInYear doy/dow = 6/12', function (assert) {
    moment.locale('6/12', {week: {dow: 6, doy: 12}});

    assert.equal(moment([2004]).weeksInYear(), 53, '2004 has 53 weeks');
    assert.equal(moment([2005]).weeksInYear(), 52, '2005 has 53 weeks');
    assert.equal(moment([2006]).weeksInYear(), 52, '2006 has 53 weeks');
    assert.equal(moment([2007]).weeksInYear(), 52, '2007 has 52 weeks');
    assert.equal(moment([2008]).weeksInYear(), 52, '2008 has 53 weeks');
    assert.equal(moment([2009]).weeksInYear(), 52, '2009 has 53 weeks');
    assert.equal(moment([2010]).weeksInYear(), 53, '2010 has 52 weeks');
    assert.equal(moment([2011]).weeksInYear(), 52, '2011 has 52 weeks');
    assert.equal(moment([2012]).weeksInYear(), 52, '2012 has 52 weeks');
    assert.equal(moment([2013]).weeksInYear(), 52, '2013 has 52 weeks');
    assert.equal(moment([2014]).weeksInYear(), 52, '2014 has 52 weeks');
    assert.equal(moment([2015]).weeksInYear(), 52, '2015 has 53 weeks');
});

test('weeksInYear doy/dow = 1/7', function (assert) {
    moment.locale('1/7', {week: {dow: 1, doy: 7}});

    assert.equal(moment([2004]).weeksInYear(), 52, '2004 has 53 weeks');
    assert.equal(moment([2005]).weeksInYear(), 52, '2005 has 53 weeks');
    assert.equal(moment([2006]).weeksInYear(), 53, '2006 has 53 weeks');
    assert.equal(moment([2007]).weeksInYear(), 52, '2007 has 52 weeks');
    assert.equal(moment([2008]).weeksInYear(), 52, '2008 has 53 weeks');
    assert.equal(moment([2009]).weeksInYear(), 52, '2009 has 53 weeks');
    assert.equal(moment([2010]).weeksInYear(), 52, '2010 has 52 weeks');
    assert.equal(moment([2011]).weeksInYear(), 52, '2011 has 52 weeks');
    assert.equal(moment([2012]).weeksInYear(), 53, '2012 has 52 weeks');
    assert.equal(moment([2013]).weeksInYear(), 52, '2013 has 52 weeks');
    assert.equal(moment([2014]).weeksInYear(), 52, '2014 has 52 weeks');
    assert.equal(moment([2015]).weeksInYear(), 52, '2015 has 53 weeks');
});

test('weeksInYear doy/dow = 0/6', function (assert) {
    moment.locale('0/6', {week: {dow: 0, doy: 6}});

    assert.equal(moment([2004]).weeksInYear(), 52, '2004 has 53 weeks');
    assert.equal(moment([2005]).weeksInYear(), 53, '2005 has 53 weeks');
    assert.equal(moment([2006]).weeksInYear(), 52, '2006 has 53 weeks');
    assert.equal(moment([2007]).weeksInYear(), 52, '2007 has 52 weeks');
    assert.equal(moment([2008]).weeksInYear(), 52, '2008 has 53 weeks');
    assert.equal(moment([2009]).weeksInYear(), 52, '2009 has 53 weeks');
    assert.equal(moment([2010]).weeksInYear(), 52, '2010 has 52 weeks');
    assert.equal(moment([2011]).weeksInYear(), 53, '2011 has 52 weeks');
    assert.equal(moment([2012]).weeksInYear(), 52, '2012 has 52 weeks');
    assert.equal(moment([2013]).weeksInYear(), 52, '2013 has 52 weeks');
    assert.equal(moment([2014]).weeksInYear(), 52, '2014 has 52 weeks');
    assert.equal(moment([2015]).weeksInYear(), 52, '2015 has 53 weeks');
});

})));
