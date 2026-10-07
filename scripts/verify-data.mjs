import assert from 'node:assert/strict';
import test from 'node:test';
import { weddingData } from '../src/config/weddingData.js';
import { getCountdownTarget, getDayOfWeek, getEventCalendar } from '../src/utils/weddingDate.js';
import { createIcsContent, generateGoogleCalendarUrl } from '../src/utils/calendar.js';

test('date edits update the countdown and calendar together in Vietnam time', () => {
  const data = structuredClone(weddingData);
  data.events[0].solarDate = { day: '05', month: '12', year: '2026' };
  data.events[0].time = '09 GIỜ 15 PHÚT';
  const calendar = getEventCalendar(data.events[0], data.couple);
  assert.equal(calendar.startDate, '20261205T091500');
  assert.equal(calendar.endDate, '20261205T124500');
  assert.equal(getDayOfWeek(data.events[0].solarDate), 'THỨ BẢY');
  assert.equal(new Date(getCountdownTarget(data)).toISOString(), '2026-12-05T02:15:00.000Z');
  const url = new URL(generateGoogleCalendarUrl(calendar));
  assert.equal(url.searchParams.get('dates'), '20261205T091500/20261205T124500');
  assert.equal(url.searchParams.get('ctz'), 'Asia/Ho_Chi_Minh');
});

test('invalid dates and times cannot silently roll into a different day', () => {
  const event = structuredClone(weddingData.events[0]);
  event.solarDate = { day: '31', month: '02', year: '2026' };
  assert.throws(() => getEventCalendar(event));
  event.solarDate = { day: '26', month: '11', year: '2026' };
  event.time = '25:00';
  assert.throws(() => getEventCalendar(event));
});

test('ICS exports keep Vietnam event times correct for guests in other timezones', () => {
  const contents = createIcsContent(getEventCalendar(weddingData.events[0], weddingData.couple));
  assert.match(contents, /DTSTART:20261126T103000Z/);
  assert.match(contents, /DTEND:20261126T140000Z/);
  assert.match(contents, /DTSTAMP:\d{8}T\d{6}Z/);
  assert.match(contents, /UID:/);
});

test('ICS text escapes punctuation and folds Vietnamese without splitting characters', () => {
  const event = { ...weddingData.events[0].calendarEvent,
    title: 'Thiệp cưới tiếng Việt '.repeat(20), details: 'Đến chung vui; với chúng mình\nHẹn gặp bạn!', location: 'Hà Nội, Việt Nam' };
  const contents = createIcsContent(event);
  const unfolded = contents.replace(/\r\n /g, '');
  assert.match(unfolded, /DESCRIPTION:Đến chung vui\\; với chúng mình\\nHẹn gặp bạn!/);
  assert.match(unfolded, /LOCATION:Hà Nội\\, Việt Nam/);
  assert(!contents.includes('\ufffd'));
  contents.split('\r\n').forEach((line) => assert(new TextEncoder().encode(line).length <= 75));
});
