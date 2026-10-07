export function getGuestName(data, search = '') {
  const personalName = new URLSearchParams(search).get('guest')?.trim();
  return (personalName || data.invitation?.guestName?.trim() || 'Khách mời').slice(0, 120);
}

export function getGuestInvitationUrl(href, guestName) {
  const url = new URL(href);
  url.searchParams.set('guest', guestName.trim() || 'Khách mời');
  url.hash = '';
  return url.toString();
}
