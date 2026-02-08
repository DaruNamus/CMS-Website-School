import { useState, useEffect } from 'react';
import { Calendar, FileText, CheckCircle, AlertCircle, Clock, Users, Phone, Mail } from 'lucide-react';

interface TimelineItem {
  phase: string;
  date: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  hours: string;
}

export function PPDB() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([
    { phase: 'Pendaftaran', date: '1 - 15 Juni 2026' },
    { phase: 'Seleksi Administrasi', date: '16 - 18 Juni 2026' },
    { phase: 'Pengumuman Hasil', date: '20 Juni 2026' },
    { phase: 'Daftar Ulang', date: '21 - 25 Juni 2026' },
  ]);

  const [requirements, setRequirements] = useState<string[]>([
    'Fotocopy Ijazah/SKHUN yang dilegalisir (2 lembar)',
    'Fotocopy Akta Kelahiran (2 lembar)',
    'Fotocopy Kartu Keluarga (2 lembar)',
    'Pas foto berwarna ukuran 3x4 (4 lembar)',
    'Fotocopy Kartu NISN',
    'Surat Keterangan Sehat dari Dokter',
    'Surat Keterangan Kelakuan Baik dari Sekolah',
  ]);

  const [contact, setContact] = useState<ContactInfo>({
    phone: '(0291) 123456',
    email: 'ppdb@sman1gebog.sch.id',
    hours: '08:00 - 15:00 WIB'
  });

  useEffect(() => {
    const fetchPPDBData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/ppdb');
        if (response.ok) {
          const data = await response.json();
          if (data.timeline) setTimeline(data.timeline);
          if (data.requirements) setRequirements(data.requirements);
          if (data.contact) setContact(data.contact);
        }
      } catch (error) {
        console.error('Error fetching PPDB data:', error);
      }
    };

    fetchPPDBData();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="text-xl text-blue-50 mb-6">
              Tahun Ajaran 2026/2027
            </p>
            <p className="text-blue-50 mb-8">
              Bergabunglah dengan SMAN 1 Gebog dan wujudkan impian pendidikan berkualitas Anda
            </p>
            <button className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Daftar Sekarang
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-bold text-gray-900">Jadwal PPDB</h2>
              </div>

              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.phase}</h3>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-bold text-gray-900">Persyaratan Pendaftaran</h2>
              </div>

              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jalur Pendaftaran */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Jalur Pendaftaran</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Jalur Prestasi</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Untuk siswa berprestasi akademik maupun non-akademik tingkat kabupaten/provinsi
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kuota: 20%</li>
                    <li>• Nilai rata-rata minimal 85</li>
                    <li>• Sertifikat prestasi</li>
                  </ul>
                </div>

                <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Jalur Zonasi</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Untuk siswa yang berdomisili di zona sekolah sesuai ketentuan
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kuota: 60%</li>
                    <li>• Domisili sesuai zona</li>
                    <li>• KK minimal 1 tahun</li>
                  </ul>
                </div>

                <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Jalur Afirmasi</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Untuk siswa dari keluarga kurang mampu dengan ketentuan khusus
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kuota: 15%</li>
                    <li>• Surat keterangan tidak mampu</li>
                    <li>• Kartu KIP/PKH</li>
                  </ul>
                </div>

                <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Jalur Perpindahan</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Untuk siswa yang mengalami perpindahan tugas orang tua
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kuota: 5%</li>
                    <li>• Surat tugas orang tua</li>
                    <li>• Surat keterangan pindah</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-gray-900">Informasi Penting</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Pendaftaran dilakukan secara online melalui portal PPDB resmi</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Tidak ada pungutan biaya pendaftaran</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Pengumuman hasil seleksi akan ditampilkan di website sekolah</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Daftar ulang wajib dilakukan sesuai jadwal</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Butuh Bantuan?</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-500">Telepon</p>
                  </div>
                  <p className="font-semibold text-gray-900 pl-6">{contact.phone}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-500">Email</p>
                  </div>
                  <p className="font-semibold text-gray-900 pl-6">{contact.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-500">Jam Layanan</p>
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <p className="font-semibold text-gray-900">{contact.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Unduh Dokumen</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Panduan PPDB 2026</span>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Formulir Pendaftaran</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
