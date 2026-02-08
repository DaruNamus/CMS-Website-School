import { useState, useEffect } from 'react';

interface StrukturOrganisasiData {
    description: string;
    imageUrl: string;
}

export function StrukturOrganisasi() {
    const [data, setData] = useState<StrukturOrganisasiData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/profile');
            if (response.ok) {
                const result = await response.json();
                if (result.struktur_organisasi) {
                    setData(result.struktur_organisasi);
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
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4">Struktur Organisasi</h1>

                        {data ? (
                            <div className="space-y-8">
                                {data.imageUrl && (
                                    <div className="flex justify-center">
                                        <img
                                            src={data.imageUrl}
                                            alt="Bagan Struktur Organisasi"
                                            className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                                        />
                                    </div>
                                )}

                                {data.description && (
                                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {data.description}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                <p>Data struktur organisasi belum tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
