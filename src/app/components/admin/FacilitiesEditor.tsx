import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Search } from 'lucide-react';

interface Facility {
    id: number;
    name: string;
    description: string;
    category: string;
    image: string;
}

export function FacilitiesEditor() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        description: '',
        category: 'Umum',
        image: null as File | null,
        imagePreview: ''
    });

    const categories = ['Umum', 'Akademik', 'Olahraga', 'Kesenian', 'Ibadah'];

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/facilities');
            if (response.ok) {
                const data = await response.json();
                setFacilities(data);
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('category', formData.category);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const url = formData.id
                ? `http://localhost:5001/api/facilities/${formData.id}`
                : 'http://localhost:5001/api/facilities';

            const method = formData.id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: data
            });

            if (response.ok) {
                await fetchFacilities();
                setShowForm(false);
                resetForm();
                alert('Data berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving facility:', error);
            alert('Gagal menyimpan data');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus fasilitas ini?')) return;

        try {
            await fetch(`http://localhost:5001/api/facilities/${id}`, {
                method: 'DELETE'
            });
            setFacilities(facilities.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting facility:', error);
            alert('Gagal menghapus data');
        }
    };

    const handleEdit = (facility: Facility) => {
        setFormData({
            id: facility.id,
            name: facility.name,
            description: facility.description,
            category: facility.category,
            image: null,
            imagePreview: facility.image
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            id: 0,
            name: '',
            description: '',
            category: 'Umum',
            image: null,
            imagePreview: ''
        });
    };

    const filteredFacilities = facilities.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari fasilitas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
                    >
                        <Plus className="w-4 h-4" /> Tambah Fasilitas
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            {formData.id ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
                        </h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Fasilitas</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Contoh: Lab Komputer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Jelaskan fasilitas ini..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Fasilitas</label>
                            <div className="flex items-center gap-4">
                                {formData.imagePreview && (
                                    <img
                                        src={formData.imagePreview}
                                        alt="Preview"
                                        className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                )}
                                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <ImageIcon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-600">Pilih Foto</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    image: e.target.files![0],
                                                    imagePreview: URL.createObjectURL(e.target.files![0])
                                                }));
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map(facility => (
                    <div key={facility.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {facility.image ? (
                                <img
                                    src={facility.image}
                                    alt={facility.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-gray-700">
                                {facility.category}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1">{facility.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{facility.description}</p>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(facility)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(facility.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredFacilities.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada data fasilitas</p>
                </div>
            )}
        </div>
    );
}
