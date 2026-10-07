import React, { useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageSourceEditor from './ImageSourceEditor';
import { weddingData as defaults } from '../config/weddingData';
import { isImageSource, prepareUploadedImage } from '../utils/imageUpload';

const slots = [
  { title: 'Ảnh bìa', path: ['couple', 'heroImage'], crop: ['couple', 'heroImagePosition'] },
  { title: 'Ảnh chú rể', path: ['couple', 'groom', 'avatar'], crop: ['couple', 'groom', 'imagePosition'] },
  { title: 'Ảnh cô dâu', path: ['couple', 'bride', 'avatar'], crop: ['couple', 'bride', 'imagePosition'] },
  { title: 'Nền lịch', path: ['couple', 'calendarImage'], crop: ['couple', 'calendarImagePosition'] },
  { title: 'Nền lời mời', path: ['couple', 'invitationBackground'] },
  { title: 'Biểu tượng nhẫn cưới', path: ['couple', 'eventIconImage'] },
];
const readPath = (object, path) => path.reduce((value, key) => value?.[key], object);
const writePath = (object, [key, ...rest], value) => ({ ...object, [key]: rest.length ? writePath(object[key], rest, value) : value });

export function createAdminDraft(data) {
  return { ...structuredClone(data), gallery: data.gallery.map((photo) => ({ ...photo, id: photo.id || crypto.randomUUID() })) };
}

export default function AdminImagePanel({ formData, setFormData, onBusyChange }) {
  const fileRef = useRef(null);
  const [newSource, setNewSource] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const changePath = (path, value) => setFormData((current) => writePath(current, path, value));
  const changePhoto = (id, changes) => setFormData((current) => {
    const original = current.gallery.find((photo) => photo.id === id);
    const gallery = current.gallery.map((photo) => photo.id === id ? { ...photo, ...changes } : photo);
    const wasCover = current.galleryCoverId ? current.galleryCoverId === id : current.galleryCoverImage === original?.src;
    return { ...current, gallery, ...(wasCover && changes.src !== undefined ? { galleryCoverImage: changes.src, galleryCoverId: id } : {}) };
  });
  const addPhoto = (src) => {
    const photo = { id: crypto.randomUUID(), src, alt: 'Ảnh kỷ niệm mới', caption: 'Khoảnh khắc yêu thương', imagePosition: '50% 35%' };
    setFormData((current) => ({ ...current, gallery: [...current.gallery, photo], ...(current.gallery.length ? {} : { galleryCoverImage: src, galleryCoverId: photo.id }) }));
  };
  const uploadNew = async (event) => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    setAdding(true); setError(''); onBusyChange(true);
    try { addPhoto(await prepareUploadedImage(file)); }
    catch (reason) { setError(reason.message); }
    finally { setAdding(false); onBusyChange(false); }
  };
  const removePhoto = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này khỏi album?')) return;
    setFormData((current) => {
      const original = current.gallery.find((photo) => photo.id === id);
      const gallery = current.gallery.filter((photo) => photo.id !== id);
      const wasCover = current.galleryCoverId ? current.galleryCoverId === id : current.galleryCoverImage === original?.src;
      return { ...current, gallery, ...(wasCover ? { galleryCoverImage: gallery[0]?.src || '', galleryCoverId: gallery[0]?.id || '' } : {}) };
    });
  };
  return <div className="space-y-6">
    <div>
      <h4 className="font-serif text-xl text-charcoal-900">Ảnh trên thiệp</h4>
      <p className="text-sm mt-2">Chọn ảnh từ thiết bị hoặc nhập đường dẫn. Kéo vị trí ảnh để gương mặt nằm vừa khung.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slots.map((slot) => <ImageSourceEditor key={slot.title} title={slot.title} value={readPath(formData, slot.path)} defaultValue={readPath(defaults, slot.path)}
        onChange={(value) => changePath(slot.path, value)} position={slot.crop ? readPath(formData, slot.crop) : undefined}
        onPositionChange={slot.crop ? (position) => changePath(slot.crop, position) : undefined} onBusyChange={onBusyChange}>
        {slot.title === 'Nền lời mời' && <label className="block text-xs">Kiểu nền lời mời
          <select aria-label="Kiểu nền lời mời" className="admin-image-input mt-1" value={formData.couple.invitationBackgroundMode || 'repeat'} onChange={(event) => changePath(['couple', 'invitationBackgroundMode'], event.target.value)}>
            <option value="repeat">Lặp như nền giấy</option><option value="cover">Ảnh phủ toàn khung</option>
          </select>
        </label>}
      </ImageSourceEditor>)}
    </div>
    <div className="border-t border-champagne pt-6 space-y-3">
      <h4 className="font-serif text-xl text-charcoal-900">Album kỷ niệm ({formData.gallery.length})</h4>
      <button type="button" className="admin-image-button" disabled={adding} onClick={() => fileRef.current.click()}><Plus size={16} />{adding ? 'Đang xử lý ảnh…' : 'Thêm ảnh từ thiết bị'}</button>
      <input ref={fileRef} type="file" accept="image/*" aria-label="Tải ảnh mới vào album" className="hidden" disabled={adding} onChange={uploadNew} />
      <div className="flex gap-2 items-end">
        <label className="text-xs flex-1 min-w-0">Đường dẫn ảnh mới<input className="admin-image-input mt-1" value={newSource} onChange={(event) => setNewSource(event.target.value)} placeholder="https://… hoặc /assets/ten-anh.webp" /></label>
        <button type="button" className="admin-image-reset" onClick={() => {
          if (!isImageSource(newSource)) { setError('Bạn hãy nhập đường dẫn ảnh hợp lệ.'); return; }
          addPhoto(newSource.trim()); setNewSource(''); setError('');
        }}>Thêm ảnh</button>
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {formData.gallery.map((photo, index) => <ImageSourceEditor key={photo.id} title={`Ảnh album ${index + 1}`} value={photo.src}
        onChange={(src) => changePhoto(photo.id, { src })} position={photo.imagePosition} onPositionChange={(imagePosition) => changePhoto(photo.id, { imagePosition })} onBusyChange={onBusyChange}>
        <label className="block text-xs">Chú thích ảnh album {index + 1}<input className="admin-image-input mt-1" value={photo.caption || ''} onChange={(event) => changePhoto(photo.id, { caption: event.target.value })} /></label>
        <label className="block text-xs">Mô tả ảnh album {index + 1}<input className="admin-image-input mt-1" value={photo.alt || ''} onChange={(event) => changePhoto(photo.id, { alt: event.target.value })} /></label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="admin-image-reset" aria-pressed={formData.galleryCoverId ? formData.galleryCoverId === photo.id : formData.galleryCoverImage === photo.src}
            onClick={() => setFormData((current) => ({ ...current, galleryCoverImage: photo.src, galleryCoverId: photo.id }))}>Đặt ảnh mở đầu album {index + 1}</button>
          <button type="button" className="admin-image-delete" aria-label={`Xóa ảnh album ${index + 1}`} onClick={() => removePhoto(photo.id)}><Trash2 size={16} />Xóa</button>
        </div>
      </ImageSourceEditor>)}
    </div>
    {!formData.gallery.length && <p>Album chưa có ảnh. Bạn có thể thêm ảnh ở trên.</p>}
    <p className="text-sm">Lưu thay đổi áp dụng trên trình duyệt này. Để khách mời thấy ảnh mới, tải file weddingData.js và cập nhật dự án lên Vercel.</p>
  </div>;
}
