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
