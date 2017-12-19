
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

function objectKeys(obj) {
    if (Object.keys) {
        return Object.keys(obj);
    } else {
        // IE8
        var res = [], i;
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                res.push(i);
            }
        }
        return res;
    }
}

// Pick the first defined of two or three arguments.

function defineCommonLocaleTests(locale, options) {
    test('lenient day of month ordinal parsing', function (assert) {
        var i, ordinalStr, testMoment;
        for (i = 1; i <= 31; ++i) {
            ordinalStr = moment([2014, 0, i]).format('YYYY MM Do');
            testMoment = moment(ordinalStr, 'YYYY MM Do');
            assert.equal(testMoment.year(), 2014,
                    'lenient day of month ordinal parsing ' + i + ' year check');
            assert.equal(testMoment.month(), 0,
                    'lenient day of month ordinal parsing ' + i + ' month check');
            assert.equal(testMoment.date(), i,
                    'lenient day of month ordinal parsing ' + i + ' date check');
        }
    });

    test('lenient day of month ordinal parsing of number', function (assert) {
        var i, testMoment;
        for (i = 1; i <= 31; ++i) {
            testMoment = moment('2014 01 ' + i, 'YYYY MM Do');
            assert.equal(testMoment.year(), 2014,
                    'lenient day of month ordinal parsing of number ' + i + ' year check');
            assert.equal(testMoment.month(), 0,
                    'lenient day of month ordinal parsing of number ' + i + ' month check');
            assert.equal(testMoment.date(), i,
                    'lenient day of month ordinal parsing of number ' + i + ' date check');
        }
    });

    test('strict day of month ordinal parsing', function (assert) {
        var i, ordinalStr, testMoment;
        for (i = 1; i <= 31; ++i) {
            ordinalStr = moment([2014, 0, i]).format('YYYY MM Do');
            testMoment = moment(ordinalStr, 'YYYY MM Do', true);
            assert.ok(testMoment.isValid(), 'strict day of month ordinal parsing ' + i);
        }
    });

    test('meridiem invariant', function (assert) {
        var h, m, t1, t2;
        for (h = 0; h < 24; ++h) {
            for (m = 0; m < 60; m += 15) {
                t1 = moment.utc([2000, 0, 1, h, m]);
                t2 = moment.utc(t1.format('A h:mm'), 'A h:mm');
                assert.equal(t2.format('HH:mm'), t1.format('HH:mm'),
                        'meridiem at ' + t1.format('HH:mm'));
            }
        }
    });

    test('date format correctness', function (assert) {
        var data, tokens;
        data = moment.localeData()._longDateFormat;
        tokens = objectKeys(data);
        each(tokens, function (srchToken) {
            // Check each format string to make sure it does not contain any
            // tokens that need to be expanded.
            each(tokens, function (baseToken) {
                // strip escaped sequences
                var format = data[baseToken].replace(/(\[[^\]]*\])/g, '');
                assert.equal(false, !!~format.indexOf(srchToken),
                        'contains ' + srchToken + ' in ' + baseToken);
            });
        });
    });

    test('month parsing correctness', function (assert) {
        var i, m;

        if (locale === 'tr') {
            // I can't fix it :(
            expect(0);
            return;
        }
        function tester(format) {
            var r;
            r = moment(m.format(format), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format);
            r = moment(m.format(format).toLocaleUpperCase(), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' upper');
            r = moment(m.format(format).toLocaleLowerCase(), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' lower');

            r = moment(m.format(format), format, true);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' strict');
            r = moment(m.format(format).toLocaleUpperCase(), format, true);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' upper strict');
            r = moment(m.format(format).toLocaleLowerCase(), format, true);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' lower strict');
        }

        for (i = 0; i < 12; ++i) {
            m = moment([2015, i, 15, 18]);
            tester('MMM');
            tester('MMM.');
            tester('MMMM');
            tester('MMMM.');
        }
    });

    test('weekday parsing correctness', function (assert) {
        var i, m;

        if (locale === 'tr' || locale === 'az' || locale === 'ro' || locale === 'mt') {
            // tr, az: There is a lower-case letter (ı), that converted to
            // upper then lower changes to i
            // ro: there is the letter ț which behaves weird under IE8
            // mt: letter Ħ
            expect(0);
            return;
        }
        function tester(format) {
            var r, baseMsg = 'weekday ' + m.weekday() + ' fmt ' + format + ' ' + m.toISOString();
            r = moment(m.format(format), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg);
            r = moment(m.format(format).toLocaleUpperCase(), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' upper');
            r = moment(m.format(format).toLocaleLowerCase(), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower');
            r = moment(m.format(format), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' strict');
            r = moment(m.format(format).toLocaleUpperCase(), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' upper strict');
            r = moment(m.format(format).toLocaleLowerCase(), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower strict');
        }

        for (i = 0; i < 7; ++i) {
            m = moment.utc([2015, 0, i + 1, 18]);
            tester('dd');
            tester('ddd');
            tester('dddd');
        }
    });

    test('valid localeData', function (assert) {
        assert.equal(moment().localeData().months().length, 12, 'months should return 12 months');
        assert.equal(moment().localeData().monthsShort().length, 12, 'monthsShort should return 12 months');
        assert.equal(moment().localeData().weekdays().length, 7, 'weekdays should return 7 days');
        assert.equal(moment().localeData().weekdaysShort().length, 7, 'weekdaysShort should return 7 days');
        assert.equal(moment().localeData().weekdaysMin().length, 7, 'monthsShort should return 7 days');
    });
}

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



function localeModule (name, lifecycle) {
    QUnit.module('locale:' + name, {
        setup : function () {
            moment.locale(name);
            moment.createFromInputFallback = function (config) {
                throw new Error('input not handled by moment: ' + config._i);
            };
            setupDeprecationHandler(test, moment, 'locale');
            if (lifecycle && lifecycle.setup) {
                lifecycle.setup();
            }
        },
        teardown : function () {
            moment.locale('en');
            teardownDeprecationHandler(test, moment, 'locale');
            if (lifecycle && lifecycle.teardown) {
                lifecycle.teardown();
            }
        }
    });
    defineCommonLocaleTests(name, -1, -1);
}

localeModule('ta');

test('parse', function (assert) {
    var tests = 'ஜனவரி ஜனவரி_பிப்ரவரி பிப்ரவரி_மார்ச் மார்ச்_ஏப்ரல் ஏப்ரல்_மே மே_ஜூன் ஜூன்_ஜூலை ஜூலை_ஆகஸ்ட் ஆகஸ்ட்_செப்டெம்பர் செப்டெம்பர்_அக்டோபர் அக்டோபர்_நவம்பர் நவம்பர்_டிசம்பர் டிசம்பர்'.split('_'), i;
    function equalTest(input, mmm, i) {
        assert.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
    }
    for (i = 0; i < 12; i++) {
        tests[i] = tests[i].split(' ');
        equalTest(tests[i][0], 'MMM', i);
        equalTest(tests[i][1], 'MMM', i);
        equalTest(tests[i][0], 'MMMM', i);
        equalTest(tests[i][1], 'MMMM', i);
        equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
        equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
        equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
        equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
    }
});

test('format', function (assert) {
    var a = [
            ['dddd, MMMM Do YYYY, h:mm:ss a', 'ஞாயிற்றுக்கிழமை, பிப்ரவரி ௧௪வது ௨௦௧௦, ௩:௨௫:௫௦  எற்பாடு'],
            ['ddd, hA',                       'ஞாயிறு, ௩ எற்பாடு'],
            ['M Mo MM MMMM MMM',              '௨ ௨வது ௦௨ பிப்ரவரி பிப்ரவரி'],
            ['YYYY YY',                       '௨௦௧௦ ௧௦'],
            ['D Do DD',                       '௧௪ ௧௪வது ௧௪'],
            ['d do dddd ddd dd',              '௦ ௦வது ஞாயிற்றுக்கிழமை ஞாயிறு ஞா'],
            ['DDD DDDo DDDD',                 '௪௫ ௪௫வது ௦௪௫'],
            ['w wo ww',                       '௮ ௮வது ௦௮'],
            ['h hh',                          '௩ ௦௩'],
            ['H HH',                          '௧௫ ௧௫'],
            ['m mm',                          '௨௫ ௨௫'],
            ['s ss',                          '௫௦ ௫௦'],
            ['a A',                           ' எற்பாடு  எற்பாடு'],
            ['[ஆண்டின்] DDDo  [நாள்]', 'ஆண்டின் ௪௫வது  நாள்'],
            ['LTS',                           '௧௫:௨௫:௫௦'],
            ['L',                             '௧௪/௦௨/௨௦௧௦'],
            ['LL',                            '௧௪ பிப்ரவரி ௨௦௧௦'],
            ['LLL',                           '௧௪ பிப்ரவரி ௨௦௧௦, ௧௫:௨௫'],
            ['LLLL',                          'ஞாயிற்றுக்கிழமை, ௧௪ பிப்ரவரி ௨௦௧௦, ௧௫:௨௫'],
            ['l',                             '௧௪/௨/௨௦௧௦'],
            ['ll',                            '௧௪ பிப்ரவரி ௨௦௧௦'],
            ['lll',                           '௧௪ பிப்ரவரி ௨௦௧௦, ௧௫:௨௫'],
            ['llll',                          'ஞாயிறு, ௧௪ பிப்ரவரி ௨௦௧௦, ௧௫:௨௫']
        ],
        b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
        i;
    for (i = 0; i < a.length; i++) {
        assert.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
    }
});

test('format ordinal', function (assert) {
    assert.equal(moment([2011, 0, 1]).format('DDDo'), '௧வது', '௧வது');
    assert.equal(moment([2011, 0, 2]).format('DDDo'), '௨வது', '௨வது');
    assert.equal(moment([2011, 0, 3]).format('DDDo'), '௩வது', '௩வது');
    assert.equal(moment([2011, 0, 4]).format('DDDo'), '௪வது', '௪வது');
    assert.equal(moment([2011, 0, 5]).format('DDDo'), '௫வது', '௫வது');
    assert.equal(moment([2011, 0, 6]).format('DDDo'), '௬வது', '௬வது');
    assert.equal(moment([2011, 0, 7]).format('DDDo'), '௭வது', '௭வது');
    assert.equal(moment([2011, 0, 8]).format('DDDo'), '௮வது', '௮வது');
    assert.equal(moment([2011, 0, 9]).format('DDDo'), '௯வது', '௯வது');
    assert.equal(moment([2011, 0, 10]).format('DDDo'), '௧௦வது', '௧௦வது');

    assert.equal(moment([2011, 0, 11]).format('DDDo'), '௧௧வது', '௧௧வது');
    assert.equal(moment([2011, 0, 12]).format('DDDo'), '௧௨வது', '௧௨வது');
    assert.equal(moment([2011, 0, 13]).format('DDDo'), '௧௩வது', '௧௩வது');
    assert.equal(moment([2011, 0, 14]).format('DDDo'), '௧௪வது', '௧௪வது');
    assert.equal(moment([2011, 0, 15]).format('DDDo'), '௧௫வது', '௧௫வது');
    assert.equal(moment([2011, 0, 16]).format('DDDo'), '௧௬வது', '௧௬வது');
    assert.equal(moment([2011, 0, 17]).format('DDDo'), '௧௭வது', '௧௭வது');
    assert.equal(moment([2011, 0, 18]).format('DDDo'), '௧௮வது', '௧௮வது');
    assert.equal(moment([2011, 0, 19]).format('DDDo'), '௧௯வது', '௧௯வது');
    assert.equal(moment([2011, 0, 20]).format('DDDo'), '௨௦வது', '௨௦வது');

    assert.equal(moment([2011, 0, 21]).format('DDDo'), '௨௧வது', '௨௧வது');
    assert.equal(moment([2011, 0, 22]).format('DDDo'), '௨௨வது', '௨௨வது');
    assert.equal(moment([2011, 0, 23]).format('DDDo'), '௨௩வது', '௨௩வது');
    assert.equal(moment([2011, 0, 24]).format('DDDo'), '௨௪வது', '௨௪வது');
    assert.equal(moment([2011, 0, 25]).format('DDDo'), '௨௫வது', '௨௫வது');
    assert.equal(moment([2011, 0, 26]).format('DDDo'), '௨௬வது', '௨௬வது');
    assert.equal(moment([2011, 0, 27]).format('DDDo'), '௨௭வது', '௨௭வது');
    assert.equal(moment([2011, 0, 28]).format('DDDo'), '௨௮வது', '௨௮வது');
    assert.equal(moment([2011, 0, 29]).format('DDDo'), '௨௯வது', '௨௯வது');
    assert.equal(moment([2011, 0, 30]).format('DDDo'), '௩௦வது', '௩௦வது');

    assert.equal(moment([2011, 0, 31]).format('DDDo'), '௩௧வது', '௩௧வது');
});

test('format month', function (assert) {
    var expected = 'ஜனவரி ஜனவரி_பிப்ரவரி பிப்ரவரி_மார்ச் மார்ச்_ஏப்ரல் ஏப்ரல்_மே மே_ஜூன் ஜூன்_ஜூலை ஜூலை_ஆகஸ்ட் ஆகஸ்ட்_செப்டெம்பர் செப்டெம்பர்_அக்டோபர் அக்டோபர்_நவம்பர் நவம்பர்_டிசம்பர் டிசம்பர்'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, i, 1]).format('MMMM MMM'), expected[i], expected[i]);
    }
});

