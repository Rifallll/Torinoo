# Quick Reference - Perintah NPM

## 🎯 Perintah Utama

### Frontend Saja (Default)
```bash
npm run dev
```
✅ Hanya menjalankan React frontend di `http://localhost:8080`

---

### Frontend + Backend Bersamaan
```bash
npm run dev:all
```
✅ Menjalankan React frontend di `http://localhost:8080`  
✅ Menjalankan Flask backend di `http://localhost:5000`

---

### Backend Saja
```bash
npm run dev:backend
```
✅ Hanya menjalankan Flask backend di `http://localhost:5000`

Atau langsung:
```bash
cd "algo 2/algo"
python run.py
```

---

## 📊 Tentang Backend Traffic Analysis

**Lokasi:** `C:\Users\ASUS\dyad-apps\torino\algo 2\algo`

**Data:** `torino.csv` (2,080,768 records)

**API Endpoints:**
- `/api/statistics` - Statistik data
- `/api/analysis` - Analisis weekday vs weekend
- `/api/train` - Melatih model
- `/api/predict` - Prediksi traffic

**Kapan perlu dijalankan:**
- Saat ingin menggunakan fitur Traffic Analysis di web
- Saat ingin mengakses data traffic melalui API
- Untuk development fitur yang menggunakan backend

**Kapan TIDAK perlu:**
- Development UI/frontend biasa
- Testing komponen React
- Styling dan layout work

---

## 🔧 Build Commands

```bash
# Build production
npm run build

# Build development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## ✅ Kesimpulan

**Sekarang:**
- `npm run dev` → **Hanya frontend** (lebih cepat, fokus ke web development)
- `npm run dev:all` → **Frontend + Backend** (saat perlu Traffic Analysis)
- Backend bisa dijalankan terpisah kapan saja diperlukan
