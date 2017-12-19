
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

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

test('isArray recognizes Array objects', function (assert) {
    assert.ok(isArray([1,2,3]), 'array args');
    assert.ok(isArray([]), 'empty array');
    assert.ok(isArray(new Array(1,2,3)), 'array constructor');
});

test('isArray rejects non-Array objects', function (assert) {
    assert.ok(!isArray(), 'nothing');
    assert.ok(!isArray(undefined), 'undefined');
    assert.ok(!isArray(null), 'null');
    assert.ok(!isArray(123), 'number');
    assert.ok(!isArray('[1,2,3]'), 'string');
    assert.ok(!isArray(new Date()), 'date');
    assert.ok(!isArray({a:1,b:2}), 'object');
});

})));
