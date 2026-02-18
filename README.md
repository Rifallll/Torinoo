# 🚗 Torino Traffic Analysis Dashboard

**Torino** adalah sistem analisis dan prediksi lalu lintas cerdas yang dirancang untuk memantau, menganalisis, dan memprediksi kondisi lalu lintas kota secara real-time. Aplikasi ini menggabungkan dashboard interaktif dengan kekuatan Machine Learning.

![Torino Dashboard](https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop)

## ✨ Fitur Utama

- **🗺️ Peta Interaktif**: Visualisasi lalu lintas real-time menggunakan Leaflet dengan filter kondisi jalan dan tipe kendaraan.
- **📊 Dashboard Analitik**: Statistik mendalam mengenai arus lalu lintas, kecepatan rata-rata, dan tingkat kemacetan.
- **🤖 Prediksi AI**: Menggunakan algoritma **Random Forest** untuk memprediksi arus lalu lintas berdasarkan waktu dan hari.
- **⚠️ Wawasan Kejadian**: Informasi terkini mengenai perbaikan jalan, kecelakaan, dan penutupan jalan.
- **🚀 Deployment Monolith**: Terintegrasi penuh antara Frontend (React) dan Backend (Flask) untuk kemudahan deployment.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **UI Library**: [Shadcn/UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend & AI

- **Server**: [Python Flask](https://flask.palletsprojects.com/)
- **Data Processing**: [Pandas](https://pandas.pydata.org/) & [NumPy](https://numpy.org/)
- **Machine Learning**: [Scikit-learn](https://scikit-learn.org/) (Random Forest Regressor)

---

## 🚀 Panduan Instalasi

Pastikan Anda memiliki **Node.js** dan **Python 3.8+** terinstal di komputer Anda.

### 1. Clone Repository

```bash
git clone https://github.com/Rifallll/traffic-app.git
cd traffic-app
```

### 2. Setup Backend (Python)

Sebaiknya gunakan virtual environment.

```bash
# Masuk ke direktori backend
cd "algo 2/algo"

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Frontend (React)

Buka terminal baru di root folder project.

```bash
npm install
```

---

## 🏃‍♂️ Cara Menjalankan Aplikasi

### Mode Development (Frontend & Backend Terpisah)

Gunakan mode ini jika Anda ingin mengedit kode Frontend dan melihat perubahan secara langsung (HMR).

1. **Jalankan Backend**:

    ```bash
    npm run dev:backend
    # atau manual: cd "algo 2/algo" && python run.py
    ```

2. **Jalankan Frontend**:

    ```bash
    npm run dev:frontend
    ```

3. Buka `http://localhost:8080`.

### Mode Production / Deployment (Monolith)

Gunakan mode ini untuk menjalankan aplikasi seperti di server produksi (satu port untuk semua).

1. **Build Frontend**:

    ```bash
    npm run build
    ```

    *Hasil build akan masuk ke folder backend (`algo 2/algo/static/dist`).*

2. **Jalankan Server**:

    ```bash
    cd "algo 2/algo"
    python run.py
    ```

3. **Akses Aplikasi**:
    Buka `http://localhost:5000`. Aplikasi React dan API Backend berjalan di port yang sama.

---

## 📂 Struktur Project

```
traffic-app/
├── src/                  # Source code Frontend (React)
│   ├── components/       # Komponen UI (Map, Charts, dll)
│   ├── pages/            # Halaman aplikasi
│   └── ...
├── algo 2/algo/          # Source code Backend (Flask)
│   ├── src/              # Logika Backend & ML
│   │   ├── app.py        # Entry point server Flask
│   │   └── model.py      # Model AI (Random Forest)
│   └── static/dist/      # File Frontend hasil build (Production)
├── package.json          # Script & Dependencies Node.js
└── requirements.txt      # Dependencies Python
```

## 🤝 Kontribusi

Pull Request dipersilakan. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

---

Built with ❤️ by [Rifallll](https://github.com/Rifallll)