test('format week', function (assert) {
    var expected = 'ஞாயிற்றுக்கிழமை ஞாயிறு ஞா_திங்கட்கிழமை திங்கள் தி_செவ்வாய்கிழமை செவ்வாய் செ_புதன்கிழமை புதன் பு_வியாழக்கிழமை வியாழன் வி_வெள்ளிக்கிழமை வெள்ளி வெ_சனிக்கிழமை சனி ச'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, 0, 2 + i]).format('dddd ddd dd'), expected[i], expected[i]);
    }
});

test('from', function (assert) {
    var start = moment([2007, 1, 28]);
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 44}), true),  'ஒரு சில விநாடிகள்', '44 விநாடிகள் = ஒரு சில விநாடிகள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 45}), true),  'ஒரு நிமிடம்',      '45 விநாடிகள் = ஒரு நிமிடம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 89}), true),  'ஒரு நிமிடம்',      '89 விநாடிகள் = ஒரு நிமிடம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 90}), true),  '௨ நிமிடங்கள்',     '90 விநாடிகள் = ௨ நிமிடங்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 44}), true),  '௪௪ நிமிடங்கள்',    '44 நிமிடங்கள் = 44 நிமிடங்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 45}), true),  'ஒரு மணி நேரம்',       '45 நிமிடங்கள் = ஒரு மணி நேரம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 89}), true),  'ஒரு மணி நேரம்',       '89 நிமிடங்கள் = ஒரு மணி நேரம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 90}), true),  '௨ மணி நேரம்',       '90 நிமிடங்கள் = ௨ மணி நேரம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 5}), true),   '௫ மணி நேரம்',       '5 மணி நேரம் = 5 மணி நேரம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 21}), true),  '௨௧ மணி நேரம்',      '௨௧ மணி நேரம் = ௨௧ மணி நேரம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 22}), true),  'ஒரு நாள்',         '௨௨ மணி நேரம் = ஒரு நாள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 35}), true),  'ஒரு நாள்',         '௩5 மணி நேரம் = ஒரு நாள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 36}), true),  '௨ நாட்கள்',        '௩6 மணி நேரம் = ௨ days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 1}), true),   'ஒரு நாள்',         '௧ நாள் = ஒரு நாள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 5}), true),   '௫ நாட்கள்',        '5 நாட்கள் = 5 நாட்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 25}), true),  '௨௫ நாட்கள்',       '௨5 நாட்கள் = ௨5 நாட்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 26}), true),  'ஒரு மாதம்',       '௨6 நாட்கள் = ஒரு மாதம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 30}), true),  'ஒரு மாதம்',       '௩0 நாட்கள் = ஒரு மாதம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 43}), true),  'ஒரு மாதம்',       '45 நாட்கள் = ஒரு மாதம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 46}), true),  '௨ மாதங்கள்',      '46 நாட்கள் = ௨ மாதங்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 74}), true),  '௨ மாதங்கள்',      '75 நாட்கள் = ௨ மாதங்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 76}), true),  '௩ மாதங்கள்',      '76 நாட்கள் = ௩ மாதங்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 1}), true),   'ஒரு மாதம்',       '௧ மாதம் = ஒரு மாதம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 5}), true),   '௫ மாதங்கள்',      '5 மாதங்கள் = 5 மாதங்கள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 345}), true), 'ஒரு வருடம்',        '௩45 நாட்கள் = ஒரு வருடம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 548}), true), '௨ ஆண்டுகள்',       '548 நாட்கள் = ௨ ஆண்டுகள்');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 1}), true),   'ஒரு வருடம்',        '௧ வருடம் = ஒரு வருடம்');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 5}), true),   '௫ ஆண்டுகள்',       '5 ஆண்டுகள் = 5 ஆண்டுகள்');
});

