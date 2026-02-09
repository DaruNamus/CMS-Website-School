-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 08, 2026 at 08:34 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sma1gebog`
--

-- --------------------------------------------------------

--
-- Table structure for table `extracurriculars`
--

CREATE TABLE `extracurriculars` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('Wajib','Pilihan','Akademik','Non-Akademik') DEFAULT 'Pilihan',
  `description` text,
  `schedule` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `extracurriculars`
--

INSERT INTO `extracurriculars` (`id`, `name`, `category`, `description`, `schedule`, `image`, `created_at`) VALUES
(1, 'Pramuk', 'Akademik', '', 'Jumat, 15.00-17.00', 'http://localhost:5001/uploads/1770539074037.png', '2026-02-08 05:56:37');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `description`, `category`, `image`, `created_at`) VALUES
(1, 'Lab Komputer', '~', 'Akademik', 'http://localhost:5001/uploads/1770533493472.jpeg', '2026-02-08 06:51:33');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_photos`
--

CREATE TABLE `gallery_photos` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(255) NOT NULL,
  `category` varchar(50) DEFAULT 'Lainnya',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_photos`
--

INSERT INTO `gallery_photos` (`id`, `title`, `description`, `image_url`, `category`, `created_at`) VALUES
(1, 'Belajar', '~', 'http://localhost:5001/uploads/1770538545739.png', 'Kegiatan', '2026-02-08 08:15:45');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `date` date DEFAULT (curdate()),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `category`, `image`, `date`, `created_at`) VALUES
(1, 'Test News', 'This is a test news content.', 'Pengumuman', 'http://localhost:5001/uploads/1770538948276.jpg', '2026-02-06', '2026-02-08 01:18:06'),
(2, 'Test', 'Test', 'Pengumuman', '', '2026-02-08', '2026-02-08 01:19:46'),
(5, 'Detail Page Test', 'This content should be visible on the detail page.', 'Info', NULL, '2026-02-08', '2026-02-08 04:09:01');

-- --------------------------------------------------------

--
-- Table structure for table `ppdb_content`
--

CREATE TABLE `ppdb_content` (
  `id` int NOT NULL,
  `section_key` varchar(50) NOT NULL,
  `content` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ppdb_content`
--

