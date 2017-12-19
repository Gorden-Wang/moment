
;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../../moment')) :
   typeof define === 'function' && define.amd ? define(['../../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

// Pick the first defined of two or three arguments.

/*global QUnit:false*/

var test = QUnit.test;

var expect = QUnit.expect;

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

test('isNumber recognizes numbers', function (assert) {
    assert.ok(isNumber(1), 'simple integer');
    assert.ok(isNumber(0), 'simple number');
    assert.ok(isNumber(-0), 'silly number');
    assert.ok(isNumber(1010010293029), 'large number');
    assert.ok(isNumber(Infinity), 'largest number');
    assert.ok(isNumber(-Infinity), 'smallest number');
    assert.ok(isNumber(NaN), 'not number');
    assert.ok(isNumber(1.100393830000), 'decimal numbers');
    assert.ok(isNumber(Math.LN2), 'natural log of two');
    assert.ok(isNumber(Math.PI), 'delicious number');
    assert.ok(isNumber(5e10), 'scientifically notated number');
    assert.ok(isNumber(new Number(1)), 'number primitive wrapped in an object'); // jshint ignore:line
});

test('isNumber rejects non-numbers', function (assert) {
    assert.ok(!isNumber(), 'nothing');
    assert.ok(!isNumber(undefined), 'undefined');
    assert.ok(!isNumber(null), 'null');
    assert.ok(!isNumber([1]), 'array');
    assert.ok(!isNumber('[1,2,3]'), 'string');
    assert.ok(!isNumber(new Date()), 'date');
    assert.ok(!isNumber({a:1,b:2}), 'object');
});

})));
