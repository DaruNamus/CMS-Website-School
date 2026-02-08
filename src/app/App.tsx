import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Home } from '@/app/pages/Home';
import { VisiMisi } from '@/app/pages/VisiMisi';
import { Sejarah } from '@/app/pages/Sejarah';
import { StrukturOrganisasi } from '@/app/pages/profil/StrukturOrganisasi';
import { KepalaSekolah } from '@/app/pages/profil/KepalaSekolah';
import { GuruStaff } from '@/app/pages/profil/GuruStaff';
import { Kesiswaan } from '@/app/pages/Kesiswaan';
import { Kurikulum } from '@/app/pages/Kurikulum';
import { SaranaPrasarana } from '@/app/pages/SaranaPrasarana';
import { Prestasi } from '@/app/pages/Prestasi';
import { PPDB } from '@/app/pages/PPDB';
import { Kontak } from '@/app/pages/Kontak';
import { Admin } from '@/app/pages/Admin';

import { News } from '@/app/pages/News';
import { NewsDetail } from '@/app/pages/NewsDetail';
import { Galeri } from '@/app/pages/Galeri';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Profil Sekolah */}
            <Route path="/profil/visi-misi" element={<VisiMisi />} />
            <Route path="/profil/sejarah" element={<Sejarah />} />
            <Route path="/profil/struktur-organisasi" element={<StrukturOrganisasi />} />
            <Route path="/profil/kepala-sekolah" element={<KepalaSekolah />} />
            <Route path="/profil/guru-staf" element={<GuruStaff />} />

            {/* Kesiswaan */}
            <Route path="/kesiswaan" element={<Kesiswaan />} />

            <Route path="/kurikulum" element={<Kurikulum />} />
            <Route path="/sarana-prasarana" element={<SaranaPrasarana />} />

            <Route path="/berita" element={<News />} />
            <Route path="/berita/:id" element={<NewsDetail />} />

            {/* Galeri */}
            <Route path="/galeri" element={<Galeri />} />


            {/* Prestasi & PPDB */}
            <Route path="/prestasi" element={<Prestasi />} />
            <Route path="/ppdb" element={<PPDB />} />

            {/* Kontak */}
            <Route path="/kontak" element={<Kontak />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
