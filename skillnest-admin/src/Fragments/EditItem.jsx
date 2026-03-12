import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Shield, LogOut, ArrowLeft, Tag, Type, DollarSign,
  FileText, AlertCircle, CheckCircle, Clock, Image as ImageIcon, X
} from 'lucide-react';
import Button from '../Components/Button';
import Navbar from '../Layouts/Navbar';

const API = 'http://api.skillnest.site/api';
const token = () => localStorage.getItem('auth_token');

export default function AdminEditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming & Tech',
    price: '',
    description: '',
    skill_level: 'Beginner',
    what_you_get: '',
    thumbnail: null
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token() || user.role !== 'admin') { navigate('/login'); return; }

    fetch(`${API}/items/${id}`, {
      headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        setFormData({
          name:        data.name || '',
          category:    data.category || 'Programming & Tech',
          price:       data.price || '',
          description: data.description || '',
          skill_level: data.skill_level || 'Beginner',
          what_you_get: data.what_you_get || '',
          thumbnail:   null
        });
        if (data.thumbnail_url) setPreviewImage(data.thumbnail_url);
        else if (data.thumbnail) setPreviewImage(`http://api.skillnest.site/storage/${data.thumbnail}`);
      })
      .catch(() => setError('Gagal memuat data item'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) { setError('Format file harus JPG, JPEG, PNG, atau GIF'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Ukuran file maksimal 2MB'); return; }
    setFormData(prev => ({ ...prev, thumbnail: file }));
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setPreviewImage(null);
    const el = document.getElementById('thumbnail-upload');
    if (el) el.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description || !formData.what_you_get) {
      setError('Semua field wajib diisi'); return;
    }
    setSubmitting(true);
    setError('');
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('skill_level', formData.skill_level);
    formDataToSend.append('what_you_get', formData.what_you_get.trim());
    if (formData.thumbnail) formDataToSend.append('thumbnail', formData.thumbnail);

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable)
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
        });
        xhr.open('POST', `${API}/admin/items/${id}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token()}`);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300
          ? resolve(JSON.parse(xhr.responseText))
          : reject(new Error(xhr.responseText));
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formDataToSend);
      });

      setSuccess(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      try {
        const errData = JSON.parse(err.message);
        setError(errData.errors ? Object.values(errData.errors)[0][0] : errData.message || 'Gagal memperbarui');
      } catch {
        setError('Gagal memperbarui karya');
      }
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const formatRupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-4 mt-2">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
            <h1 className="text-xl font-bold text-gray-900">Edit Item</h1>
          </div>

          {success && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} />
              <div>
                <p className="font-medium">Item berhasil diperbarui!</p>
                <p className="text-sm">Mengalihkan...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mx-6 mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Mengupload...</span><span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Karya <span className="text-red-500">*</span></label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="Contoh: Jasa Design Website" disabled={submitting} required />
              </div>
            </div>

            {/* Kategori & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white text-sm"
                    disabled={submitting}>
                    <option>Programming & Tech</option>
                    <option>Design & Creative</option>
                    <option>Writing</option>
                    <option>Digital Marketing</option>
                    <option>Handmade</option>
                    <option>Education</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Level Keahlian <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select name="skill_level" value={formData.skill_level} onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white text-sm"
                    disabled={submitting}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Harga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga (Rp) <span className="text-red-500">*</span></label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" name="price" value={formData.price} onChange={handleInputChange}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="200000" min="1000" step="1000" disabled={submitting} required />
              </div>
              {formData.price && (
                <p className="text-xs text-gray-400 mt-1">Preview: {formatRupiah(formData.price)}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi <span className="text-red-500">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea name="description" value={formData.description} onChange={handleInputChange}
                  rows={4} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                  placeholder="Jelaskan detail karya..." disabled={submitting} required />
              </div>
            </div>

            {/* Yang Didapat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Yang Didapat Pembeli <span className="text-red-500">*</span></label>
              <input type="text" name="what_you_get" value={formData.what_you_get} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Contoh: File source, Revisi 2x" disabled={submitting} required />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail</label>
              <div className={`border-2 border-dashed rounded-lg p-5 transition-colors ${previewImage ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}>
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileChange} className="hidden" id="thumbnail-upload" disabled={submitting} />
                {previewImage ? (
                  <div className="relative">
                    <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                    <button type="button" onClick={handleRemoveImage} disabled={submitting}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1">
                      <X size={14} />
                    </button>
                    <label htmlFor="thumbnail-upload" className="block text-center mt-2 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      Ganti gambar
                    </label>
                  </div>
                ) : (
                  <label htmlFor="thumbnail-upload" className="cursor-pointer block text-center">
                    <ImageIcon className="mx-auto text-gray-300 mb-2" size={36} />
                    <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, GIF (Max 2MB)</p>
                  </label>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" text={submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                variant="solid" fullWidth disabled={submitting} />
              <Button type="button" text="Batal" variant="outline"
                onClick={() => navigate(-1)} disabled={submitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}