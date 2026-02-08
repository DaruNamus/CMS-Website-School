import { useState, useEffect } from 'react';
import { Upload, Trash2, X } from 'lucide-react';

interface Photo {
    id: number;
    title: string;
    description: string;
    image_url: string;
    category: string;
}

export function PhotoGalleryEditor() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Kegiatan',
        imageFile: null as File | null,
        imagePreview: ''
    });

    const CATEGORIES = ['Kegiatan', 'Fasilitas', 'Prestasi', 'Lainnya'];

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/gallery/photos');
            if (response.ok) {
                const data = await response.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageFile) {
            alert('Silakan pilih foto terlebih dahulu');
            return;
        }

        setIsSaving(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('image', formData.imageFile);

        try {
            const response = await fetch('http://localhost:5001/api/gallery/photos', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                alert('Foto berhasil ditambahkan!');
                setFormData({
                    title: '',
                    description: '',
                    category: 'Kegiatan',
                    imageFile: null,
                    imagePreview: ''
                });
                fetchPhotos();
            } else {
                alert('Gagal menambahkan foto');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus foto ini?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/gallery/photos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPhotos(photos.filter(p => p.id !== id));
            } else {
                alert('Gagal menghapus foto');
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Foto Baru</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Contoh: Kegiatan Upacara Senin"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Deskripsi singkat foto..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Foto</label>
                        {formData.imagePreview ? (
                            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                                <img
                                    src={formData.imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, imageFile: null, imagePreview: '' })}
                                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="relative h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:border-blue-500 transition-colors">
                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Klik untuk upload foto</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={e => {
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
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? 'Menyimpan...' : 'Upload Foto'}
                    </button>
                </div>
            </form>

            {/* Photos List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Daftar Foto Galeri</h3>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : photos.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Belum ada foto di galeri.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                        {photos.map(photo => (
                            <div key={photo.id} className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="aspect-video relative">
                                    <img
                                        src={photo.image_url}
                                        alt={photo.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => handleDelete(photo.id)}
                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transform translate-y-4 group-hover:translate-y-0 transition-all"
                                            title="Hapus Foto"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
                                        {photo.category}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 truncate" title={photo.title}>{photo.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{photo.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
