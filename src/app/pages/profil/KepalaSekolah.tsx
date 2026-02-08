import { useState, useEffect } from 'react';
import { User, Quote } from 'lucide-react';

interface KepalaSekolahData {
    name: string;
    photo: string;
    periode: string;
    sambutan: string;
    bio: string;
}

export function KepalaSekolah() {
    const [data, setData] = useState<KepalaSekolahData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/profile');
            if (response.ok) {
                const result = await response.json();
                if (result.kepala_sekolah) {
                    setData(result.kepala_sekolah);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {data ? (
                            <div className="flex flex-col md:flex-row">
                                {/* Photo Section */}
                                <div className="md:w-1/3 bg-blue-50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
                                    <div className="w-48 h-64 bg-white rounded-xl shadow-md overflow-hidden mb-6 border-4 border-white">
                                        {data.photo ? (
                                            <img
                                                src={data.photo}
                                                alt={data.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <User className="w-20 h-20" />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
                                    <p className="text-blue-600 font-medium mt-1">Kepala Sekolah</p>
                                    <div className="mt-4 inline-block bg-white px-4 py-1 rounded-full text-sm text-gray-500 border border-gray-200">
                                        Periode: {data.periode}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="md:w-2/3 p-8 md:p-12">
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Quote className="w-6 h-6 text-blue-600" />
                                                <h3 className="text-xl font-bold text-gray-900">Sambutan</h3>
                                            </div>
                                            <div className="prose text-gray-600 leading-relaxed whitespace-pre-wrap italic bg-gray-50 p-6 rounded-xl border border-gray-100">
                                                "{data.sambutan}"
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Biografi Singkat</h3>
                                            <div className="prose text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                {data.bio}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                <p>Data kepala sekolah belum tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
