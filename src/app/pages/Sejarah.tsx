import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

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

export function Sejarah() {
  const [data, setData] = useState<SejarahData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.sejarah) {
          setData(data.sejarah);
        }
      })
      .catch(err => console.error('Error fetching profile:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            <span className="hover:text-blue-700">Home</span> / <span className="hover:text-blue-700">Profil Sekolah</span> / <span className="text-gray-900">Sejarah</span>
          </p>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Sejarah SMAN 1 Gebog</h1>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sejarah Singkat</h2>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed whitespace-pre-line">
            {data.history}
          </div>
        </div>

        {/* Info Box */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Informasi Pendirian</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>SK Pendirian:</strong> {data.foundingInfo.sk}</p>
              <p><strong>Tanggal:</strong> {data.foundingInfo.date}</p>
              <p><strong>NSS:</strong> {data.foundingInfo.nss}</p>
              <p><strong>NPSN:</strong> {data.foundingInfo.npsn}</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Kepala Sekolah Pertama</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Nama:</strong> {data.firstPrincipal.name}</p>
              <p><strong>Tahun:</strong> {data.firstPrincipal.year}</p>
              <p><strong>Status:</strong> {data.firstPrincipal.status}</p>
            </div>
          </div>
        </div>

        {/* Timeline Perkembangan */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Perkembangan Sekolah</h2>

          <div className="space-y-6">
            {data.timeline.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Penghargaan & Apresiasi */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Komitmen Kami</h2>
          <p className="text-blue-50 leading-relaxed">
            Dengan pengalaman lebih dari 32 tahun, SMAN 1 Gebog terus berkomitmen untuk memberikan pendidikan berkualitas, mengamalkan ilmu kepada masyarakat, dan mempersiapkan generasi muda yang unggul dalam ilmu pengetahuan, teknologi, iman, takwa, dan seni untuk masa depan yang lebih baik.
          </p>
        </div>
      </div>
    </div>
  );
}