INSERT INTO `ppdb_content` (`id`, `section_key`, `content`, `updated_at`) VALUES
(1, 'timeline', '[{\"date\": \"1 - 15 Juni 2026\", \"phase\": \"Pendaftaran\"}, {\"date\": \"16 - 18 Juni 2026\", \"phase\": \"Seleksi Administrasi\"}, {\"date\": \"20 Juni 2026\", \"phase\": \"Pengumuman Hasil\"}, {\"date\": \"21 - 25 Juni 2026\", \"phase\": \"Daftar Ulang\"}]', '2026-02-08 04:24:07'),
(2, 'requirements', '[\"Fotocopy Ijazah/SKHUN yang dilegalisir (2 lembar)\", \"Fotocopy Akta Kelahiran (2 lembar)\", \"Fotocopy Kartu Keluarga (2 lembar)\", \"Pas foto berwarna ukuran 3x4 (4 lembar)\", \"Fotocopy Kartu NISN\", \"Surat Keterangan Sehat dari Dokter\", \"Surat Keterangan Kelakuan Baik dari Sekolah\"]', '2026-02-08 04:24:07'),
(3, 'contact', '{\"email\": \"ppdb@sman1gebog.sch.id\", \"hours\": \"08:00 - 15:00 WIB\", \"phone\": \"(0291) 999999\"}', '2026-02-08 04:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `profile_content`
--

CREATE TABLE `profile_content` (
  `id` int NOT NULL,
  `section_key` varchar(50) NOT NULL,
  `content` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile_content`
--

INSERT INTO `profile_content` (`id`, `section_key`, `content`, `updated_at`) VALUES
(1, 'visi_misi', '{\"misi\": [\"Menimbulkan penghayatan dan pengalaman terhadap agama yang menjadi kearifan dalam berfikir dan bertingkah laku.\", \"Mendorong dan membantu setiap siswa untuk, mengenali potensi dirinya serta membekali seluruh siswa dengan berbagai lifeskill untuk menghadapi era globalisasi.\", \"Menumbuhkan semangat keunggulan secara intensif kepada seluruh peserta didik.\", \"Melaksanakan pembelajaran dan pembimbing secara aktif, kreatif, inovatif dan berkarakter.\", \"Menumbuhkan sikap disiplin dan bangga sebagai peserta didik terhadap almamater dan budaya bangsa.\", \"Mengembangkan sikap splidaritas komunikasi dan informasi untuk meningkatkan pelayanan publik.\", \"Menumbuhkan sikap cinta lingkungan dengan upaya pelestarian lingkungan, pencegahan pendernaan dan pencegahan kerusakan.\"], \"visi\": \"Terbentuknya warga sekolah yang berakhlak terpuji, berprestasi, berwawasan, berbudaya bangsa dan peduli terhadap lingkungan.\", \"motto\": \"LOKASI PINGGIRAN PRESTASI PUSAT PERHATIAN\", \"tujuan\": [{\"text\": \"Membentuk sikap dan perilaku yang mencerminkan aklhak dan budaya bangsa yang religius, santun, dan berkarakter\", \"label\": \"a\"}, {\"text\": \"Memberikan wadah bagi para siswa untuk mengembangkan minat dan bakat yang dimilikinya dengan berbagai kegiatan ekstra kurikuler (BTA, Qiroatul Qur\'an, rebana teater, film, menyablon, elektronika, bola volley, sepakbola, karate, dan lain-lain)\", \"label\": \"b\"}, {\"text\": \"Memiliki tim KIR/OSN/olahraga/kesenian yang mempu bersaing di tingkat regional maupun nasional\", \"label\": \"c\"}, {\"text\": \"Meningkatkan prestasi baik akademik dan non akademik yang membanggakan bagi warga sekolah dan masyarakat sekitar\", \"label\": \"d\"}, {\"text\": \"Meningkatkan kedisiplinan siswa dan memberikan motifasi belajar secara terus menerus agar tumbuh menjadi siswa yang cerdas, santun, dan berkepribadian\", \"label\": \"e\"}, {\"text\": \"Memiliki sistem informasi manajemen informatika yang cepat, akurat, dan berkualitas untuk mengakses berbagai informasi penting untuk meningkatkan pelayanan kepada masyarakat sekitar\", \"label\": \"f\"}, {\"text\": \"Mewujudkan perlindungan dan pengelolaan lingkungan hidup melalui pelestarian fungsi LH\", \"label\": \"g\"}, {\"text\": \"Mewujudkan perlindungan dan pengelolaan lingkungan hidup melalui pencegahan pencemaran LH\", \"label\": \"h\"}, {\"text\": \"Mewujudkan perlindungan dan pengelolaan lingkungan hidup melalui pencegahan kerusakan LH\", \"label\": \"i\"}, {\"text\": \"Menerapkan Adiwiyata di sekolah dalam kehidupan sehari-hari:\", \"label\": \"j\", \"subItems\": [\"Memiliki tim siaga lingkungan dan petugas kebersihan yang cukup\", \"Tersedianya ruang yang cukup menjamin keamanan, kenyamanan, bermain, dan berolahraga\", \"Tersedianya ruang belajar dengan ventilasi dan pencahayaan yang memadai\", \"Tersedianya UKS yang memadai\", \"Tersedianya kantin yang sehat dan representatif\", \"Tersedianya sarana air bersih bagi warga sekolah\", \"Tersedianya serapan air yang cukup\", \"Tersedianya toilet yang cukup bagi warga sekolah\", \"Tersedianya tempat sampah di setiap ruang, sarana pemilahan sampah, dan komposter\", \"Tersedianya saluran air buang yang memadai\", \"Meminimalisasi penggunaan plastik dalam kehidupan sehari-hari\", \"Penanaman tumbuhan yang memberikan suasana keindahan, kerindangan, dan menyediakan oksigen yang cukup bagi warga sekolah\", \"Memiliki green house yang berisi tanaman langka sebagai media pembelajaran\"]}], \"tagline\": \"BERAKHLAK, BERBUDAYA, BERPRESTASI\"}', '2026-02-08 04:42:43'),
(2, 'sejarah', '{\"history\": \"SMA Negeri 1 Gebog Kudus merupakan satu-satunya SMA Negeri diwilayah Gondosari Kecamatan Gebog. Pada tahun 2024 ini, usia sekolahnya sudah mencapai 32 tahun. SMA Negeri 1 Gebog berdiri di atas tanah hibah dari salah satu Direksi PT SUKUN WARTONO INDONESIA, yaitu bapak H. Tas\'an Wartono.\\n\\nKeberadaan suatu Sekolah tidak lahir begitu saja, akan tetapi sering kali karena berbagai hal yang melingkupi dan menuntut keberadaannya. Demikian juga dengan SMA Negeri 1 Gebog yang kemunculannya atau berdirinya karena ada komitmen yang besar dari para pendiri untuk mengamalkan ilmu yang telah dimiliki kepada masyarakat. Serta adanya tuntutan perkembangan masyarakat akan pentingnya ilmu pengetahuan dan perkembangan kehidupan dimasa yang akan datang. Dengan adanya sekolah menengah atas ini diharapkan dapat membekali siswa untuk mempersiapkan kehidupannya dimasa yang akan datang.\\n\\nUntuk mempersiapkan sumber daya manusia yang memiliki keunggulan dalam bidang ilmu pengetahuan dan teknologi, iman dan takwa, serta seni, SMA Negeri 1 Gebog didirikan berdasarkan surat keputusan Menteri pendidikan dan kebudayaan Republik Indonesia Nomor SK. 0216/O/1992 Tanggal 5 Mei 1992, NSS. 301031908021, NPSN. 20317492, yang lokasinya berada di Jl. PR Sukun Gondosari Gebog Kudus. Dipimpin oleh Bapak Drs. Sadarisman sebagai kepala sekolah yang pertama pada tahun 1992.\\n\\nPada tahun 1992 saat berdirinya SMA Negeri 1 Gebog yang hanya memiliki 3 kelas saja, tapi seiring dengan kesadaran masyarakat akan pentingnya pendidikan di wilayah kecamatan Gebog, SMA Negeri 1 Gebog pada tahun pelajaran 2024/2025 memiliki 36 kelas.\", \"timeline\": [{\"year\": \"1992\", \"title\": \"Pendirian Sekolah\", \"description\": \"SMAN 1 Gebog didirikan dengan SK Menteri Pendidikan dan Kebudayaan, dimulai dengan 3 kelas dan dipimpin oleh Drs. Sadarisman.\"}, {\"year\": \"2024\", \"title\": \"Usia 32 Tahun\", \"description\": \"Pada tahun 2024, SMAN 1 Gebog telah berusia 32 tahun dengan perkembangan pesat menjadi 36 kelas, menunjukkan kepercayaan masyarakat terhadap kualitas pendidikan.\"}], \"foundingInfo\": {\"sk\": \"0216/O/1992\", \"nss\": \"301031908021\", \"date\": \"5 Mei 1992\", \"npsn\": \"20317492\"}, \"firstPrincipal\": {\"name\": \"Drs. Sadarisman\", \"year\": \"1992\", \"status\": \"Kepala Sekolah Pendiri\"}}', '2026-02-08 04:42:43'),
(3, 'struktur_organisasi', '{\"imageUrl\": \"http://localhost:5001/uploads/1770539172674.png\", \"description\": \"\"}', '2026-02-08 08:26:13'),
(4, 'kepala_sekolah', '{\"bio\": \"-\", \"name\": \"Khodam\", \"photo\": \"http://localhost:5001/uploads/1770539133409.jpg\", \"periode\": \"2026\", \"sambutan\": \"-\"}', '2026-02-08 08:25:34'),
(5, 'struktur_kurikulum', '{\"image\": \"http://localhost:5000/uploads/1770531440973.jpg\", \"description\": \"SMAN 1 Gebog Kudus menyelenggarakan pendidikan menengah atas dengan kurikulum yang dirancang untuk mengembangkan potensi peserta didik secara optimal, baik dalam aspek akademik, karakter, maupun keterampilan hidup. Kurikulum yang diterapkan mengacu pada kebijakan nasional pendidikan, dengan penyesuaian terhadap kebutuhan lokal dan perkembangan zaman.\"}', '2026-02-08 06:17:21'),
(6, 'program_unggulan', '[{\"id\": 1770531670810, \"image\": \"\", \"title\": \"Tim Olimpiade\", \"description\": \"~\"}]', '2026-02-08 06:21:10'),
(7, 'osis', '{\"misi\": [], \"visi\": \"\", \"description\": \"Organisasi Siswa Intra Sekolah (OSIS) SMAN 1 Gebog Kudus merupakan wadah resmi bagi siswa untuk mengembangkan minat, bakat, kepemimpinan, serta rasa tanggung jawab sosial. OSIS berperan sebagai motor penggerak kegiatan kesiswaan, baik di bidang akademik, seni, olahraga, maupun sosial kemasyarakatan.\\nMelalui program kerja yang terstruktur, OSIS menjadi sarana pembelajaran demokrasi, kepemimpinan, dan kerja sama antar siswa. Selain itu, OSIS juga berfungsi sebagai jembatan komunikasi antara siswa dengan pihak sekolah, sehingga tercipta lingkungan belajar yang harmonis, kreatif, dan berprestasi.\", \"structureImage\": \"\"}', '2026-02-08 08:27:15');

-- --------------------------------------------------------

--
-- Table structure for table `school_staff`
--

CREATE TABLE `school_staff` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `position` enum('Guru','Staff') NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_staff`
--

INSERT INTO `school_staff` (`id`, `name`, `nip`, `position`, `subject`, `photo`, `created_at`) VALUES
(1, 'KAOSD', '2934718490', 'Guru', '', 'http://localhost:5001/uploads/1770539112549.jpeg', '2026-02-08 05:32:26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin123', 'admin', '2026-02-08 00:10:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `extracurriculars`
--
ALTER TABLE `extracurriculars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_photos`
--
ALTER TABLE `gallery_photos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ppdb_content`
--
ALTER TABLE `ppdb_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`);

--
-- Indexes for table `profile_content`
--
ALTER TABLE `profile_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`);

--
-- Indexes for table `school_staff`
--
ALTER TABLE `school_staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `extracurriculars`
--
ALTER TABLE `extracurriculars`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `gallery_photos`
--
ALTER TABLE `gallery_photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ppdb_content`
--
ALTER TABLE `ppdb_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `profile_content`
--
ALTER TABLE `profile_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `school_staff`
--
ALTER TABLE `school_staff`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
