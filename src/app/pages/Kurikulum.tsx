import { useState, useEffect } from 'react';
import { BookOpen, Star, ChevronRight } from 'lucide-react';

export function Kurikulum() {
    const [data, setData] = useState({
        struktur_kurikulum: {
            description: '',
            image: ''
        },
        program_unggulan: [] as { id: number; title: string; description: string; image: string }[]
    });
    const [isLoading, setIsLoading] = useState(true);

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
                    <h1 className="text-4xl font-bold mb-4">Kurikulum</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Sistem pembelajaran dan program unggulan SMAN 1 Gebog untuk mencetak generasi berprestasi.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

                {/* Struktur Kurikulum Section */}
                <section className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Struktur Kurikulum</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="prose prose-lg text-gray-600">
                            <p className="whitespace-pre-wrap">{data.struktur_kurikulum.description || 'Belum ada deskripsi kurikulum.'}</p>
                        </div>

                        {data.struktur_kurikulum.image && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <img
                                    src={data.struktur_kurikulum.image}
                                    alt="Struktur Kurikulum"
                                    className="w-full rounded-lg shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Program Unggulan Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                            <Star className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Program Unggulan</h2>
                    </div>

                    {data.program_unggulan.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.program_unggulan.map((program) => (
                                <div key={program.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                                    <div className="h-48 overflow-hidden bg-gray-200">
                                        {program.image ? (
                                            <img
                                                src={program.image}
                                                alt={program.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Star className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3">
                                            {program.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                                            <span>Selengkapnya</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">Belum ada data program unggulan.</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
