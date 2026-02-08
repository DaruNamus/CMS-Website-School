import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import logoImage from '../../../dist/assets/82638718b11b8c7d3aa2d06d0ffdc6ac233a7feb-glfBItFQ.png';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Tentang Sekolah */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImage} alt="Logo SMAN 1 Gebog" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="font-bold text-white">SMAN 1 GEBOG</h3>
                <p className="text-xs text-blue-400">SMA Negeri 1 Gebog</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Sekolah Menengah Atas Negeri 1 Gebog adalah lembaga pendidikan berkualitas yang berkomitmen mencetak generasi unggul dan berakhlak mulia.
            </p>
          </div>

          {/* Menu Cepat */}
          <div>
            <h3 className="font-bold text-white mb-4">Menu Cepat</h3>
            <ul className="space-y-2">
              <li><Link to="/profil/visi-misi" className="text-sm hover:text-blue-400 transition-colors">Visi & Misi</Link></li>
              <li><Link to="/profil/sejarah" className="text-sm hover:text-blue-400 transition-colors">Sejarah Sekolah</Link></li>
              <li><Link to="/kesiswaan" className="text-sm hover:text-blue-400 transition-colors">Kesiswaan</Link></li>
              <li><Link to="/kurikulum" className="text-sm hover:text-blue-400 transition-colors">Kurikulum</Link></li>
              <li><Link to="/prestasi" className="text-sm hover:text-blue-400 transition-colors">Prestasi</Link></li>
              <li><Link to="/ppdb" className="text-sm hover:text-blue-400 transition-colors">PPDB</Link></li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="font-bold text-white mb-4">Informasi</h3>
            <ul className="space-y-2">
              <li><Link to="/berita" className="text-sm hover:text-blue-400 transition-colors">Berita Terkini</Link></li>
              <li><Link to="/pengumuman" className="text-sm hover:text-blue-400 transition-colors">Pengumuman</Link></li>
              <li><Link to="/galeri/foto" className="text-sm hover:text-blue-400 transition-colors">Galeri Foto</Link></li>
              <li><Link to="/galeri/video" className="text-sm hover:text-blue-400 transition-colors">Galeri Video</Link></li>
              <li><Link to="/sarana-prasarana" className="text-sm hover:text-blue-400 transition-colors">Sarana & Prasarana</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-bold text-white mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Jl. PR Sukun Gondosari<br />
                  Gebog, Kudus<br />
                  Jawa Tengah, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">(0291) 123456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">info@sman1gebog.sch.id</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} SMAN 1 Gebog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
