import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, Image as ImageIcon, Filter, Clock } from 'lucide-react';

interface Extracurricular {
    id: number;
    name: string;
    category: 'Wajib' | 'Pilihan' | 'Akademik' | 'Non-Akademik';
    description: string;
    schedule: string;
    image: string;
}

export function ExtracurricularEditor() {
    const [extras, setExtras] = useState<Extracurricular[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Pilihan',
        description: '',
        schedule: '',
        image: null as File | null,
        imagePreview: ''
    });

    useEffect(() => {
        fetchExtras();
    }, []);

    const fetchExtras = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/extracurriculars');
            if (response.ok) {
                const data = await response.json();
                setExtras(data);
            }
        } catch (error) {
            console.error('Error fetching extracurriculars:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('schedule', formData.schedule);
        if (formData.image) {
            data.append('image', formData.image);
        }

        const url = currentId
            ? `http://localhost:5001/api/extracurriculars/${currentId}`
            : 'http://localhost:5001/api/extracurriculars';

        const method = currentId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                alert(`Ekstrakurikuler berhasil ${currentId ? 'diperbarui' : 'ditambahkan'}!`);
                fetchExtras();
                resetForm();
            } else {
                throw new Error('Failed to save extracurricular');
            }
        } catch (error) {
            console.error('Error saving extracurricular:', error);
            alert('Gagal menyimpan data ekstrakurikuler');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus ekstrakurikuler ini?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/extracurriculars/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setExtras(prev => prev.filter(item => item.id !== id));
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting extracurricular:', error);
            alert('Gagal menghapus ekstrakurikuler');
        }
    };

    const handleEdit = (extra: Extracurricular) => {
        setCurrentId(extra.id);
        setFormData({
            name: extra.name,
            category: extra.category as any, // Cast because API might return string
            description: extra.description || '',
            schedule: extra.schedule || '',
            image: null,
            imagePreview: extra.image
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setCurrentId(null);
        setFormData({
            name: '',
            category: 'Pilihan',
            description: '',
            schedule: '',
            image: null,
            imagePreview: ''
        });
        setIsEditing(false);
    };

    const filteredExtras = extras.filter(extra => {
        const matchesSearch = extra.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || extra.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Filters */}
                <div className="flex gap-4 flex-1 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari ekstrakurikuler..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">Semua Kategori</option>
                            <option value="Wajib">Wajib</option>
                            <option value="Pilihan">Pilihan</option>
                            <option value="Akademik">Akademik</option>
                            <option value="Non-Akademik">Non-Akademik</option>
                        </select>
                    </div>
                </div>

                {!isEditing && (
                    <button
                        onClick={() => { resetForm(); setIsEditing(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" /> Tambah Ekskul
                    </button>
                )}
            </div>

            {/* Form Section */}
            {isEditing && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            {currentId ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ekskul</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Contoh: Pramuka, Basket"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Wajib">Wajib</option>
                                        <option value="Pilihan">Pilihan</option>
                                        <option value="Akademik">Akademik</option>
                                        <option value="Non-Akademik">Non-Akademik</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal Latihan</label>
                                    <input
                                        type="text"
                                        name="schedule"
                                        value={formData.schedule}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Contoh: Sabtu, 15:00 - 17:00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo / Foto Kegiatan</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative bg-white">
                                    <div className="space-y-1 text-center">
                                        {formData.imagePreview ? (
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className="mx-auto h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        )}
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    onChange={handleImageChange}
                                                    className="sr-only"
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Deskripsi kegiatan ekstrakurikuler..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExtras.map(extra => (
                    <div key={extra.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                        <div className="h-48 bg-gray-100 relative">
                            {extra.image ? (
                                <img
                                    src={extra.image}
                                    alt={extra.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${extra.category === 'Wajib' ? 'bg-red-100 text-red-700' :
                                    extra.category === 'Akademik' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {extra.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{extra.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Clock className="w-4 h-4" />
                                <span>{extra.schedule || 'Jadwal belum diatur'}</span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 flex-1">{extra.description}</p>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(extra)}
                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(extra.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExtras.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Tidak ada data ekstrakurikuler</p>
                </div>
            )}
        </div>
    );
}

function Trophy({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    );
}