test('suffix', function (assert) {
    assert.equal(moment(30000).from(0), 'ஒரு சில விநாடிகள் இல்',  'prefix');
    assert.equal(moment(0).from(30000), 'ஒரு சில விநாடிகள் முன்', 'suffix');
});

test('now from now', function (assert) {
    assert.equal(moment().fromNow(), 'ஒரு சில விநாடிகள் முன்',  'இப்போது இருந்து கடந்த காலத்தில் காட்ட வேண்டும்');
});

test('fromNow', function (assert) {
    assert.equal(moment().add({s: 30}).fromNow(), 'ஒரு சில விநாடிகள் இல்', 'ஒரு சில விநாடிகள் இல்');
    assert.equal(moment().add({d: 5}).fromNow(), '௫ நாட்கள் இல்', '5 நாட்கள் இல்');
});

test('calendar day', function (assert) {
    var a = moment().hours(12).minutes(0).seconds(0);

    assert.equal(moment(a).calendar(),                   'இன்று ௧௨:௦௦',   'இன்று  12:00');
    assert.equal(moment(a).add({m: 25}).calendar(),      'இன்று ௧௨:௨௫',   'இன்று  12:25');
    assert.equal(moment(a).add({h: 1}).calendar(),       'இன்று ௧௩:௦௦',   'இன்று  13:00');
    assert.equal(moment(a).add({d: 1}).calendar(),       'நாளை ௧௨:௦௦',    'நாளை  12:00');
    assert.equal(moment(a).subtract({h: 1}).calendar(),  'இன்று ௧௧:௦௦',   'இன்று  11:00');
    assert.equal(moment(a).subtract({d: 1}).calendar(),  'நேற்று ௧௨:௦௦',  'நேற்று  12:00');
});

