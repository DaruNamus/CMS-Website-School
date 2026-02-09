import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

interface TimelineItem {
    phase: string;
    date: string;
}

interface ContactInfo {
    phone: string;
    email: string;
    hours: string;
}

export function PPDBEditor() {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [contact, setContact] = useState<ContactInfo>({ phone: '', email: '', hours: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/ppdb');
            const data = await response.json();

            if (data.timeline) setTimeline(data.timeline);
            if (data.requirements) setRequirements(data.requirements);
            if (data.contact) setContact(data.contact);
        } catch (error) {
            console.error('Error fetching PPDB data:', error);
            setMessage('Gagal memuat data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost:5001/api/ppdb', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeline, requirements, contact }),
            });

            if (response.ok) {
                setMessage('Perubahan berhasil disimpan!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Gagal menyimpan perubahan.');
            }
        } catch (error) {
            console.error('Error saving PPDB data:', error);
            setMessage('Terjadi kesalahan saat menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    // Timeline Handlers
    const addTimeline = () => setTimeline([...timeline, { phase: '', date: '' }]);
    const removeTimeline = (index: number) => setTimeline(timeline.filter((_, i) => i !== index));
    const updateTimeline = (index: number, field: keyof TimelineItem, value: string) => {
        const newTimeline = [...timeline];
        newTimeline[index][field] = value;
        setTimeline(newTimeline);
    };

    // Requirements Handlers
    const addRequirement = () => setRequirements([...requirements, '']);
    const removeRequirement = (index: number) => setRequirements(requirements.filter((_, i) => i !== index));
    const updateRequirement = (index: number, value: string) => {
        const newReqs = [...requirements];
        newReqs[index] = value;
        setRequirements(newReqs);
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg ${message.includes('Gagal') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Timeline Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
                    Jadwal PPDB
                    <button onClick={addTimeline} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Tambah Jadwal
                    </button>
                </h3>
                <div className="space-y-3">
                    {(timeline || []).map((item, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <input
                                type="text"
                                value={item.phase}
                                onChange={(e) => updateTimeline(index, 'phase', e.target.value)}
                                placeholder="Nama Tahapan (mis: Pendaftaran)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                                type="text"
                                value={item.date}
                                onChange={(e) => updateTimeline(index, 'date', e.target.value)}
                                placeholder="Tanggal/Waktu"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <button
                                onClick={() => removeTimeline(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Requirements Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
                    Persyaratan
                    <button onClick={addRequirement} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Tambah Syarat
                    </button>
                </h3>
                <div className="space-y-3">
                    {(requirements || []).map((req, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <span className="text-gray-400 font-medium w-6 text-center">{index + 1}.</span>
                            <input
                                type="text"
                                value={req}
                                onChange={(e) => updateRequirement(index, e.target.value)}
                                placeholder="Isi persyaratan..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <button
                                onClick={() => removeRequirement(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kontak & Informasi</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                        <input
                            type="text"
                            value={contact?.phone || ''}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="text"
                            value={contact?.email || ''}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Layanan</label>
                        <input
                            type="text"
                            value={contact?.hours || ''}
                            onChange={(e) => setContact({ ...contact, hours: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
}
