import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { getGuestInvitationUrl } from '../utils/guestInvitation';

export default function GuestInvitationEditor({ value, onChange }) {
  const [message, setMessage] = useState('');
  const link = getGuestInvitationUrl(window.location.href, value || '');
  useEffect(() => setMessage(''), [link]);
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(link); setMessage('Đã sao chép link mời riêng.'); }
    catch { setMessage('Chưa sao chép được. Bạn có thể chọn đường dẫn ở trên để sao chép.'); }
  };
  return <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-3">
    <h5 className="font-serif font-bold text-base text-gold-700">Tên khách mời</h5>
    <label className="block text-xs" htmlFor="admin-guest-name">Tên hiển thị trên lời mời</label>
    <input id="admin-guest-name" type="text" maxLength={120} className="admin-image-input" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="Ví dụ: Anh Minh & Chị Lan" />
    <p className="text-xs leading-relaxed">Lưu tên này làm tên mặc định. Bạn cũng có thể tạo link riêng cho từng khách; mỗi link hiển thị tên người nhận mà không đổi lời mời của khách khác.</p>
    <label className="block text-xs" htmlFor="admin-guest-link">Link mời riêng</label>
    <input id="admin-guest-link" type="text" readOnly value={link} className="admin-image-input" onFocus={(event) => event.target.select()} />
    <button type="button" className="admin-image-button" onClick={copyLink}><Copy size={16} />Sao chép link mời riêng</button>
    {message && <p role="status" className="text-sm">{message}</p>}
  </div>;
}
