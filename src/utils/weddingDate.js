export function getPrimaryDate(data) {
  return data.events?.[0]?.solarDate || { day: '26', month: '11', year: '2026' };
}

export function formatWeddingDate(date) {
  return [date.day, date.month, date.year].map((part) => String(part).padStart(2, '0')).join('.');
}

export function getDayOfWeek(date) {
  const days = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
  return days[new Date(Date.UTC(Number(date.year), Number(date.month) - 1, Number(date.day))).getUTCDay()];
}

const compactDate = (milliseconds) => new Date(milliseconds).toISOString().replace(/[-:]/g, '').slice(0, 15);
const compactMilliseconds = (value) => {
  const parts = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(value || '');
  return parts ? Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6]) : NaN;
};

export function getEventCalendar(event, couple) {
  const { solarDate } = event;
  const year = Number(solarDate.year);
  const month = Number(solarDate.month);
  const day = Number(solarDate.day);
  const time = String(event.time || '').match(/\d+/g);
  const hours = time ? Number(time[0]) : Number(event.calendarEvent?.startDate?.slice(9, 11) || 0);
  const minutes = time ? Number(time[1] || 0) : Number(event.calendarEvent?.startDate?.slice(11, 13) || 0);
  const start = Date.UTC(year, month - 1, day, hours, minutes);
  const check = new Date(start);
  if (year < 1000 || year > 9999 || check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month ||
      check.getUTCDate() !== day || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Ngày hoặc giờ tổ chức chưa hợp lệ.');
  }
  const oldDuration = compactMilliseconds(event.calendarEvent?.endDate) - compactMilliseconds(event.calendarEvent?.startDate);
  const duration = oldDuration > 0 && oldDuration <= 86400000 ? oldDuration : 3 * 3600000;
  return {
    ...event.calendarEvent,
    title: couple ? `${event.title} - ${couple.groom.name} & ${couple.bride.name}` : event.calendarEvent?.title || event.title,
    location: event.venue?.address || event.calendarEvent?.location || '',
    startDate: compactDate(start), endDate: compactDate(start + duration),
  };
}

export function getCountdownTarget(data) {
  // Vietnam's timezone is explicit for guests abroad. Event edits update the countdown.
  const start = data.events?.[0] ? getEventCalendar(data.events[0]).startDate : null;
  if (/^\d{8}T\d{6}$/.test(start || '')) {
    return `${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}T${start.slice(9, 11)}:${start.slice(11, 13)}:${start.slice(13, 15)}+07:00`;
  }
  const target = data.targetDate || '2026-11-26T17:30:00+07:00';
  return /(?:Z|[+-]\d{2}:?\d{2})$/.test(target) ? target : `${target}+07:00`;
}
