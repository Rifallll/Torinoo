# Panduan Setup - Traffic Analysis Backend

Panduan lengkap untuk menjalankan aplikasi Traffic ML Analysis (Python Flask) bersama dengan web aplikasi React Anda.

## 📋 Prasyarat

- **Python 3.8+** sudah terinstall
- **Node.js** sudah terinstall
- **npm** sudah terinstall

## 🚀 Cara Menjalankan

### Opsi 1: Jalankan Frontend Saja (Default)

Untuk development web aplikasi React saja:

```bash
npm run dev
```

Perintah ini akan menjalankan:
- React frontend di `http://localhost:8080`

### Opsi 2: Jalankan Frontend + Backend Sekaligus

Jika Anda perlu backend Traffic Analysis juga:

```bash
npm run dev:all
```

Perintah ini akan menjalankan:
- React frontend di `http://localhost:8080`
- Flask backend di `http://localhost:5000`

> [!IMPORTANT]
> Sebelum menjalankan backend untuk pertama kali, pastikan Python dependencies sudah terinstall (lihat bagian "Setup Python Dependencies" di bawah).

### Opsi 3: Jalankan Backend Saja

Jika Anda hanya ingin menjalankan backend Traffic Analysis:

```bash
npm run dev:backend
```

Atau jalankan secara langsung:
```bash
cd "algo 2/algo"
python run.py
```

## 🔧 Setup Python Dependencies

### Langkah 1: Buat Virtual Environment (Opsional tapi Direkomendasikan)

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
.\venv\Scripts\activate.bat
```

### Langkah 2: Install Dependencies

```bash
cd "algo 2/algo"
pip install -r requirements.txt
```

Dependencies yang akan diinstall:
- `flask` - Web framework
- `flask-cors` - CORS support untuk API
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `scikit-learn` - Machine learning library
- `joblib` - Model persistence

## 📡 API Endpoints

Backend menyediakan beberapa endpoint API:

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/statistics` | GET | Mendapatkan statistik data traffic |
| `/api/train` | POST | Melatih model Random Forest |
| `/api/predict` | POST | Prediksi traffic berdasarkan input |
| `/api/analysis` | GET | Analisis weekday vs weekend, congestion patterns |
| `/api/data` | GET | Mendapatkan data traffic dengan filter |
| `/api/features` | GET | Mendapatkan feature importance dari model |
| `/api/correlation` | GET | Mendapatkan correlation matrix |

## 🔍 Verifikasi Backend Berjalan

Setelah menjalankan backend, buka browser dan akses:

```
http://localhost:5000/api/statistics
```

Jika berhasil, Anda akan melihat response JSON dengan statistik data traffic.

## 📊 Data

Backend secara otomatis memuat file `torino.csv` yang berisi data traffic. File ini berisi:
- `day` - Tanggal
- `hour` - Jam (0-23)
- `weekday` - Hari dalam minggu (0=Senin, 6=Minggu)
- `detid` - ID detektor
- `flow` - Volume kendaraan
- `speed` - Kecepatan rata-rata
- `occ` - Occupancy (tingkat kepadatan)

## 🐛 Troubleshooting

### Error: "No module named 'flask'"

**Solusi:** Install Python dependencies
```bash
cd "algo 2/algo"
pip install -r requirements.txt
```

### Error: "Address already in use" (Port 5000)

**Solusi:** Port 5000 sudah digunakan aplikasi lain. Ubah port di `run.py`:
```python
app.run(debug=True, port=5001)  # Ganti ke port lain
```

### Error Sintaks di IDE (False Positive)

Jika IDE menampilkan syntax error di `app.py` tapi file sebenarnya valid:

**Solusi:**
1. Pastikan Python interpreter sudah dikonfigurasi di IDE
2. Install Python dependencies (lihat di atas)
3. Restart IDE
4. File sebenarnya valid - Python compiler tidak menemukan error

### Backend tidak memuat data

**Solusi:** Pastikan file `torino.csv` ada di folder `algo 2/algo/`

## 🔗 Integrasi dengan Frontend

Frontend sudah dikonfigurasi untuk mengakses backend melalui proxy di `vite.config.ts`. Request ke `/api/*` akan otomatis diarahkan ke `http://localhost:5000`.

Contoh penggunaan di React:
```typescript
// Fetch statistics
const response = await fetch('/api/statistics');
const data = await response.json();

// Get analysis data
const analysis = await fetch('/api/analysis');
const analysisData = await analysis.json();
```

## 📝 Catatan

- Backend menggunakan **Random Forest** untuk prediksi traffic
- Model dilatih menggunakan data historis dari `torino.csv`
- API mendukung CORS untuk development
- Data secara otomatis di-preprocess dan feature engineering dilakukan saat startup

## ✅ Checklist Setup

- [ ] Python 3.8+ terinstall
- [ ] Virtual environment dibuat (opsional)
- [ ] Dependencies Python terinstall (`pip install -r requirements.txt`)
- [ ] File `torino.csv` ada di `algo 2/algo/`
- [ ] Backend berjalan di `http://localhost:5000`
- [ ] Frontend berjalan di `http://localhost:5173`
- [ ] API endpoint `/api/statistics` bisa diakses

---

**Selamat! 🎉** Aplikasi Traffic Analysis Anda sekarang sudah berjalan!
