import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Tag,
  Type,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  X
} from 'lucide-react';
import Navbar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import Button from '../Components/Button';

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming & Tech',
    price: '',
    description: '',
    skill_level: 'Beginner',
    what_you_get: '',
    thumbnail: null
  });

  // Cek auth status
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    console.log('Checking auth - Token:', token ? 'Ada' : 'Tidak ada');
    console.log('User data:', userData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        console.log('User authenticated:', parsedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
        window.location.href = '/login?redirect=/add-item';
      }
    } else {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/login?redirect=/add-item';
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        setError('Format file harus JPG, JPEG, PNG, atau GIF');
        return;
      }

      if (file.size > maxSize) {
        setError('Ukuran file maksimal 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, thumbnail: file }));
      setError(''); // Hapus error jika ada

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.getElementById('thumbnail-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    setUploadProgress(0);

    const token = localStorage.getItem('auth_token');

    // Validasi form
    if (!formData.name || !formData.price || !formData.description || !formData.what_you_get) {
      setError('Semua field wajib diisi');
      setSubmitting(false);
      return;
    }

    // Validasi price harus number dan positif
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Harga harus lebih dari 0');
      setSubmitting(false);
      return;
    }

    try {
      // Buat FormData untuk upload file
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('skill_level', formData.skill_level);
      formDataToSend.append('what_you_get', formData.what_you_get.trim());

      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
        console.log('File to upload:', formData.thumbnail.name, formData.thumbnail.type, formData.thumbnail.size);
      }

      // Log FormData untuk debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'thumbnail' ? pair[1].name : pair[1]));
      }

      // Gunakan XMLHttpRequest untuk tracking progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', 'http://api.skillnest.site/api/items');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.responseText));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formDataToSend);
      });

      console.log('Response:', response);

      setSuccess(true);

      // Reset form
      setFormData({
        name: '',
        category: 'Programming & Tech',
        price: '',
        description: '',
        skill_level: 'Beginner',
        what_you_get: '',
        thumbnail: null
      });
      setPreviewImage(null);
      setUploadProgress(0);

      // Redirect setelah 2 detik
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err) {
      console.error('Error submitting:', err);

      // Parse error response
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.errors) {
          // Validation errors
          const firstError = Object.values(errorData.errors)[0][0];
          setError(firstError);
        } else {
          setError(errorData.message || 'Gagal menambah karya');
        }
      } catch {
        setError(err.message || 'Gagal menambah karya');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Format rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Tampilkan loading sementara cek auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-3 text-gray-600">Memeriksa autentikasi...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isAuthenticated} user={user} />

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 py-3 mt-4">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          disabled={submitting}
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Marketplace
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Form */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
            <h1 className="text-2xl font-bold text-gray-900">Tambah Karya Baru</h1>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
              <CheckCircle size={24} className="flex-shrink-0" />
              <div>
                <p className="font-medium">Karya berhasil ditambahkan!</p>
                <p className="text-sm">Mengalihkan ke marketplace...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle size={24} className="flex-shrink-0" />
              <div>
                <p className="font-medium">Gagal menambah karya</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mx-6 mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Mengupload...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nama Karya */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Karya <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  placeholder="Contoh: Jasa Design Website"
                  maxLength="255"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Kategori & Level - Grid 2 kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    disabled={submitting}
                    required
                  >
                    <option value="Programming & Tech">Programming & Tech</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Writing">Writing</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Handmade">Handmade</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              {/* Level Keahlian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level Keahlian <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    name="skill_level"
                    value={formData.skill_level}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    disabled={submitting}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Harga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="200000"
                  min="1000"
                  step="1000"
                  disabled={submitting}
                  required
                />
              </div>
              {formData.price && (
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {formatRupiah(formData.price)}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Jelaskan detail karya Anda..."
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Yang Didapat Pembeli */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yang Didapat Pembeli <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="what_you_get"
                value={formData.what_you_get}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Contoh: Zip, PNG, JPG, PDF"
                disabled={submitting}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma jika lebih dari satu</p>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail {formData.thumbnail && <span className="text-green-600">✓ Terpilih</span>}
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${error && error.includes('gambar')
                  ? 'border-red-300 bg-red-50'
                  : previewImage
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-indigo-500'
                }`}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={submitting}
                />

                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={submitting}
                    >
                      <X size={16} />
                    </button>
                    <p className="text-sm text-center mt-3 text-gray-600">
                      {formData.thumbnail?.name} ({(formData.thumbnail?.size / 1024).toFixed(2)} KB)
                    </p>
                    <label
                      htmlFor="thumbnail-upload"
                      className="block text-center mt-2 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Ganti gambar
                    </label>
                  </div>
                ) : (
                  <label htmlFor="thumbnail-upload" className="cursor-pointer block text-center">
                    <div className="space-y-3">
                      <ImageIcon className="mx-auto text-gray-400" size={48} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Klik untuk upload gambar
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, JPEG, GIF (Max 2MB)
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                text={submitting ? 'Menyimpan...' : 'Simpan Karya'}
                variant="solid"
                fullWidth
                disabled={submitting}
              />
              <Button
                type="button"
                text="Batal"
                variant="outline"
                onClick={handleBack}
                disabled={submitting}
              />
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddItem;