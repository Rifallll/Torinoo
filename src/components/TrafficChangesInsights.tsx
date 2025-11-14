"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, CalendarDays, AlertTriangle, Lightbulb, TrendingUp, Clock, Users } from 'lucide-react';

// Interface untuk data perubahan lalu lintas yang diekstrak dari HTML
export interface TrafficChange { // Export interface
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  latitude: number;
  longitude: number;
  startDate?: string; // Misalnya, 'Da lunedì 10 novembre'
  endDate?: string;   // Misalnya, 'Fino a venerdì 8 desember'
  type?: 'closure' | 'roadwork' | 'reduction' | 'pedestrianization'; // Tipe perubahan
  responsibleEntity?: string; // Misalnya, 'Comune di Torino', 'SMAT', 'IRETI'
}

// Data dummy yang diekstrak secara manual dari HTML yang Anda berikan
export const mockTrafficChanges: TrafficChange[] = [ // Export the data
  {
    id: '668853',
    title: 'CHIUSURA IN CORSO MORTARA',
    description: 'Da lunedì 10 novembre, per lavori del comune di Torino, è prevista la chiusura dell\'utimo tratto di corso Mortara in direzione piazza Baldissera con obbligo di svolta a destra su corso Principe Oddone.',
    latitude: 45.0918,
    longitude: 7.66297,
    startDate: '2025-11-10', // Asumsi tahun 2025 dari konteks
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '667941',
    title: '14/11 CHIUSURA IN SOTTOPASSO MORTARA',
    description: 'Venerdì 14 novembre dalle 9:30 alle 16:30, per lavori del Comune di Torino, è prevista la chiusura del sottopasso Mortara in direzione via Orvieto.',
    latitude: 45.0918,
    longitude: 7.66297,
    startDate: '2025-11-14',
    endDate: '2025-11-14',
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '668781',
    title: 'LAVORI IN PIAZZA SOFIA',
    description: 'Fino a venerdì 14 november, per lavori SMAT, sono previste riduzioni di carreggiata in piazza Sofia all\'intersezione con strada Settimo.',
    latitude: 45.0951,
    longitude: 7.71709,
    endDate: '2025-11-14',
    type: 'reduction',
    responsibleEntity: 'SMAT',
  },
  {
    id: '668498',
    title: 'LAVORI SU CONTROVIALI DI CORSO TASSONI',
    description: 'Da lunedì 17 november a mercoledì 17 dicembre, per lavori del comune di Torino, sono previsti lavori con chiusure di carreggiata sui controviali est e ovest di corso Tassoni tra piazza Bernini e corso Regina Margherita.',
    latitude: 45.0814,
    longitude: 7.65617,
    startDate: '2025-11-17',
    endDate: '2025-12-17',
    type: 'roadwork',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '668465',
    title: 'LAVORI AL PARCO DEL VALENTINO',
    description: 'Per lavori all\'interno del parco del Valentino sono previste chiusure viabili. Baca tutto...',
    fullDescription: 'Per lavori all\'interno del parco del Valentino sono previste chiusure viabili. Da lunedì 10 november 2025 a domenica 1 marzo 2026 adalah penutupan diviale Turr antara viale Boiardo dan via Millio. Hingga Minggu 1 Maret 2026 adalah penutupan di: - viale Stefano Turr antara viale Boiardo dan viale Marinai d\'Italia - viale Boiardo antara via Turr dan viale Marinai d\'Italia - viale Marinai d\'Italia antara viale Boiardo dan viale Turr - viale Millio antara viale Turr dan pintu masuk ke Borgo Medievale',
    latitude: 45.0501,
    longitude: 7.68233,
    startDate: '2025-11-10',
    endDate: '2026-03-01',
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '667923',
    title: 'PEDONALIZZAZIONE VIA ROMA',
    description: 'Per lavori propedeutici alla pedonalizzazione di via Roma sono previste chiusure nel cento città. Baca tutto...',
    fullDescription: 'Per lavori propedeutici alla pedonalizzazione di via Roma sono previste chiusure nel cento città. Hingga Rabu 31 Desember adalah penutupan di: - piazza CLN antara via Giolitti dan via Rossi - piazza CLN antara via Rossi dan via Amendola - piazza CLN antara via Alfieri dan via Frola - via Frola antara via XX Settembre dan via piazza CLN. Hingga Sabtu 31 Januari 2026 juga adalah penutupan via Roma antara via Cavour dan via Buozzi.',
    latitude: 45.066,
    longitude: 7.68131,
    startDate: '2025-09-22', // Asumsi dari deskripsi di HTML asli
    endDate: '2026-01-31',
    type: 'pedestrianization',
    responsibleEntity: 'Comune di Torino',
  },
];

interface TrafficChangesInsightsProps {
  id?: string;
}

const TrafficChangesInsights: React.FC<TrafficChangesInsightsProps> = ({ id }) => {
  // Hitung statistik dasar dari data dummy
  const totalChanges = mockTrafficChanges.length;
  const ongoingChanges = mockTrafficChanges.filter(change => {
    const now = new Date();
    const start = change.startDate ? new Date(change.startDate) : null;
    const end = change.endDate ? new Date(change.endDate) : null;
    return (!start || now >= start) && (!end || now <= end);
  }).length;

  const responsibleEntities = [...new Set(mockTrafficChanges.map(c => c.responsibleEntity))];

  return (
    <div id={id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Ringkasan Perubahan Lalu Lintas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Total Perubahan Terdaftar:</strong> {totalChanges}</p>
          <p><strong>Perubahan Sedang Berlangsung:</strong> {ongoingChanges}</p>
          <p><strong>Entitas Bertanggung Jawab:</strong> {responsibleEntities.join(', ')}</p>
          <p className="text-sm text-gray-500 mt-2">
            *Data ini disimulasikan dari contoh HTML yang diberikan.
          </p>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" /> Analisis Spasial & Hotspot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Dengan data lokasi (latitude, longitude), kita dapat:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>**Mengidentifikasi Hotspot:** Area mana yang paling sering mengalami perubahan lalu lintas (penutupan, pekerjaan jalan)?</li>
            <li>**Visualisasi Peta:** Tampilkan semua perubahan di peta untuk melihat distribusi geografisnya.</li>
            <li>**Analisis Klaster:** Kelompokkan perubahan yang berdekatan secara geografis.</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Ini membantu perencanaan kota dan pengalihan rute.
          </p>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <CalendarDays className="h-5 w-5 mr-2 text-purple-600" /> Pola Temporal & Durasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Dengan data tanggal mulai dan berakhir, kita dapat:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>**Tren Musiman:** Apakah ada bulan atau musim tertentu dengan lebih banyak pekerjaan jalan?</li>
            <li>**Durasi Rata-rata:** Berapa lama rata-rata penutupan atau pekerjaan jalan berlangsung berdasarkan jenisnya?</li>
            <li>**Pola Harian/Mingguan:** Apakah ada pola perubahan lalu lintas yang terjadi pada hari/jam tertentu?</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Ini penting untuk penjadwalan dan komunikasi publik.
          </p>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" /> Ide Prediksi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Untuk tugas data science Anda, data ini bisa digunakan untuk:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>**Prediksi Durasi Perubahan:** Berdasarkan jenis pekerjaan, lokasi, dan entitas yang bertanggung jawab, prediksi berapa lama perubahan akan berlangsung.</li>
            <li>**Prediksi Dampak Lalu Lintas:** Gabungkan data ini dengan data kecepatan/aliran lalu lintas historis Anda (dari CSV) untuk memprediksi dampak kemacetan.</li>
            <li>**Prediksi Kebutuhan Sumber Daya:** Prediksi kapan dan di mana sumber daya (misalnya, tim perbaikan, pengalihan) akan paling dibutuhkan.</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Ini akan memberikan wawasan proaktif untuk manajemen lalu lintas.
          </p>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" /> Analisis Data Kecepatan (CSV Anda)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Mengenai data kecepatan Anda dari Januari hingga Maret, Anda bisa melakukan:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>**Tren Kecepatan Harian/Mingguan/Bulanan:** Bagaimana kecepatan rata-rata berubah dari waktu ke waktu?</li>
            <li>**Pola Puncak/Lembah:** Identifikasi jam-jam sibuk (kecepatan rendah) dan jam-jam lengang (kecepatan tinggi).</li>
            <li>**Perbandingan Lokasi:** Bandingkan kecepatan di berbagai detektor/lokasi.</li>
            <li>**Prediksi Kecepatan Masa Depan:** Gunakan model deret waktu (misalnya, ARIMA, Prophet) untuk memprediksi kecepatan di masa depan berdasarkan pola historis.</li>
            <li>**Deteksi Anomali:** Identifikasi penurunan kecepatan yang tidak biasa yang mungkin menunjukkan insiden atau kemacetan.</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Ini akan membantu Anda memahami dinamika lalu lintas dan membuat prediksi yang akurat.
          </p>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <Users className="h-5 w-5 mr-2 text-orange-600" /> Kolaborasi Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Menggabungkan data perubahan lalu lintas (dari halaman web) dengan data kecepatan Anda (dari CSV) akan sangat kuat:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>**Analisis Kausal:** Apakah penutupan jalan di suatu area menyebabkan penurunan kecepatan di area tersebut atau rute alternatif?</li>
            <li>**Model Prediksi yang Lebih Baik:** Gunakan informasi tentang perubahan jalan sebagai fitur dalam model prediksi kecepatan Anda untuk meningkatkan akurasi.</li>
            <li>**Rekomendasi Rute Dinamis:** Berikan rekomendasi rute real-time kepada pengemudi yang mempertimbangkan baik kondisi lalu lintas saat ini maupun perubahan jalan yang direncanakan.</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Ini adalah inti dari sistem informasi mobilitas cerdas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficChangesInsights;