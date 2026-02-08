import { useState, useEffect } from 'react';
import { Building2, Search, Filter } from 'lucide-react';

interface Facility {
    id: number;
    name: string;
    description: string;
    category: string;
    image: string;
}

export function SaranaPrasarana() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Umum', 'Akademik', 'Olahraga', 'Kesenian', 'Ibadah'];

    useEffect(() => {
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

        fetchFacilities();
    }, []);

    const filteredFacilities = facilities.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Sarana & Prasarana</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Fasilitas lengkap dan modern untuk mendukung kegiatan belajar mengajar dan pengembangan potensi siswa.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-12">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Filter className="w-5 h-5" />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Semua
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari fasilitas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {filteredFacilities.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFacilities.map(facility => (
                            <div key={facility.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                                <div className="h-64 overflow-hidden bg-gray-200 relative">
                                    {facility.image ? (
                                        <img
                                            src={facility.image}
                                            alt={facility.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Building2 className="w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-800 shadow-sm">
                                        {facility.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {facility.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {facility.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak ditemukan</h3>
                        <p className="text-gray-500">Coba ubah kata kunci pencarian atau kategori.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
