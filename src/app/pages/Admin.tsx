import { useState, useEffect } from 'react';
import { Newspaper, ImageIcon, X, Upload, Lock, User, Users, GraduationCap, Trophy, BookOpen, Building2 } from 'lucide-react';
import { PPDBEditor } from '@/app/components/admin/PPDBEditor';
import { ProfileEditor } from '@/app/components/admin/ProfileEditor';
import { StaffEditor } from '@/app/components/admin/StaffEditor';
import { ExtracurricularEditor } from '@/app/components/admin/ExtracurricularEditor';
import { CurriculumEditor } from '@/app/components/admin/CurriculumEditor';
import { FacilitiesEditor } from '@/app/components/admin/FacilitiesEditor';
import { PhotoGalleryEditor } from '@/app/components/admin/PhotoGalleryEditor';

export function Admin() {
  interface News {
    id: number;
    title: string;
    content: string;
    category: string;
    image: string;
    date: string;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('berita');
  const [isLoading, setIsLoading] = useState(false);
  const [newsList, setNewsList] = useState<News[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pengumuman',
    date: new Date().toISOString().split('T')[0],
    content: '',
    imageFile: null as File | null,
    imagePreview: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/news');
      if (response.ok) {
        const data = await response.json();
        setNewsList(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNews();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleEdit = (item: News) => {
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date.split('T')[0], // Extract date part
      content: item.content,
      imageFile: null,
      imagePreview: item.image || ''
    });
    setEditId(item.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '',
      category: 'Pengumuman',
      date: new Date().toISOString().split('T')[0],
      content: '',
      imageFile: null,
      imagePreview: ''
    });
    setEditId(null);
    setIsEditing(false);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Judul dan Konten wajib diisi!');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('date', formData.date);
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      const url = isEditing
        ? `http://localhost:5001/api/news/${editId}`
        : 'http://localhost:5001/api/news';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: data,
      });

      if (response.ok) {
        alert(isEditing ? 'Berita berhasil diperbarui!' : 'Berita berhasil ditambahkan!');
        handleCancelEdit(); // Reset form
        fetchNews();
      } else {
        alert(isEditing ? 'Gagal memperbarui berita' : 'Gagal menambahkan berita');
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      alert('Terjadi kesalahan.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNews();
      } else {
        alert('Gagal menghapus berita');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">SMAN 1 Gebog - Dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Username: admin<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">Kelola konten website SMAN 1 Gebog</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 'berita', label: 'Berita', icon: Newspaper },
                { id: 'profil', label: 'Profil Sekolah', icon: User },
                { id: 'guru-staff', label: 'Guru & Staff', icon: Users },
                { id: 'ekstrakurikuler', label: 'Ekstrakurikuler', icon: Trophy },
                { id: 'sarana-prasarana', label: 'Sarana & Prasarana', icon: Building2 },
                { id: 'kurikulum', label: 'Kurikulum', icon: BookOpen },
                { id: 'ppdb', label: 'Manajemen PPDB', icon: GraduationCap },
                { id: 'galeri-foto', label: 'Galeri Foto', icon: ImageIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'ppdb' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Konten PPDB</h2>
            <PPDBEditor />
          </div>
        ) : activeTab === 'profil' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Profil Sekolah</h2>
            <ProfileEditor />
          </div>
        ) : activeTab === 'guru-staff' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Guru & Staff</h2>
            <StaffEditor />
          </div>
        ) : activeTab === 'ekstrakurikuler' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Ekstrakurikuler</h2>
            <ExtracurricularEditor />
          </div>
        ) : activeTab === 'sarana-prasarana' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Sarana & Prasarana</h2>
            <FacilitiesEditor />
          </div>
        ) : activeTab === 'kurikulum' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Kurikulum</h2>
            <CurriculumEditor />
          </div>
        ) : activeTab === 'galeri-foto' ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Galeri Foto</h2>
            <PhotoGalleryEditor />
          </div>
        ) : (
          <>
            {/* Upload Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Upload Berita
              </h2>

              {/* Form Content */}
              <form className="space-y-6" onSubmit={handleNewsSubmit}>
                {/* ... existing form fields ... */}
                {activeTab === 'berita' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan judul"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Pengumuman</option>
                        <option>Prestasi</option>
                        <option>Kegiatan</option>
                        <option>Info</option>
                        <option>Agenda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konten
                      </label>
                      <textarea
                        rows={6}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan konten berita/pengumuman"
                        required
                      ></textarea>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Gambar
                  </label>

                  {/* Image Preview */}
                  {formData.imagePreview && (
                    <div className="mb-4 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageFile: null, imagePreview: '' })}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData({
                                  ...formData,
                                  imageFile: file,
                                  imagePreview: URL.createObjectURL(file)
                                });
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hidden Video Input for now */}
                {activeTab === 'galeri-video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link YouTube (Opsional)
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}

                {(activeTab === 'galeri-foto' || activeTab === 'galeri-video') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan deskripsi"
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? 'Update Berita' : 'Publish'}
                  </button>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-8 bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                    >
                      Batal Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Simpan Draft
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of Content */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Daftar Berita
              </h2>

              <div className="space-y-4">
                {newsList.length === 0 ? (
                  <p className="text-center text-gray-500">Belum ada berita.</p>
                ) : (
                  newsList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString('id-ID')} - {item.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
