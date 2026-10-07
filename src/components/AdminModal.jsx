import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  X, Lock, Key, Save, Download, Image as ImageIcon, Heart, Calendar, Music
} from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import useDialog from '../hooks/useDialog';
import { getDayOfWeek } from '../utils/weddingDate';
import AdminImagePanel, { createAdminDraft } from './AdminImagePanel';
import { validateImages } from '../utils/imageUpload';
import GuestInvitationEditor from './GuestInvitationEditor';

export default function AdminModal() {
  const { 
    data, 
    updateData, 
    resetData, 
    exportConfigFile, 
    isAdminOpen, 
    setIsAdminOpen,
    isAdminLoggedIn,
    setIsAdminLoggedIn 
  } = useWeddingData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('couple'); // couple, events, gallery, settings
  const [formData, setFormData] = useState(() => createAdminDraft(data));
  const [pendingUploads, setPendingUploads] = useState(0);
  const onBusyChange = useCallback((busy) => setPendingUploads((count) => Math.max(0, count + (busy ? 1 : -1))), []);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const dialogRef = useRef(null);
  const closeDialog = useCallback(() => setIsAdminOpen(false), [setIsAdminOpen]);
  useDialog(dialogRef, isAdminOpen, closeDialog);
  useEffect(() => { setSaveSuccess(false); setSaveError(''); }, [formData]);

  // Sync formData when data changes or modal opens
  const handleOpen = () => {
    setFormData(createAdminDraft(data));
    setSaveSuccess(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'hihihaha') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      handleOpen();
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác! (Gợi ý: admin / hihihaha)');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleSave = () => {
    if (pendingUploads) return;
    try {
      validateImages(formData);
      updateData(formData);
      setSaveSuccess(true);
      setSaveError('');
    } catch (error) {
      setSaveSuccess(false);
      setSaveError(error.name === 'QuotaExceededError' ? 'Bộ nhớ trình duyệt đã đầy. Bạn có thể tải file weddingData.js để giữ các ảnh đã chọn hoặc dùng đường dẫn ảnh.' : `Chưa lưu được. ${error.message || 'Kiểm tra ngày giờ và quyền lưu của trình duyệt.'}`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục về dữ liệu thiệp gốc ban đầu không?')) {
      resetData();
      setIsAdminOpen(false);
    }
  };

  const handleExport = () => {
    if (pendingUploads) return;
    try { validateImages(formData); exportConfigFile(formData); setSaveError(''); }
    catch (error) { setSaveError(`Chưa tải được file. ${error.message}`); }
  };

  if (!isAdminOpen) return null;

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Quản trị thiệp cưới" tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-900/90 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-champagne overflow-hidden flex flex-col max-h-[90svh]">
        
        {/* Header */}
        <div className="shrink-0 px-4 sm:px-6 py-4 bg-charcoal-900 text-white flex items-center justify-between gap-2 border-b border-gold-500/30">
          <div className="flex items-center gap-2 min-w-0">
            <Key className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
              {isAdminLoggedIn ? 'Bảng Quản Trị Thiệp Cưới (Admin)' : 'Đăng Nhập Quản Trị'}
            </h3>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            aria-label="Đóng quản trị"
            className="w-11 h-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!isAdminLoggedIn ? (
          /* LOGIN FORM */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-cream-100 border border-gold-400 flex items-center justify-center mx-auto text-gold-600">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif text-2xl text-charcoal-900 font-semibold">
                Đăng Nhập Quản Trị
              </h4>
              <p className="font-sans text-xs text-charcoal-800/60 mt-1">
                Nhập tài khoản để chỉnh sửa nội dung và album ảnh
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-sans border border-red-200">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-charcoal-900 mb-1 uppercase tracking-wide">
                  Tài khoản
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne focus:border-gold-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-900 mb-1 uppercase tracking-wide">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne focus:border-gold-500 outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white font-medium text-sm transition-all duration-300 shadow-md cursor-pointer"
              >
                Đăng Nhập
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN CMS DASHBOARD */
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Tabs Bar */}
            <div className="shrink-0 flex items-center gap-1 p-2 bg-cream-100 border-b border-champagne overflow-x-auto text-xs sm:text-sm font-medium">
              <button
                onClick={() => setActiveTab('couple')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'couple' ? 'bg-white text-gold-700 shadow-sm font-semibold' : 'text-charcoal-800/70 hover:bg-white/50'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Cặp Đôi</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'events' ? 'bg-white text-gold-700 shadow-sm font-semibold' : 'text-charcoal-800/70 hover:bg-white/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>2 Ngày Tiệc</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'gallery' ? 'bg-white text-gold-700 shadow-sm font-semibold' : 'text-charcoal-800/70 hover:bg-white/50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Ảnh & Album ({formData.gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'settings' ? 'bg-white text-gold-700 shadow-sm font-semibold' : 'text-charcoal-800/70 hover:bg-white/50'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Nhạc & Lời Chúc</span>
              </button>
            </div>

            {/* Form Panels */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-6 text-sm text-charcoal-900">
              
              {/* TAB 1: COUPLE */}
              {activeTab === 'couple' && (
                <div className="space-y-6">
                  {/* Groom */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-3">
                    <h5 className="font-serif font-bold text-base text-gold-700">Thông Tin Chú Rể</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-charcoal-800/70 mb-1">Tên gọi (Hiển thị to)</label>
                        <input
                          type="text"
                          value={formData.couple.groom.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, name: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-charcoal-800/70 mb-1">Họ và tên đầy đủ</label>
                        <input
                          type="text"
                          value={formData.couple.groom.fullName}
                          onChange={(e) => setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, fullName: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-charcoal-800/70 mb-1">Lời tự sự của Chú Rể</label>
                      <textarea
                        rows={2}
                        value={formData.couple.groom.bio}
                        onChange={(e) => setFormData({
                          ...formData,
                          couple: {
                            ...formData.couple,
                            groom: { ...formData.couple.groom, bio: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Bride */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-3">
                    <h5 className="font-serif font-bold text-base text-gold-700">Thông Tin Cô Dâu</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-charcoal-800/70 mb-1">Tên gọi (Hiển thị to)</label>
                        <input
                          type="text"
                          value={formData.couple.bride.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, name: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-charcoal-800/70 mb-1">Họ và tên đầy đủ</label>
                        <input
                          type="text"
                          value={formData.couple.bride.fullName}
                          onChange={(e) => setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, fullName: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-charcoal-800/70 mb-1">Lời tự sự của Cô Dâu</label>
                      <textarea
                        rows={2}
                        value={formData.couple.bride.bio}
                        onChange={(e) => setFormData({
                          ...formData,
                          couple: {
                            ...formData.couple,
                            bride: { ...formData.couple.bride, bio: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Vow quote */}
                  <GuestInvitationEditor value={formData.invitation?.guestName} onChange={(guestName) => setFormData((current) => ({ ...current, invitation: { ...current.invitation, guestName } }))} />
                  <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-2">
                    <h5 className="font-serif font-bold text-base text-gold-700">Thông Điệp Tình Yêu (Quote)</h5>
                    <textarea
                      rows={3}
                      value={formData.couple.quote}
                      onChange={(e) => setFormData({
                        ...formData,
                        couple: { ...formData.couple, quote: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EVENTS */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  {formData.events.map((event, index) => (
                    <div key={event.id} className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-base text-gold-700">
                          {event.title} - {event.subtitle}
                        </h5>
                        <span className="px-2.5 py-0.5 rounded-full bg-charcoal-900 text-champagne text-xs">
                          {event.badge || event.title}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Tên buổi lễ</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[index].title = e.target.value;
                              updated[index].badge = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Tiêu đề phụ</label>
                          <input
                            type="text"
                            value={event.subtitle}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[index].subtitle = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Giờ tổ chức</label>
                          <input
                            type="text"
                            value={event.time}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[index].time = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Thứ trong tuần</label>
                          <input
                            type="text"
                            value={getDayOfWeek(event.solarDate) || ''}
                            readOnly
                            className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Ngày / Tháng / Năm</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="26"
                              value={event.solarDate.day}
                              onChange={(e) => {
                                const updated = [...formData.events];
                                updated[index].solarDate.day = e.target.value;
                                setFormData({ ...formData, events: updated });
                              }}
                              className="w-1/3 px-2 py-2 rounded-lg border border-champagne bg-white text-center text-sm"
                            />
                            <span>/</span>
                            <input
                              type="text"
                              placeholder="11"
                              value={event.solarDate.month}
                              onChange={(e) => {
                                const updated = [...formData.events];
                                updated[index].solarDate.month = e.target.value;
                                setFormData({ ...formData, events: updated });
                              }}
                              className="w-1/3 px-2 py-2 rounded-lg border border-champagne bg-white text-center text-sm"
                            />
                            <span>/</span>
                            <input
                              type="text"
                              placeholder="2026"
                              value={event.solarDate.year}
                              onChange={(e) => {
                                const updated = [...formData.events];
                                updated[index].solarDate.year = e.target.value;
                                setFormData({ ...formData, events: updated });
                              }}
                              className="w-1/3 px-2 py-2 rounded-lg border border-champagne bg-white text-center text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-charcoal-800/70 mb-1">Ngày âm lịch</label>
                        <input
                          type="text"
                          value={event.lunarDate}
                          onChange={(e) => {
                            const updated = [...formData.events];
                            updated[index].lunarDate = e.target.value;
                            setFormData({ ...formData, events: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Tên địa điểm</label>
                          <input
                            type="text"
                            value={event.venue.name}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[index].venue.name = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-charcoal-800/70 mb-1">Địa chỉ chi tiết</label>
                          <input
                            type="text"
                            value={event.venue.address}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[index].venue.address = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-charcoal-800/70 mb-1">Link chỉ đường Google Maps</label>
                        <input
                          type="url"
                          value={event.venue.mapUrl}
                          onChange={(e) => {
                            const updated = [...formData.events];
                            updated[index].venue.mapUrl = e.target.value;
                            setFormData({ ...formData, events: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* All invitation images and album */}
              {activeTab === 'gallery' && <AdminImagePanel formData={formData} setFormData={setFormData} onBusyChange={onBusyChange} />}
              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-3">
                    <h5 className="font-serif font-bold text-base text-gold-700">Cài Đặt Nhạc Nền</h5>
                    <div>
                      <label className="block text-xs text-charcoal-800/70 mb-1">Tên bài hát</label>
                      <input
                        type="text"
                        value={formData.audio?.title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          audio: { ...formData.audio, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-charcoal-800/70 mb-1">Link file MP3 (URL)</label>
                      <input
                        type="url"
                        value={formData.audio?.src || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          audio: { ...formData.audio, src: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                      />
                      <p className="text-[11px] text-charcoal-800/50 mt-1">
                        Hoặc chép file nhạc vào thư mục public/assets/music.mp3
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-champagne space-y-2">
                    <h5 className="font-serif font-bold text-base text-gold-700">Lời Cảm Ơn Cuối Trang</h5>
                    <textarea
                      rows={3}
                      value={formData.thankYouMessage.content}
                      onChange={(e) => setFormData({
                        ...formData,
                        thankYouMessage: { ...formData.thankYouMessage, content: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-champagne bg-white text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-cream-100 border-t border-champagne flex flex-wrap items-center justify-between gap-3">
              {pendingUploads > 0 && <p role="status" className="w-full text-sm">Đang xử lý {pendingUploads} ảnh. Vui lòng đợi trước khi lưu hoặc tải file.</p>}
              {saveError && <p role="alert" className="w-full text-sm text-red-700">{saveError}</p>}
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <button
                  onClick={handleSave}
                  disabled={pendingUploads > 0}
                  className="min-h-11 px-4 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveSuccess ? 'Đã lưu thành công!' : 'Lưu Thay Đổi'}</span>
                </button>

                <button
                  onClick={handleExport}
                  disabled={pendingUploads > 0}
                  className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-champagne text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Tải file weddingData.js để thay thế vào dự án trước khi deploy Vercel"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file weddingData.js</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="min-h-11 px-3 py-2 rounded-lg hover:bg-white text-charcoal-800/70 text-xs transition-colors"
                >
                  Khôi phục gốc
                </button>

                <button
                  onClick={handleLogout}
                  className="min-h-11 px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 text-xs transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
