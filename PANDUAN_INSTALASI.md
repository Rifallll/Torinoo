# Panduan Menjalankan Aplikasi Traffic (Torino)

Halo! Jika kamu mendapatkan link GitHub ini, berikut adalah cara menjalankan aplikasinya di komputer kamu sendiri (Localhost).

## Syarat Sebelum Mulai
Pastikan di komputer kamu sudah terinstall:
1.  **Node.js** (Download di [nodejs.org](https://nodejs.org/))
2.  **Python** (Download di [python.org](https://python.org/))
3.  **Git** (Opsional, untuk clone)

## Langkah 1: Download/Clone
1.  Buka terminal/CMD.
2.  Clone repository ini:
    ```bash
    git clone https://github.com/Rifallll/traffic-app.git
    cd traffic-app
    ```
    *(Atau download ZIP dari GitHub dan ekstrak).*

## Langkah 2: Install Dependency (Sekali saja)

**1. Install Library Python (Backend):**
Buka terminal di folder `traffic-app` dan jalankan:
```bash
pip install -r requirements.txt
```
*Atau jika belum ada `requirements.txt` di root, install manual:*
```bash
pip install flask flask-cors pandas numpy scikit-learn
```

**2. Install Library JavaScript (Frontend):**
Di terminal yang sama, jalankan:
```bash
npm install
```

## Langkah 3: Jalankan Aplikasi 🚀

Setiap kali mau membuka aplikasi, cukup jalankan perintah satu sakti ini:

```bash
npm run dev:all
```

Tunggu sebentar, lalu buka browser di alamat yang muncul (biasanya):
👉 **http://localhost:8080**

## Catatan Penting
- Aplikasi ini mengambil data traffic dari server lokal `192.168.1.9`.
- Jika kamu **TIDAK** berada di jaringan WiFi yang sama dengan pembuat project, fitur traffic/peta **tidak akan muncul datanya** (kosong/error).
- Kamu hanya bisa melihat tampilan website (UI Project) saja.

Selamat mencoba!
