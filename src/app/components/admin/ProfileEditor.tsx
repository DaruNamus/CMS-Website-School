import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, Target, Flag, Share2, BookOpen, Users, Upload, Image as ImageIcon } from 'lucide-react';

interface VisiMisiData {
    visi: string;
    misi: string[];
    motto: string;
    tagline: string;
    tujuan: { label: string; text: string; subItems?: string[] }[];
}

interface SejarahData {
    history: string;
    foundingInfo: {
        sk: string;
        date: string;
        nss: string;
        npsn: string;
    };
    firstPrincipal: {
        name: string;
        year: string;
        status: string;
    };
    timeline: { year: string; title: string; description: string }[];
}

interface StrukturOrganisasiData {
    description: string;
    imageUrl: string;
}

interface KepalaSekolahData {
    name: string;
    photo: string;
    periode: string;
    sambutan: string;
    bio: string;
}

interface OsisData {
    visi: string;
    misi: string[];
    structureImage: string;
    description: string;
}

export function ProfileEditor() {
    const [activeTab, setActiveTab] = useState<'visi-misi' | 'sejarah' | 'struktur-organisasi' | 'kepala-sekolah' | 'osis'>('visi-misi');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [visiMisi, setVisiMisi] = useState<VisiMisiData>({
        visi: '',
        misi: [],
        motto: '',
        tagline: '',
        tujuan: []
    });

    const [sejarah, setSejarah] = useState<SejarahData>({
        history: '',
        foundingInfo: { sk: '', date: '', nss: '', npsn: '' },
        firstPrincipal: { name: '', year: '', status: '' },
        timeline: []
    });

    const [strukturOrganisasi, setStrukturOrganisasi] = useState<StrukturOrganisasiData>({
        description: '',
        imageUrl: ''
    });

    const [kepalaSekolah, setKepalaSekolah] = useState<KepalaSekolahData>({
        name: '',
        photo: '',
        periode: '',
        sambutan: '',
        bio: ''
    });

    const [osis, setOsis] = useState<OsisData>({
        visi: '',
        misi: [],
        structureImage: '',
        description: ''
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/profile');
            if (response.ok) {
                const data = await response.json();
                if (data.visi_misi) setVisiMisi(data.visi_misi);
                if (data.sejarah) setSejarah(data.sejarah);
                if (data.struktur_organisasi) setStrukturOrganisasi(data.struktur_organisasi);
                if (data.kepala_sekolah) setKepalaSekolah(data.kepala_sekolah);
                if (data.osis) setOsis(data.osis);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5001/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visi_misi: visiMisi,
                    sejarah: sejarah,
                    struktur_organisasi: strukturOrganisasi,
                    kepala_sekolah: kepalaSekolah,
                    osis: osis
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');
            alert('Perubahan berhasil disimpan!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    // Visi Misi Handlers
    const handleVisiMisiChange = (field: keyof VisiMisiData, value: any) => {
        setVisiMisi(prev => ({ ...prev, [field]: value }));
    };

    const handleMisiChange = (index: number, value: string) => {
        const newMisi = [...visiMisi.misi];
        newMisi[index] = value;
        handleVisiMisiChange('misi', newMisi);
    };

    const addMisi = () => {
        handleVisiMisiChange('misi', [...visiMisi.misi, '']);
    };

    const removeMisi = (index: number) => {
        const newMisi = visiMisi.misi.filter((_, i) => i !== index);
        handleVisiMisiChange('misi', newMisi);
    };

    // Sejarah Handlers
    const handleSejarahChange = (field: keyof SejarahData, value: any) => {
        setSejarah(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedSejarahChange = (parent: 'foundingInfo' | 'firstPrincipal', field: string, value: string) => {
        setSejarah(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleTimelineChange = (index: number, field: string, value: string) => {
        const newTimeline = [...sejarah.timeline];
        newTimeline[index] = { ...newTimeline[index], [field]: value };
        handleSejarahChange('timeline', newTimeline);
    };

    const addTimeline = () => {
        handleSejarahChange('timeline', [...sejarah.timeline, { year: '', title: '', description: '' }]);
    };

    const removeTimeline = (index: number) => {
        handleSejarahChange('timeline', sejarah.timeline.filter((_, i) => i !== index));
    };

    // Image Upload Handler
    const handleImageUpload = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return data.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleStrukturImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = await handleImageUpload(e.target.files[0]);
            if (url) {
                setStrukturOrganisasi(prev => ({ ...prev, imageUrl: url }));
            }
        }
    };

    const handleKepalaSekolahPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = await handleImageUpload(e.target.files[0]);
            if (url) {
                setKepalaSekolah(prev => ({ ...prev, photo: url }));
            }
        }
    };

    // OSIS Handlers
    const handleOsisChange = (field: keyof OsisData, value: any) => {
        setOsis(prev => ({ ...prev, [field]: value }));
    };

    const handleOsisMisiChange = (index: number, value: string) => {
        const newMisi = [...osis.misi];
        newMisi[index] = value;
        handleOsisChange('misi', newMisi);
    };

    const addOsisMisi = () => {
        handleOsisChange('misi', [...osis.misi, '']);
    };

    const removeOsisMisi = (index: number) => {
        const newMisi = osis.misi.filter((_, i) => i !== index);
        handleOsisChange('misi', newMisi);
    };

    const handleOsisImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = await handleImageUpload(e.target.files[0]);
            if (url) {
                setOsis(prev => ({ ...prev, structureImage: url }));
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('visi-misi')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'visi-misi'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Visi & Misi
                </button>
                <button
                    onClick={() => setActiveTab('sejarah')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'sejarah'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Sejarah
                </button>
                <button
                    onClick={() => setActiveTab('struktur-organisasi')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'struktur-organisasi'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Struktur Organisasi
                </button>
                <button
                    onClick={() => setActiveTab('kepala-sekolah')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'kepala-sekolah'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Kepala Sekolah
                </button>
                <button
                    onClick={() => setActiveTab('osis')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'osis'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    OSIS
                </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'visi-misi' && (
                    <div className="space-y-8">
                        {/* Visi */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Eye className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Visi</h3>
                            </div>
                            <textarea
                                value={visiMisi.visi}
                                onChange={(e) => handleVisiMisiChange('visi', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                placeholder="Masukkan Visi Sekolah..."
                            />
                        </div>

                        {/* Misi */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Misi</h3>
                                </div>
                                <button
                                    onClick={addMisi}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Plus className="w-4 h-4" /> Tambah Misi
                                </button>
                            </div>
                            <div className="space-y-3">
                                {(visiMisi.misi || []).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-lg flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleMisiChange(index, e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={`Misi ${index + 1}`}
                                        />
                                        <button
                                            onClick={() => removeMisi(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Motto & Tagline */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Flag className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Motto</h3>
                                </div>
                                <input
                                    type="text"
                                    value={visiMisi.motto}
                                    onChange={(e) => handleVisiMisiChange('motto', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Motto Sekolah"
                                />
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Share2 className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Tagline</h3>
                                </div>
                                <input
                                    type="text"
                                    value={visiMisi.tagline}
                                    onChange={(e) => handleVisiMisiChange('tagline', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tagline Sosial Media"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sejarah' && (
                    <div className="space-y-8">
                        {/* Sejarah Singkat */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Sejarah Singkat</h3>
                            </div>
                            <textarea
                                value={sejarah.history}
                                onChange={(e) => handleSejarahChange('history', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                                placeholder="Cerita sejarah sekolah..."
                            />
                        </div>

                        {/* Informasi Pendirian & Kepala Sekolah */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">Informasi Pendirian</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NO. SK</label>
                                    <input
                                        type="text"
                                        value={sejarah.foundingInfo?.sk || ''}
                                        onChange={(e) => handleNestedSejarahChange('foundingInfo', 'sk', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                    <input
                                        type="text"
                                        value={sejarah.foundingInfo?.date || ''}
                                        onChange={(e) => handleNestedSejarahChange('foundingInfo', 'date', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NSS</label>
                                    <input
                                        type="text"
                                        value={sejarah.foundingInfo?.nss || ''}
                                        onChange={(e) => handleNestedSejarahChange('foundingInfo', 'nss', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NPSN</label>
                                    <input
                                        type="text"
                                        value={sejarah.foundingInfo?.npsn || ''}
                                        onChange={(e) => handleNestedSejarahChange('foundingInfo', 'npsn', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">Kepala Sekolah Pertama</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        value={sejarah.firstPrincipal?.name || ''}
                                        onChange={(e) => handleNestedSejarahChange('firstPrincipal', 'name', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Menjabat</label>
                                    <input
                                        type="text"
                                        value={sejarah.firstPrincipal?.year || ''}
                                        onChange={(e) => handleNestedSejarahChange('firstPrincipal', 'year', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <input
                                        type="text"
                                        value={sejarah.firstPrincipal?.status || ''}
                                        onChange={(e) => handleNestedSejarahChange('firstPrincipal', 'status', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Timeline Perkembangan</h3>
                                <button
                                    onClick={addTimeline}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Plus className="w-4 h-4" /> Tambah Timeline
                                </button>
                            </div>
                            <div className="space-y-4">
                                {(sejarah.timeline || []).map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={item.year}
                                                    onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                                                    className="w-24 p-2 border border-gray-300 rounded-lg"
                                                    placeholder="Tahun"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                                    placeholder="Judul Peristiwa"
                                                />
                                            </div>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg h-24"
                                                placeholder="Deskripsi"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeTimeline(index)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg self-start"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'struktur-organisasi' && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Struktur Organisasi</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Bagan Struktur</label>
                                    <div className="flex items-start gap-4">
                                        {strukturOrganisasi.imageUrl && (
                                            <img
                                                src={strukturOrganisasi.imageUrl}
                                                alt="Struktur Organisasi"
                                                className="w-48 h-auto rounded-lg border border-gray-300"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 max-w-max">
                                                <Upload className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm text-gray-600">Upload Gambar</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleStrukturImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Max: 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Struktur</label>
                                    <textarea
                                        value={strukturOrganisasi.description}
                                        onChange={(e) => setStrukturOrganisasi(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                                        placeholder="Jelaskan mengenai struktur organisasi sekolah..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'kepala-sekolah' && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Profil Kepala Sekolah</h3>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto Kepala Sekolah</label>
                                    <div className="space-y-3">
                                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300">
                                            {kepalaSekolah.photo ? (
                                                <img
                                                    src={kepalaSekolah.photo}
                                                    alt="Kepala Sekolah"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                            )}
                                        </div>
                                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-full">
                                            <Upload className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-600">Upload Foto</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleKepalaSekolahPhotoUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={kepalaSekolah.name}
                                            onChange={(e) => setKepalaSekolah(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nama Lengkap beserta gelar"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Periode Jabatan</label>
                                        <input
                                            type="text"
                                            value={kepalaSekolah.periode}
                                            onChange={(e) => setKepalaSekolah(prev => ({ ...prev, periode: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Contoh: 2022 - Sekarang"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Biografi Singkat</label>
                                        <textarea
                                            value={kepalaSekolah.bio}
                                            onChange={(e) => setKepalaSekolah(prev => ({ ...prev, bio: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                            placeholder="Riwayat singkat pendidikan atau karir..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sambutan</label>
                                        <textarea
                                            value={kepalaSekolah.sambutan}
                                            onChange={(e) => setKepalaSekolah(prev => ({ ...prev, sambutan: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                                            placeholder="Kata sambutan kepala sekolah..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'osis' && (
                    <div className="space-y-8">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Tentang OSIS</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Singkat</label>
                                    <textarea
                                        value={osis.description}
                                        onChange={(e) => handleOsisChange('description', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                        placeholder="Deskripsi singkat tentang OSIS..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Visi OSIS</h3>
                                </div>
                                <textarea
                                    value={osis.visi}
                                    onChange={(e) => handleOsisChange('visi', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                                    placeholder="Visi OSIS..."
                                />
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-gray-900">Misi OSIS</h3>
                                    </div>
                                    <button
                                        onClick={addOsisMisi}
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Misi
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {(osis.misi || []).map((item, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-lg flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleOsisMisiChange(index, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder={`Misi ${index + 1}`}
                                            />
                                            <button
                                                onClick={() => removeOsisMisi(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">Struktur Pengurus OSIS</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Struktur Organisasi</label>
                                <div className="flex items-start gap-4">
                                    {osis.structureImage && (
                                        <img
                                            src={osis.structureImage}
                                            alt="Struktur OSIS"
                                            className="w-48 h-auto rounded-lg border border-gray-300"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 max-w-max">
                                            <Upload className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-600">Upload Gambar</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleOsisImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Max: 2MB.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
