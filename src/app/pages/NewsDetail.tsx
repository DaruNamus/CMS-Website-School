import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function NewsDetail() {
    const { id } = useParams();

    interface NewsItem {
        id: number;
        title: string;
        content: string;
        category: string;
        image: string;
        date: string;
    }

    const [news, setNews] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/news/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setNews(data);
                } else {
                    setError('Berita tidak ditemukan');
                }
            } catch (error) {
                console.error('Error fetching news detail:', error);
                setError('Gagal memuat berita');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Berita tidak ditemukan'}</h2>
                <Link to="/berita" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Kembali ke Berita
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Image */}
            <div className="h-[400px] relative w-full bg-gray-900">
                <ImageWithFallback
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold mb-4">
                            {news.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex items-center gap-6 text-gray-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{new Date(news.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span>Admin Sekolah</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {news.content}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <Link
                            to="/berita"
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar Berita
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
