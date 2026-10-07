export function isImageSource(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  const source = value.trim();
  if (/^data:image\/(png|jpeg|webp|gif|avif);base64,[a-z0-9+/=\s]+$/i.test(source)) return true;
  if (/^(\/[^/]|\.\.?\/|assets\/)/.test(source)) return true;
  try { return ['https:', 'http:'].includes(new URL(source).protocol); } catch { return false; }
}

const readBlob = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Không đọc được ảnh. Bạn hãy chọn lại file.'));
  reader.readAsDataURL(blob);
});

// Uploaded photos are embedded in the export, resized once rather than on every page view.
export async function prepareUploadedImage(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Bạn hãy chọn file ảnh JPG, PNG hoặc WebP.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Ảnh quá lớn. Bạn hãy chọn ảnh dưới 20 MB.');
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    try { await image.decode(); } catch { throw new Error('Không mở được ảnh này. Bạn hãy dùng JPG, PNG hoặc WebP.'); }
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('File ảnh không hợp lệ.');
    let edge = Math.min(1600, Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Trình duyệt chưa xử lý được ảnh. Bạn có thể nhập đường dẫn ảnh.');
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const scale = edge / Math.max(image.naturalWidth, image.naturalHeight);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', .82));
      if (!blob) throw new Error('Chưa xử lý được ảnh. Bạn hãy thử lại.');
      if (blob.size <= 300 * 1024) return await readBlob(blob);
      edge *= .8;
    }
    throw new Error('Ảnh còn quá nặng để lưu. Bạn hãy dùng ảnh nhỏ hơn hoặc đường dẫn ảnh.');
  } finally { URL.revokeObjectURL(objectUrl); }
}

export function validateImages(data) {
  const sources = [
    ['Ảnh bìa', data.couple.heroImage], ['Ảnh chú rể', data.couple.groom.avatar],
    ['Ảnh cô dâu', data.couple.bride.avatar], ['Nền lịch', data.couple.calendarImage],
    ['Nền lời mời', data.couple.invitationBackground], ['Biểu tượng nhẫn cưới', data.couple.eventIconImage],
    ...data.gallery.map((photo, index) => [`Ảnh album ${index + 1}`, photo.src]),
  ];
  for (const [label, source] of sources) {
    if (!isImageSource(source)) throw new Error(`${label}: hãy chọn ảnh hoặc nhập đường dẫn ảnh hợp lệ.`);
  }
}
