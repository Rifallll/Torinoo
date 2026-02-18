# Panduan Deployment (Monolith)

Aplikasi ini dikonfigurasi untuk deployment monolith dimana backend Flask menyajikan frontend React.

## Struktur Folder

- `algo 2/algo/src/app.py`: Server utama Flask.
- `algo 2/algo/static/dist`: Hasil build React (Frontend) yang akan disajikan oleh Flask.

## Cara Build & Deploy

### 1. Build Frontend (Jika ada perubahan UI)

Jalankan perintah ini di root folder project:

```bash
npm run build
```

Ini akan menghasilkan file statis di `algo 2/algo/static/dist`.
**PENTING**: Folder ini HARUS dicommit ke git agar deployment di server produksi bisa langsung jalan tanpa build ulang.

### 2. Jalankan Server (Backend + Frontend)

Masuk ke folder backend dan jalankan `run.py`:

```bash
cd "algo 2/algo"
python run.py
```

Atau dari root folder:

```bash
npm run dev:backend
```

### 3. Akses Aplikasi

Buka browser dan akses `http://localhost:5000`.

## Catatan Deployment (Render/Railway/VPS)

Pastikan server menjalankan perintah start python: `python "algo 2/algo/run.py"`.
Dan pastikan `requirements.txt` terpenuhi.
