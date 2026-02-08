import { useState, useEffect } from 'react';
import { User, Briefcase, BookOpen, Search } from 'lucide-react';

interface Staff {
    id: number;
    name: string;
    nip: string;
    position: 'Guru' | 'Staff';
    subject: string;
    photo: string | null;
}

export function GuruStaff() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Guru' | 'Staff'>('Guru');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/staff');
            if (response.ok) {
                const data = await response.json();
                setStaffList(data);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStaff = staffList.filter(staff => {
        const matchesTab = staff.position === activeTab;
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.subject && staff.subject.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Guru & Staff</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Berkenalan dengan tenaga pendidik dan kependidikan yang berdedikasi mencerdaskan kehidupan bangsa di SMAN 1 Gebog.
                    </p>
                </div>

                {/* Controls */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                        {/* Tabs */}
                        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-200">
                            <button
                                onClick={() => setActiveTab('Guru')}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'Guru'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Guru / Pengajar
                            </button>
                            <button
                                onClick={() => setActiveTab('Staff')}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'Staff'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Staff / Tenaga Kependidikan
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Cari ${activeTab.toLowerCase()}...`}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : filteredStaff.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStaff.map((staff) => (
                            <div key={staff.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden group">
                                    {staff.photo ? (
                                        <img
                                            src={staff.photo}
                                            alt={staff.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center flex-col text-gray-400">
                                            <User className="w-16 h-16 mb-2 opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={staff.name}>
                                        {staff.name}
                                    </h3>

                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{staff.position}</span>
                                        </div>

                                        {staff.subject && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <BookOpen className="w-4 h-4" />
                                                <span className="line-clamp-1">{staff.subject}</span>
                                            </div>
                                        )}

                                        {/* Optional: Show NIP if needed, usually filtered out for public but can be shown */}
                                        {/* {staff.nip && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100 mt-3 hover:text-gray-700 transition-colors">
                                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">NIP: {staff.nip}</span>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data</h3>
                        <p className="text-gray-500">
                            Data {activeTab.toLowerCase()} belum tersedia atau tidak ditemukan.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
