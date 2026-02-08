import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: '',
    database: 'sma1gebog'
};

async function createTable() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection(dbConfig);

        console.log('Creating table if not exists...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS profile_content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section_key VARCHAR(50) NOT NULL UNIQUE,
                content JSON,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Check removed to force update
        if (true) {
            console.log('Inserting default data...');

            // Default Visi Misi Data
            const defaultVisiMisi = {
                visi: 'Terbentuknya warga sekolah yang berakhlak terpuji, berprestasi, berwawasan, berbudaya bangsa dan peduli terhadap lingkungan.',
                misi: [
                    'Menimbulkan penghayatan dan pengalaman terhadap agama yang menjadi kearifan dalam berfikir dan bertingkah laku.',
                    'Mendorong dan membantu setiap siswa untuk, mengenali potensi dirinya serta membekali seluruh siswa dengan berbagai lifeskill untuk menghadapi era globalisasi.',
                    'Menumbuhkan semangat keunggulan secara intensif kepada seluruh peserta didik.',
                    'Melaksanakan pembelajaran dan pembimbing secara aktif, kreatif, inovatif dan berkarakter.',
                    'Menumbuhkan sikap disiplin dan bangga sebagai peserta didik terhadap almamater dan budaya bangsa.',
                    'Mengembangkan sikap splidaritas komunikasi dan informasi untuk meningkatkan pelayanan publik.',
                    'Menumbuhkan sikap cinta lingkungan dengan upaya pelestarian lingkungan, pencegahan pendernaan dan pencegahan kerusakan.'
                ],
                motto: 'LOKASI PINGGIRAN PRESTASI PUSAT PERHATIAN',
                tagline: 'BERAKHLAK, BERBUDAYA, BERPRESTASI',
                tujuan: [
                    { label: 'a', text: 'Membentuk sikap dan perilaku yang mencerminkan aklhak dan budaya bangsa yang religius, santun, dan berkarakter' },
                    { label: 'b', text: 'Memberikan wadah bagi para siswa untuk mengembangkan minat dan bakat yang dimilikinya dengan berbagai kegiatan ekstra kurikuler (BTA, Qiroatul Qur\'an, rebana teater, film, menyablon, elektronika, bola volley, sepakbola, karate, dan lain-lain)' },
                    { label: 'c', text: 'Memiliki tim KIR/OSN/olahraga/kesenian yang mempu bersaing di tingkat regional maupun nasional' },
                    { label: 'd', text: 'Meningkatkan prestasi baik akademik dan non akademik yang membanggakan bagi warga sekolah dan masyarakat sekitar' },
                    { label: 'e', text: 'Meningkatkan kedisiplinan siswa dan memberikan motifasi belajar secara terus menerus agar tumbuh menjadi siswa yang cerdas, santun, dan berkepribadian' },
                    { label: 'f', text: 'Memiliki sistem informasi manajemen informatika yang cepat, akurat, dan berkualitas untuk mengakses berbagai informasi penting untuk meningkatkan pelayanan kepada masyarakat sekitar' },
                    { label: 'g', text: 'Mewujudkan perlindungan dan pengelolaan lingkungan hidup melalui pelestarian fungsi LH' },
                    { label: 'h', text: 'Mewujudkan perlindungan dan pengelolaan lingkungan hidup melalui pencegahan pencemaran LH' },
                    { label: 'i', text: 'Mewujudkan perlindungan dan pengelolaan lingkungan hidup melalui pencegahan kerusakan LH' },
                    {
                        label: 'j',
                        text: 'Menerapkan Adiwiyata di sekolah dalam kehidupan sehari-hari:',
                        subItems: [
                            'Memiliki tim siaga lingkungan dan petugas kebersihan yang cukup',
                            'Tersedianya ruang yang cukup menjamin keamanan, kenyamanan, bermain, dan berolahraga',
                            'Tersedianya ruang belajar dengan ventilasi dan pencahayaan yang memadai',
                            'Tersedianya UKS yang memadai',
                            'Tersedianya kantin yang sehat dan representatif',
                            'Tersedianya sarana air bersih bagi warga sekolah',
                            'Tersedianya serapan air yang cukup',
                            'Tersedianya toilet yang cukup bagi warga sekolah',
                            'Tersedianya tempat sampah di setiap ruang, sarana pemilahan sampah, dan komposter',
                            'Tersedianya saluran air buang yang memadai',
                            'Meminimalisasi penggunaan plastik dalam kehidupan sehari-hari',
                            'Penanaman tumbuhan yang memberikan suasana keindahan, kerindangan, dan menyediakan oksigen yang cukup bagi warga sekolah',
                            'Memiliki green house yang berisi tanaman langka sebagai media pembelajaran'
                        ]
                    }
                ]
            };

            await connection.query('TRUNCATE TABLE profile_content');
            console.log('Table truncated. Inserting default data...');

            // Default Sejarah Data
            const defaultSejarah = {
                history: `SMA Negeri 1 Gebog Kudus merupakan satu-satunya SMA Negeri diwilayah Gondosari Kecamatan Gebog. Pada tahun 2024 ini, usia sekolahnya sudah mencapai 32 tahun. SMA Negeri 1 Gebog berdiri di atas tanah hibah dari salah satu Direksi PT SUKUN WARTONO INDONESIA, yaitu bapak H. Tas'an Wartono.\n\nKeberadaan suatu Sekolah tidak lahir begitu saja, akan tetapi sering kali karena berbagai hal yang melingkupi dan menuntut keberadaannya. Demikian juga dengan SMA Negeri 1 Gebog yang kemunculannya atau berdirinya karena ada komitmen yang besar dari para pendiri untuk mengamalkan ilmu yang telah dimiliki kepada masyarakat. Serta adanya tuntutan perkembangan masyarakat akan pentingnya ilmu pengetahuan dan perkembangan kehidupan dimasa yang akan datang. Dengan adanya sekolah menengah atas ini diharapkan dapat membekali siswa untuk mempersiapkan kehidupannya dimasa yang akan datang.\n\nUntuk mempersiapkan sumber daya manusia yang memiliki keunggulan dalam bidang ilmu pengetahuan dan teknologi, iman dan takwa, serta seni, SMA Negeri 1 Gebog didirikan berdasarkan surat keputusan Menteri pendidikan dan kebudayaan Republik Indonesia Nomor SK. 0216/O/1992 Tanggal 5 Mei 1992, NSS. 301031908021, NPSN. 20317492, yang lokasinya berada di Jl. PR Sukun Gondosari Gebog Kudus. Dipimpin oleh Bapak Drs. Sadarisman sebagai kepala sekolah yang pertama pada tahun 1992.\n\nPada tahun 1992 saat berdirinya SMA Negeri 1 Gebog yang hanya memiliki 3 kelas saja, tapi seiring dengan kesadaran masyarakat akan pentingnya pendidikan di wilayah kecamatan Gebog, SMA Negeri 1 Gebog pada tahun pelajaran 2024/2025 memiliki 36 kelas.`,
                foundingInfo: {
                    sk: '0216/O/1992',
                    date: '5 Mei 1992',
                    nss: '301031908021',
                    npsn: '20317492'
                },
                firstPrincipal: {
                    name: 'Drs. Sadarisman',
                    year: '1992',
                    status: 'Kepala Sekolah Pendiri'
                },
                timeline: [
                    { year: '1992', title: 'Pendirian Sekolah', description: 'SMAN 1 Gebog didirikan dengan SK Menteri Pendidikan dan Kebudayaan, dimulai dengan 3 kelas dan dipimpin oleh Drs. Sadarisman.' },
                    { year: '2024', title: 'Usia 32 Tahun', description: 'Pada tahun 2024, SMAN 1 Gebog telah berusia 32 tahun dengan perkembangan pesat menjadi 36 kelas, menunjukkan kepercayaan masyarakat terhadap kualitas pendidikan.' }
                ]
            };

            await connection.execute('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['visi_misi', JSON.stringify(defaultVisiMisi)]);
            await connection.execute('INSERT INTO profile_content (section_key, content) VALUES (?, ?)', ['sejarah', JSON.stringify(defaultSejarah)]);

            console.log('Default Profile content inserted successfully');
        } else {
            console.log('Profile content already exists, skipping insertion');
        }

        await connection.end();
        console.log('Done.');
    } catch (error) {
        console.error('Error in setup_profile:', error);
        process.exit(1);
    }
}

createTable();
