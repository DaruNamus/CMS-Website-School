import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Trophy, Award, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface News {
    id: number;
    title: string;
    content: string;
    category: string;
    image: string;
    date: string;
    created_at?: string;
}

export function Prestasi() {
    const [achievements, setAchievements] = useState<News[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/news');
            if (response.ok) {
                const data: News[] = await response.json();
                // Filter only 'Prestasi' category
                const filtered = data.filter(item => item.category === 'Prestasi');
                setAchievements(filtered);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Prestasi Siswa</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Jejak kebanggaan dan bukti dedikasi siswa-siswi SMAN 1 Gebog dalam mengharumkan nama sekolah.
                    </p>
                </div>

                {/* Achievement Cards */}
                {achievements.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((item) => (
                            <Link
                                key={item.id}
                                to={`/berita/${item.id}`}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                            <Trophy className="w-20 h-20 text-white/50" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                                        <div className="flex items-center text-white/90 text-sm font-medium">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(item.date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center mb-3">
                                        <Award className="w-5 h-5 text-yellow-500 mr-2" />
                                        <span className="text-sm font-bold text-yellow-600 uppercase tracking-wider">
                                            Achievement
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                                        {item.content}
                                    </p>

                                    <div className="flex items-center text-blue-600 font-semibold mt-auto group/link">
                                        Baca Selengkapnya
                                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <Medal className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada data prestasi</h3>
                        <p className="text-gray-500">Data prestasi siswa akan muncul di sini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