test('calendar next week', function (assert) {
    var i, m;
    for (i = 2; i < 7; i++) {
        m = moment().add({d: i});
        assert.equal(m.calendar(),       m.format('dddd, LT'),  'Today + ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('dddd, LT'),  'Today + ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('dddd, LT'),  'Today + ' + i + ' days end of day');
    }
});

test('calendar last week', function (assert) {
    var i, m;

    for (i = 2; i < 7; i++) {
        m = moment().subtract({d: i});
        assert.equal(m.calendar(),       m.format('[கடந்த வாரம்] dddd, LT'),  'Today - ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('[கடந்த வாரம்] dddd, LT'),  'Today - ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('[கடந்த வாரம்] dddd, LT'),  'Today - ' + i + ' days end of day');
    }
});

test('calendar all else', function (assert) {
    var weeksAgo = moment().subtract({w: 1}),
        weeksFromNow = moment().add({w: 1});

    assert.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  '1 week ago');
    assert.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  'in 1 week');

    weeksAgo = moment().subtract({w: 2});
    weeksFromNow = moment().add({w: 2});

    assert.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  '2 weeks ago');
    assert.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  'in 2 weeks');
});

test('meridiem', function (assert) {
    assert.equal(moment([2011, 2, 23,  0, 30]).format('a'), ' யாமம்', '(after) midnight');
    assert.equal(moment([2011, 2, 23,  2, 30]).format('a'), ' வைகறை', 'before dawn');
    assert.equal(moment([2011, 2, 23,  9, 30]).format('a'), ' காலை', 'morning');
    assert.equal(moment([2011, 2, 23, 14, 30]).format('a'), ' எற்பாடு', 'during day');
    assert.equal(moment([2011, 2, 23, 17, 30]).format('a'), ' எற்பாடு', 'evening');
    assert.equal(moment([2011, 2, 23, 19, 30]).format('a'), ' மாலை', 'late evening');
    assert.equal(moment([2011, 2, 23, 23, 30]).format('a'), ' யாமம்', '(before) midnight');
});

})));
