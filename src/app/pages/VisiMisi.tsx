import { useState, useEffect } from 'react';
import { Target, Eye, CheckCircle, Flag, Share2 } from 'lucide-react';

interface VisiMisiData {
  visi: string;
  misi: string[];
  motto: string;
  tagline: string;
  tujuan: { label: string; text: string; subItems?: string[] }[];
}

export function VisiMisi() {
  const [data, setData] = useState<VisiMisiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.visi_misi) {
          setData(data.visi_misi);
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            <span className="hover:text-blue-700">Home</span> / <span className="hover:text-blue-700">Profil Sekolah</span> / <span className="text-gray-900">Visi & Misi</span>
          </p>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-12">Visi & Misi</h1>

        {/* Visi */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <p className="text-lg text-gray-800 leading-relaxed">
              {data.visi}
            </p>
          </div>
        </div>

        {/* Misi */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
          </div>

          <div className="space-y-4">
            {(data.misi || []).map((misi, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-700 font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 leading-relaxed flex-1">{misi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motto */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Motto</h2>
          </div>
          <p className="text-2xl font-bold text-white text-center py-4">
            {data.motto}
          </p>
        </div>

        {/* Tagline Sosial Media */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tagline Sosial Media</h2>
          </div>
          <p className="text-xl font-bold text-blue-700 text-center py-2">
            {data.tagline}
          </p>
        </div>

        {/* Tujuan */}
        <div className="bg-white rounded-xl p-8 shadow-sm mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tujuan SMAN 1 Gebog</h2>
          </div>

          <div className="space-y-4">
            {(data.tujuan || []).map((tujuan, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-700 font-bold text-sm">{tujuan.label}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed">{tujuan.text}</p>
                  {tujuan.subItems && (
                    <ul className="mt-3 space-y-2 ml-4">
                      {tujuan.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">j.{subIndex + 1}</span>
                          <span>{subItem}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
