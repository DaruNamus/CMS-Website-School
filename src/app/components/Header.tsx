import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImage from '../../../dist/assets/82638718b11b8c7d3aa2d06d0ffdc6ac233a7feb-glfBItFQ.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilDropdown, setProfilDropdown] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    checkLogin();
    window.addEventListener('auth-change', checkLogin);
    return () => window.removeEventListener('auth-change', checkLogin);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & School Name */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImage} alt="Logo SMAN 1 Gebog" className="w-12 h-12 object-contain" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-gray-900">SMAN 1 GEBOG</h1>
              <p className="text-xs text-blue-700">Sekolah Menengah Atas Negeri</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Home
            </Link>

            {/* Profil Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setProfilDropdown(true)}
                onMouseLeave={() => setProfilDropdown(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${location.pathname.startsWith('/profil') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Profil Sekolah
                <ChevronDown className="w-4 h-4" />
              </button>
              {profilDropdown && (
                <div
                  onMouseEnter={() => setProfilDropdown(true)}
                  onMouseLeave={() => setProfilDropdown(false)}
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                >
                  <Link to="/profil/visi-misi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Visi & Misi</Link>
                  <Link to="/profil/sejarah" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Sejarah</Link>
                  <Link to="/profil/struktur-organisasi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Struktur Organisasi</Link>
                  <Link to="/profil/kepala-sekolah" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Kepala Sekolah</Link>
                  <Link to="/profil/guru-staf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Guru & Staf</Link>
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${location.pathname.startsWith('/kesiswaan') || location.pathname.startsWith('/prestasi') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Kesiswaan
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/kesiswaan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Organisasi & Ekskul</Link>
                <Link to="/prestasi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Prestasi Siswa</Link>
              </div>
            </div>

            <Link to="/kurikulum" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/kurikulum') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Kurikulum</Link>
            <Link to="/sarana-prasarana" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/sarana-prasarana') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Sarana & Prasarana</Link>
            <Link to="/berita" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/berita') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Berita</Link>

            <Link to="/galeri" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/galeri') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Galeri</Link>

            <Link to="/ppdb" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}>PPDB</Link>
            <Link to="/kontak" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/kontak') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Kontak</Link>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            {isLoggedIn ? (
              <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100`}>Dashboard</Link>
            ) : (
              <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-600 text-blue-600 hover:bg-blue-50`}>Login</Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <Link to="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">Home</Link>
            <div className="mt-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Profil Sekolah</p>
              <Link to="/profil/visi-misi" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Visi & Misi</Link>
              <Link to="/profil/sejarah" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Sejarah</Link>
              <Link to="/profil/struktur-organisasi" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Struktur Organisasi</Link>
              <Link to="/profil/kepala-sekolah" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Kepala Sekolah</Link>
              <Link to="/profil/guru-staf" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Guru & Staf</Link>
            </div>
            <div className="mt-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Kesiswaan</p>
              <Link to="/kesiswaan" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Organisasi & Ekskul</Link>
              <Link to="/prestasi" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg ml-4">Prestasi Siswa</Link>
            </div>
            <Link to="/kurikulum" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">Kurikulum</Link>
            <Link to="/sarana-prasarana" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">Sarana & Prasarana</Link>
            <Link to="/berita" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">Berita</Link>
            <Link to="/galeri" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">Galeri</Link>
            <Link to="/ppdb" className="block px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg mt-2">PPDB</Link>
            <Link to="/kontak" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">Kontak</Link>
            {isLoggedIn ? (
              <Link to="/admin" className="block px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 mt-2 text-center">Dashboard</Link>
            ) : (
              <Link to="/admin" className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 mt-2 text-center">Login Admin</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
