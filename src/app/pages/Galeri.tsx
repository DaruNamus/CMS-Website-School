import { useState, useEffect } from 'react';
import { ImageIcon, ZoomIn, X } from 'lucide-react';

interface Photo {
    id: number;
    title: string;
    description: string;
    category: string;
    image_url: string;
    created_at: string;
}

export function Galeri() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [filter, setFilter] = useState('Semua');
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(true);

    const categories = ['Semua', 'Kegiatan', 'Fasilitas', 'Prestasi', 'Lainnya'];

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
            setLoading(false);
        }
    };

    const filteredPhotos = filter === 'Semua'
        ? photos
        : photos.filter(photo => photo.category === filter);

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <div className="bg-blue-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Galeri Sekolah</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Dokumentasi kegiatan, fasilitas, dan momen berharga di SMAN 1 Gebog.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === category
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : filteredPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPhotos.map(photo => (
                            <div
                                key={photo.id}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={photo.image_url}
                                        alt={photo.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <ZoomIn className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm">
                                            {photo.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {photo.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {photo.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada foto</h3>
                        <p className="text-gray-500">Tidak ada foto ditemukan untuk kategori ini.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div
                        className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={selectedPhoto.image_url}
                            alt={selectedPhoto.title}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-6 text-center text-white max-w-2xl">
                            <h3 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h3>
                            <p className="text-gray-300">{selectedPhoto.description}</p>
                            <span className="inline-block mt-4 px-4 py-1 bg-white/10 rounded-full text-sm">
                                {selectedPhoto.category}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
