/**
 * Calendar utilities to generate Google Calendar URLs and download ICS files
 */

export function generateGoogleCalendarUrl(event) {
  const { title, startDate, endDate, details, location } = event;
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: title,
    dates: `${startDate}/${endDate}`,
    details: details,
    location: location,
    ctz: 'Asia/Ho_Chi_Minh',
  });
  return `${baseUrl}&${params.toString()}`;
}

const escapeText = (value = '') => String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const utcTimestamp = (value) => {
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(value);
  if (!match) return value;
  return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4] - 7, +match[5], +match[6]))
    .toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
};
const foldLine = (line) => {
  const encoder = new TextEncoder();
  let length = 0;
  let folded = '';
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (length + size > 75) { folded += '\r\n '; length = 1; }
    folded += char;
    length += size;
  }
  return folded;
};

export function createIcsContent(event) {
  const { title, startDate, endDate, details, location } = event;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DamCuoiOnline//WeddingInvitation//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${startDate}-${encodeURIComponent(title)}@wedding-invitation`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(details)}`,
    `LOCATION:${escapeText(location)}`,
    `DTSTART:${utcTimestamp(startDate)}`,
    `DTEND:${utcTimestamp(endDate)}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].map(foldLine).join("\r\n") + '\r\n';
}

export function downloadIcsFile(event) {
  const icsContent = createIcsContent(event);

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
