import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, Users, Award, Building2, Calendar, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import heroBackground from '../../../dist/assets/01fb4d19d681cf31ecfc8d24461d0aa17a7955a0-DZHt30JC.png';

export function Home() {
  const stats = [
    { icon: Users, label: 'Siswa Aktif', value: '1000+' },
    { icon: Users, label: 'Guru & Staf', value: '85+' },
    { icon: Award, label: 'Prestasi', value: '500+' },
    { icon: Building2, label: 'Ruang Kelas', value: '36' },
  ];

  interface News {
    id: number;
    title: string;
    content: string;
    category: string;
    image: string;
    date: string;
  }

  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/news');
        if (response.ok) {
          const data = await response.json();
          // Take only the latest 3 news items
          setNews(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <img
          src={heroBackground}
          alt="SMAN 1 Gebog"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Selamat Datang di<br />SMAN 1 Gebog
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-50">
              Mencetak Generasi Unggul, Berakhlak Mulia, dan Berprestasi
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/profil/visi-misi"
                className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
                <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang SMAN 1 Gebog
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                SMAN 1 Gebog adalah salah satu sekolah menengah atas negeri yang berada di Kecamatan Gebog, Kabupaten Kudus, Provinsi Jawa Tengah. Sekolah ini berkomitmen untuk menyelenggarakan pendidikan berkualitas yang berorientasi pada pengembangan prestasi akademik, nonakademik, serta pembentukan karakter peserta didik yang berakhlak mulia, disiplin, dan bertanggung jawab.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                SMAN 1 Gebog didukung oleh tenaga pendidik dan kependidikan yang profesional serta fasilitas pembelajaran yang memadai, seperti ruang kelas yang nyaman, laboratorium, perpustakaan, dan sarana pendukung kegiatan ekstrakurikuler. Dalam proses pembelajaran, sekolah ini menerapkan kurikulum yang sesuai dengan kebijakan pendidikan nasional serta mendorong pemanfaatan teknologi informasi guna meningkatkan mutu pembelajaran.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Selain fokus pada prestasi akademik, SMAN 1 Gebog juga aktif dalam berbagai kegiatan ekstrakurikuler, organisasi siswa, dan pengembangan minat bakat peserta didik di bidang seni, olahraga, serta kegiatan kepramukaan. Dengan semangat kebersamaan dan budaya sekolah yang positif, SMAN 1 Gebog berupaya mencetak lulusan yang berprestasi, berdaya saing, dan siap melanjutkan pendidikan ke jenjang yang lebih tinggi maupun terjun ke masyarakat.
              </p>
              <Link
                to="/profil/visi-misi"
                className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800"
              >
                Selengkapnya <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBsaWJyYXJ5fGVufDF8fHx8MTc2ODc5MzM3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Suasana Belajar"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Keunggulan Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai program dan fasilitas unggulan untuk mendukung prestasi siswa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kurikulum Merdeka</h3>
              <p className="text-gray-600">
                Implementasi kurikulum merdeka yang memberikan fleksibilitas dan inovasi dalam pembelajaran.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Guru Berkualitas</h3>
              <p className="text-gray-600">
                Tenaga pengajar profesional dan berpengalaman yang peduli terhadap perkembangan siswa.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fasilitas Modern</h3>
              <p className="text-gray-600">
                Sarana dan prasarana lengkap dan modern untuk mendukung kegiatan belajar mengajar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Berita & Pengumuman</h2>
            <Link to="/berita" className="text-blue-700 font-semibold hover:text-blue-800 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <Link
                    to={`/berita/${item.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm"
                  >
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
