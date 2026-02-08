import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Search, Upload, User, Briefcase, BookOpen, Key } from 'lucide-react';

interface Staff {
    id: number;
    name: string;
    nip: string;
    position: 'Guru' | 'Staff';
    subject: string;
    photo: string | null;
}

export function StaffEditor() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPosition, setFilterPosition] = useState<'All' | 'Guru' | 'Staff'>('All');

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        nip: '',
        position: 'Guru' as 'Guru' | 'Staff',
        subject: '',
        photo: null as File | null,
        photoUrl: '' as string | null
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/staff');
            if (response.ok) {
                const data = await response.json();
                setStaffList(data);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: '',
            nip: '',
            position: 'Guru',
            subject: '',
            photo: null,
            photoUrl: ''
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (staff: Staff) => {
        setFormData({
            name: staff.name,
            nip: staff.nip || '',
            position: staff.position,
            subject: staff.subject || '',
            photo: null,
            photoUrl: staff.photo
        });
        setCurrentId(staff.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/staff/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchStaff();
            } else {
                alert('Gagal menghapus data');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('Terjadi kesalahan saat menghapus data');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('nip', formData.nip);
        data.append('position', formData.position);
        data.append('subject', formData.subject);
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            const url = currentId
                ? `http://localhost:5001/api/staff/${currentId}`
                : 'http://localhost:5001/api/staff';

            const method = currentId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data,
            });

            if (response.ok) {
                await fetchStaff();
                handleResetForm();
                alert(isEditing ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!');
            } else {
                alert('Gagal menyimpan data');
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredStaff = staffList.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.nip && staff.nip.includes(searchTerm));
        const matchesFilter = filterPosition === 'All' || staff.position === filterPosition;
        return matchesSearch && matchesFilter;
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {['All', 'Guru', 'Staff'].map((pos) => (
                        <button
                            key={pos}
                            onClick={() => setFilterPosition(pos as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterPosition === pos
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {pos === 'All' ? 'Semua' : pos}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama atau NIP..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => {
                                handleResetForm();
                                setIsEditing(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Tambah Data</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Form */}
            {isEditing && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            {currentId ? 'Edit Data' : 'Tambah Data Baru'}
                        </h3>
                        <button
                            onClick={handleResetForm}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-6">
                            {/* Photo Upload */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profile</label>
                                <div className="aspect-[3/4] bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500 transition-colors">
                                    {(formData.photo || formData.photoUrl) ? (
                                        <img
                                            src={formData.photo ? URL.createObjectURL(formData.photo) : formData.photoUrl!}
                                            alt="Preview"
                                            className="w-full h-full object-cover absolute inset-0"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <span className="text-xs text-gray-400">Belum ada foto</span>
                                        </div>
                                    )}

                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Format: JPG, PNG. Max: 2MB</p>
                            </div>

                            {/* Info Fields */}
                            <div className="md:col-span-3 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nama lengkap beserta gelar"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">NIP (Opsional)</label>
                                        <input
                                            type="text"
                                            value={formData.nip}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nip: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nomor Induk Pegawai"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan / Posisi</label>
                                        <select
                                            value={formData.position}
                                            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as 'Guru' | 'Staff' }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Guru">Guru / Pengajar</option>
                                            <option value="Staff">Staff / Tenaga Kependidikan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {formData.position === 'Guru' ? 'Mata Pelajaran' : 'Bagian / Unit Kerja'} (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder={formData.position === 'Guru' ? 'Contoh: Matematika' : 'Contoh: Tata Usaha'}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleResetForm}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((staff) => (
                    <div key={staff.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-start p-4 gap-4">
                            <div className="w-20 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {staff.photo ? (
                                    <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate" title={staff.name}>{staff.name}</h4>
                                <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                                    <Briefcase className="w-3 h-3" />
                                    <span>{staff.position}</span>
                                </div>
                                {staff.nip && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <Key className="w-3 h-3" />
                                        <span>NIP: {staff.nip}</span>
                                    </div>
                                )}
                                {staff.subject && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <BookOpen className="w-3 h-3" />
                                        <span>{staff.subject}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(staff)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(staff.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStaff.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Tidak ada data ditemukan</p>
                </div>
            )}
        </div>
    );
}
