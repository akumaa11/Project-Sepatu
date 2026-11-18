# ClickSole — Konfigurator Sepatu

Website satu halaman (HTML, CSS, dan JavaScript biasa) untuk memilih kombinasi upper dan sol sepatu.

## Cara melihat
- **Paling mudah:** buka `index.html` langsung di browser (klik dua kali).
- **Lewat server lokal** (opsional, untuk dibuka dari HP di jaringan yang sama):
  ```bash
  python3 -m http.server 8000
  ```
  lalu buka `http://localhost:8000`.

## Struktur
- `index.html` — struktur halaman
- `style.css` — tampilan (responsif untuk HP & komputer)
- `script.js` — data pilihan & logika pergantian gambar
- `1A.png` … `3C.png` — gambar sepatu (angka = sol, huruf = upper)

| Kode | Upper        | Kode | Sol         |
|------|--------------|------|-------------|
| A    | Blue Stripes | 1    | Blue Fade   |
| B    | Circles      | 2    | Sunset Fade |
| C    | Curved Lines | 3    | Green Fade  |

## Model 3D (sepatu 1A)
- `sepatu-3d.html` — penampil 3D interaktif (Three.js). Buka di browser (perlu internet untuk memuat Three.js). Seret untuk memutar, scroll/cubit untuk zoom.
- `sepatu-1A.glb` — file model 3D yang sama, bisa dibuka di Blender, Windows 3D Viewer, atau https://gltf-viewer.donmccurdy.com

## Halaman produk 1A (model 3D)
- `produk-1a.html` + `produk-1a.css` — halaman produk dengan model 3D interaktif. Bisa dibuka dengan klik dua kali (perlu internet untuk memuat Three.js).
- `sepatu-1A.glb` — model utama. `sepatu-1A-model.js` — salinan model yang sama sebagai cadangan, dipakai saat file `.glb` tidak bisa diambil (misalnya saat dibuka dengan klik dua kali).
- Mengganti dengan model dari Tripo: taruh file `.glb` di folder ini, ubah `MODEL_URL` di dalam `produk-1a.html`, lalu buka lewat server lokal:
  ```bash
  python3 -m http.server 8000
  ```
  dan buka `http://localhost:8000/produk-1a.html`. Ukuran dan posisi model disesuaikan otomatis; kalau arah hadapnya salah, ubah `MODEL_ROTATE_Y`.
