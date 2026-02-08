import { useState, useEffect } from 'react';
import { Save, BookOpen, Star, Image as ImageIcon, Plus, X } from 'lucide-react';

export function CurriculumEditor() {
    const [activeSection, setActiveSection] = useState<'struktur' | 'unggulan'>('struktur');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Data State
    const [data, setData] = useState({
        struktur_kurikulum: {
            description: '',
            image: ''
        },
        program_unggulan: [] as { id: number; title: string; description: string; image: string }[]
    });

    // Temp State for Program Unggulan Form
    const [showProgramForm, setShowProgramForm] = useState(false);
    const [programForm, setProgramForm] = useState({
        id: 0,
        title: '',
        description: '',
        image: null as File | null,
        imagePreview: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/profile');
            if (response.ok) {
                const content = await response.json();
                setData({
                    struktur_kurikulum: content.struktur_kurikulum
                        ? (typeof content.struktur_kurikulum === 'string' ? JSON.parse(content.struktur_kurikulum) : content.struktur_kurikulum)
                        : { description: '', image: '' },
                    program_unggulan: content.program_unggulan
                        ? (typeof content.program_unggulan === 'string' ? JSON.parse(content.program_unggulan) : content.program_unggulan)
                        : []
                });
            }
        } catch (error) {
            console.error('Error fetching curriculum data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveStruktur = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5001/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ struktur_kurikulum: data.struktur_kurikulum })
            });

            if (response.ok) {
                alert('Struktur Kurikulum berhasil disimpan!');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving struktur:', error);
            alert('Gagal menyimpan data');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProgramList = async (updatedList: any[]) => {
        try {
            const response = await fetch('http://localhost:5001/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ program_unggulan: updatedList })
            });

            if (!response.ok) throw new Error('Failed to save program list');
        } catch (error) {
            console.error('Error saving program list:', error);
            alert('Gagal menyimpan daftar program');
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:5001/api/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data.url;
        }
        throw new Error('Upload failed');
    };

    const handleStrukturImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            try {
                const url = await handleFileUpload(e.target.files[0]);
                setData(prev => ({
                    ...prev,
                    struktur_kurikulum: { ...prev.struktur_kurikulum, image: url }
                }));
            } catch (error) {
                alert('Gagal mengupload gambar');
            }
        }
    };

    const handleProgramSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let imageUrl = programForm.imagePreview;
            if (programForm.image) {
                imageUrl = await handleFileUpload(programForm.image);
            }

            const newProgram = {
                id: programForm.id || Date.now(),
                title: programForm.title,
                description: programForm.description,
                image: imageUrl
            };

            const updatedList = programForm.id
                ? data.program_unggulan.map(p => p.id === programForm.id ? newProgram : p)
                : [...data.program_unggulan, newProgram];

            setData(prev => ({ ...prev, program_unggulan: updatedList }));
            await handleSaveProgramList(updatedList);

            setShowProgramForm(false);
            resetProgramForm();
            alert('Program Unggulan berhasil disimpan!');
        } catch (error) {
            console.error('Error saving program:', error);
            alert('Gagal menyimpan program');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProgram = async (id: number) => {
        if (!confirm('Yakin ingin menghapus program ini?')) return;

        const updatedList = data.program_unggulan.filter(p => p.id !== id);
        setData(prev => ({ ...prev, program_unggulan: updatedList }));
        await handleSaveProgramList(updatedList);
    };

    const resetProgramForm = () => {
        setProgramForm({
            id: 0,
            title: '',
            description: '',
            image: null,
            imagePreview: ''
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveSection('struktur')}
                    className={`pb-2 px-4 font-medium transition-colors relative ${activeSection === 'struktur' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Struktur Kurikulum</span>
                    </div>
                    {activeSection === 'struktur' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveSection('unggulan')}
                    className={`pb-2 px-4 font-medium transition-colors relative ${activeSection === 'unggulan' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        <span>Program Unggulan</span>
                    </div>
                    {activeSection === 'unggulan' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Content */}
            {activeSection === 'struktur' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi Kurikulum
                                </label>
                                <textarea
                                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    value={data.struktur_kurikulum.description}
                                    onChange={(e) => setData(prev => ({
                                        ...prev,
                                        struktur_kurikulum: { ...prev.struktur_kurikulum, description: e.target.value }
                                    }))}
                                    placeholder="Jelaskan tentang kurikulum yang diterapkan (misal: Kurikulum Merdeka), penjurusan, dll."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gambar Struktur / Bagan
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative bg-white">
                                {data.struktur_kurikulum.image ? (
                                    <div className="relative w-full aspect-video">
                                        <img
                                            src={data.struktur_kurikulum.image}
                                            alt="Struktur Kurikulum"
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                        <button
                                            onClick={() => setData(prev => ({
                                                ...prev,
                                                struktur_kurikulum: { ...prev.struktur_kurikulum, image: '' }
                                            }))}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Upload gambar struktur kurikulum</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleStrukturImageUpload}
                                    disabled={!!data.struktur_kurikulum.image}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveStruktur}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Daftar Program Unggulan</h3>
                        <button
                            onClick={() => { resetProgramForm(); setShowProgramForm(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Tambah Program
                        </button>
                    </div>

                    {showProgramForm && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">
                                {programForm.id ? 'Edit Program' : 'Tambah Program Baru'}
                            </h4>
                            <form onSubmit={handleProgramSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Program</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={programForm.title}
                                        onChange={(e) => setProgramForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Contoh: Kelas Bilingual, Tim Olimpiade"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={programForm.description}
                                        onChange={(e) => setProgramForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Jelaskan tentang program ini..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gambar</label>
                                    <div className="flex items-center gap-4">
                                        {programForm.imagePreview && (
                                            <img
                                                src={programForm.imagePreview}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                                            />
                                        )}
                                        <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                                            Pilih Gambar
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setProgramForm(prev => ({
                                                            ...prev,
                                                            image: e.target.files![0],
                                                            imagePreview: URL.createObjectURL(e.target.files![0])
                                                        }));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowProgramForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        {data.program_unggulan.map(program => (
                            <div key={program.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    {program.image ? (
                                        <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Star className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">{program.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{program.description}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => {
                                                setProgramForm({
                                                    id: program.id,
                                                    title: program.title,
                                                    description: program.description,
                                                    image: null,
                                                    imagePreview: program.image
                                                });
                                                setShowProgramForm(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProgram(program.id)}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.program_unggulan.length === 0 && !showProgramForm && (
                            <div className="col-span-2 text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Belum ada program unggulan</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
