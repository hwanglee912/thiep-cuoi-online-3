import React, { useEffect, useId, useRef, useState } from 'react';
import { Upload, RotateCcw } from 'lucide-react';
import { isImageSource, prepareUploadedImage } from '../utils/imageUpload';

export default function ImageSourceEditor({ title, value, onChange, defaultValue, position, onPositionChange, onBusyChange, children }) {
  const id = useId();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value);
  useEffect(() => {
    setError('');
    const timer = setTimeout(() => setPreview(value), 250);
    return () => clearTimeout(timer);
  }, [value]);
  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true); setError(''); onBusyChange(true);
    try { onChange(await prepareUploadedImage(file)); }
    catch (reason) { setError(reason.message); }
    finally { setBusy(false); onBusyChange(false); }
  };
  const [x = 50, y = 35] = (position || '50% 35%').match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  return <div className="admin-image-editor">
    <h5 className="font-serif font-semibold text-base text-gold-700">{title}</h5>
    <div className="admin-image-preview">
      {isImageSource(preview) ? <img src={preview} alt={`Xem trước ${title.toLowerCase()}`} decoding="async" loading="lazy"
        style={{ objectPosition: position || '50% 50%' }} onError={() => setError('Không tải được ảnh xem trước. Bạn hãy kiểm tra đường dẫn hoặc chọn file khác.')} />
        : <span>Chưa chọn ảnh</span>}
    </div>
    <div className="flex flex-wrap gap-2">
      <button type="button" className="admin-image-button" disabled={busy} onClick={() => fileRef.current.click()} aria-label={`Thay ${title.toLowerCase()} từ thiết bị`}><Upload size={16} />{busy ? 'Đang xử lý ảnh…' : 'Chọn ảnh từ thiết bị'}</button>
      <input ref={fileRef} type="file" accept="image/*" aria-label={`Tải ${title.toLowerCase()}`} className="hidden" onChange={upload} disabled={busy} />
      {defaultValue && <button type="button" className="admin-image-reset" disabled={busy} onClick={() => onChange(defaultValue)} aria-label={`Khôi phục ${title.toLowerCase()}`}><RotateCcw size={16} />Ảnh gốc</button>}
    </div>
    <label htmlFor={`${id}-src`} className="block text-xs">Đường dẫn {title.toLowerCase()}</label>
    <input id={`${id}-src`} type="text" className="admin-image-input" disabled={busy} value={value?.startsWith('data:') ? '' : value || ''}
      placeholder={value?.startsWith('data:') ? 'Đã chọn ảnh từ thiết bị' : 'https://… hoặc /assets/ten-anh.webp'} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
    {onPositionChange && <div className="grid grid-cols-2 gap-3">
      <label className="text-xs">Vị trí ngang
        <input className="admin-image-range" type="range" min="0" max="100" value={x} aria-label={`Vị trí ngang ${title.toLowerCase()}`} onChange={(event) => onPositionChange(`${event.target.value}% ${y}%`)} />
      </label>
      <label className="text-xs">Vị trí dọc
        <input className="admin-image-range" type="range" min="0" max="100" value={y} aria-label={`Vị trí dọc ${title.toLowerCase()}`} onChange={(event) => onPositionChange(`${x}% ${event.target.value}%`)} />
      </label>
    </div>}
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    {children}
  </div>;
}
