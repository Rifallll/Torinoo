# Traffic ML Analysis - Random Forest

Proyek ini bertujuan untuk memprediksi aliran lalu lintas (traffic flow) dan menganalisis tingkat kemacetan menggunakan algoritma Machine Learning Random Forest.

## Struktur Proyek

- `run.py`: File utama untuk menjalankan aplikasi web dashboard (Flask).
- `traffic_analysis.ipynb`: Jupyter Notebook untuk analisis mendalam langkah demi langkah (data cleaning, feature engineering, model training).
- `src/`: Folder berisi kode sumber logika aplikasi:
  - `data_loader.py`: Modul pemrosesan data awal.
  - `feature_engineering.py`: Modul pembuatan fitur cerdas.
  - `model.py`: Modul implementasi model Random Forest.
- `templates/` & `static/`: Berisi file tampilan dashboard web.
- `torino.csv`: Dataset utama yang dianalisis.

## Cara Menjalankan

### 1. Web Dashboard
Untuk melihat tampilan grafik interaktif di browser:
```bash
python run.py
```
Akses di: `http://localhost:5000`

### 2. Jupyter Notebook
Untuk mempelajari kode analisis dan algoritma secara rinci:
1. Pastikan Anda sudah menginstal Jupyter Notebook atau menggunakan ekstensi Jupyter di VS Code.
2. Buka file `traffic_analysis.ipynb`.
3. Jalankan sel kode satu per satu.

## Persyaratan (Requirements)
Instal library yang dibutuhkan dengan perintah:
```bash
pip install -r requirements.txt
```
Librari utama: `flask`, `pandas`, `numpy`, `scikit-learn`, `matplotlib`, `seaborn`.
