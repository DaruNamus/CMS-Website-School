import { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, UserCheck } from 'lucide-react';

interface OsisData {
    visi: string;
    misi: string[];
    structureImage: string;
    description: string;
}

interface Extracurricular {
    id: number;
    name: string;
    category: string;
    description: string;
    schedule: string;
    image: string;
}

export function Kesiswaan() {
    const [osis, setOsis] = useState<OsisData | null>(null);
    const [extras, setExtras] = useState<Extracurricular[]>([]);
    const [activeCategory, setActiveCategory] = useState('Semua');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch OSIS Data
            const profileRes = await fetch('http://localhost:5001/api/profile');
            if (profileRes.ok) {
                const data = await profileRes.json();
                if (data.osis) setOsis(data.osis);
            }

            // Fetch Extracurriculars
            const extrasRes = await fetch('http://localhost:5001/api/extracurriculars');
            const extrasData = await extrasRes.json();
            setExtras(extrasData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const categories = ['Semua', 'Wajib', 'Pilihan', 'Akademik', 'Non-Akademik'];

    const filteredExtras = activeCategory === 'Semua'
        ? extras
        : extras.filter(e => e.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Kesiswaan</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Wadah pengembangan potensi siswa melalui organisasi dan kegiatan ekstrakurikuler yang beragam.
                    </p>
                </div>

                {/* OSIS Section */}
                {osis && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 transistion-all duration-300 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">OSIS</h2>
                                    <p className="text-blue-100">Organisasi Siswa Intra Sekolah</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="prose max-w-none text-gray-600 mb-8">
                                <p className="text-lg leading-relaxed">{osis.description}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-blue-600" />
                                            Visi
                                        </h3>
                                        <p className="text-gray-700 italic">"{osis.visi}"</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <TargetIcon className="w-5 h-5 text-blue-600" />
                                            Misi
                                        </h3>
                                        <ul className="space-y-3">
                                            {osis.misi && osis.misi.map((m, i) => (
                                                <li key={i} className="flex gap-3 text-gray-700">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    {m}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-blue-600" />
                                        Struktur Organisasi
                                    </h3>
                                    {osis.structureImage ? (
                                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 group">
                                            <img
                                                src={osis.structureImage}
                                                alt="Struktur OSIS"
                                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                            Belum ada gambar struktur
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Extracurriculars Section */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Ekstrakurikuler</h2>
                            <p className="text-gray-600 mt-2">Salurkan bakat dan minatmu melalui berbagai kegiatan.</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExtras.map(extra => (
                            <div key={extra.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                    {extra.image ? (
                                        <img
                                            src={extra.image}
                                            alt={extra.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Trophy className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <span className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${extra.category === 'Wajib' ? 'bg-red-500/90 text-white' :
                                        extra.category === 'Akademik' ? 'bg-blue-500/90 text-white' :
                                            'bg-green-500/90 text-white'
                                        }`}>
                                        {extra.category}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {extra.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        <span>{extra.schedule || 'Jadwal kondisional'}</span>
                                    </div>
                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                        {extra.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredExtras.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Belum ada ekstrakurikuler di kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TargetIcon({ className }: { className?: string }) {
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}
