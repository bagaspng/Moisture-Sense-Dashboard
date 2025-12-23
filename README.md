# 🌱 Moisture Sense Dashboard

Selamat datang di Moisture Sense Dashboard! 🎉  
Ini adalah tampilan web sederhana untuk memantau data kelembaban (moisture) secara realtime dari sensor (ESP). README ini dibuat ringkas, mudah dipahami, dan interaktif—dilengkapi emoji agar lebih enak dibaca. 😉

---

## 🔎 Ringkasan singkat
- Tujuan: Menampilkan data kelembaban secara realtime dalam tampilan yang mudah dibaca.
- Sumber data: Sensor ESP → (via MQTT) → Node-RED (terpisah) → Dashboard (mengambil data lewat HTTP / SSE / WebSocket).
- Catatan penting: Dashboard ini hanya *client* (frontend). Backend Node-RED dan broker MQTT berjalan terpisah.

---

## 🧭 Cara kerja (secara sederhana)
1. Sensor (ESP) mengirim data kelembaban ke MQTT broker. 📡  
2. Node-RED subscribe topik MQTT tersebut, memproses data, dan menyediakan API atau stream untuk dashboard. 🔁  
3. Dashboard mengambil data dari Node-RED melalui HTTP atau koneksi realtime (SSE/WebSocket) dan menampilkan hasilnya. 💻➡️📊

Flow singkat:
ESP (MQTT) → MQTT Broker → Node-RED → Dashboard (HTTP / SSE / WS)

---

## ✨ Fitur utama yang ditampilkan
- 📈 Tampilan nilai moisture realtime per sensor  
- 🕒 Timestamp terakhir diterima  
- 📉 Grafik/riwayat data (jika tersedia dari Node-RED)  
- 🔴🟢 Indikator status koneksi (online / offline)  
- ⚙️ Dukungan beberapa sensor (jika dikonfigurasi)

---

## 🚀 Mulai cepat (quick start)
Catatan: langkah berikut generik karena frontend bisa berbasis React/Vue/Svelte atau HTML biasa.

1. Salin repo ini ke komputer Anda:
   - git clone https://github.com/bagaspng/Moisture-Sense-Dashboard.git

2. Pasang dependensi (jika ada):
   - npm install  atau  yarn

3. Set konfigurasi koneksi ke Node-RED (lihat bagian Konfigurasi).  

4. Jalankan mode development:
   - npm run dev  atau  npm start

5. Buka browser ke alamat yang muncul (biasanya http://localhost:3000). 🌐

Jika dashboard sudah di-build untuk production:
- npm run build → hasilnya bisa di-deploy ke server statis (NGINX, Vercel, Netlify, dsb).

---

## ⚙️ Konfigurasi sederhana
Buat file konfigurasi environment (contoh `.env` atau serupa) dengan variabel berikut:

- API_BASE_URL — alamat Node-RED (contoh: http://192.168.1.100:1880)  
- REALTIME_METHOD — salah satu dari: `polling`, `sse`, `websocket`  
- POLL_INTERVAL — interval polling (ms), mis. `5000`

Contoh `.env`:
```
API_BASE_URL=http://node-red.local:1880
REALTIME_METHOD=sse
POLL_INTERVAL=5000
```

(Tips: jika menggunakan browser dan ada masalah CORS, atur Node-RED agar mengizinkan akses dari asal dashboard.)

---

## 🔌 Contoh kontrak data yang diharapkan dari Node-RED
Agar dashboard bekerja lancar, Node-RED biasanya menyediakan endpoint sederhana. Contoh yang disarankan:

- GET /api/moisture/latest?sensorId=esp32-1  
  Response (JSON):
  {
    "sensorId": "esp32-1",
    "moisture": 45,
    "timestamp": "2025-12-23T08:30:00Z"
  }

- GET /api/moisture/history?sensorId=esp32-1&limit=50  
  Response: array data (untuk grafik)

- (Opsional) SSE: GET /api/moisture/stream  
  - Mendorong event tiap kali data baru datang

Contoh payload MQTT dari ESP (agar Node-RED mudah memproses):
{
  "sensorId": "esp32-1",
  "moisture": 45,
  "battery": 3.7,
  "timestamp": "2025-12-23T08:30:00Z"
}

---

## 🛠️ Troubleshooting (masalah umum)
- Tidak ada data di dashboard?
  - Pastikan Node-RED menerima pesan dari MQTT (cek debug Node-RED). 🔍  
  - Cek endpoint API dengan curl atau browser. ✅

- Muncul error CORS di console browser?
  - Tambahkan header CORS di Node-RED atau gunakan proxy saat development. ✋

- Data lambat / terputus?
  - Periksa koneksi MQTT broker dan kualitas sinyal ESP. 📶

---

## 📚 Tips singkat agar lancar
- Pakai SSE untuk push satu-arah yang simpel (server → client).  
- Gunakan WebSocket jika butuh komunikasi dua arah.  
- Jika hanya sesekali update, polling setiap beberapa detik sudah cukup dan mudah.

---

## 🤝 Kontribusi & Bantuan
Mau menambahkan fitur, perbaikan UI, atau contoh integrasi Node-RED? Silakan:
1. Buka issue dengan menjelaskan ide/bug. 📝  
2. Fork repo, buat perubahan, lalu kirim pull request. 🔁

Butuh bantuan membuat contoh Node-RED flow atau contoh kode frontend (SSE / polling)? Saya bisa bantu buatkan! 🙋‍♂️

---

## 📄 Lisensi
Gunakan lisensi yang Anda pilih (mis. MIT). Jika belum ditentukan, tambahkan file LICENSE sesuai kebutuhan.

---

Terima kasih sudah menggunakan Moisture Sense Dashboard! 🌿  
Mau saya tambahkan salah satu contoh berikut sekarang?
- 🧩 Contoh `.env.example`
- 🔌 Contoh client SSE (potongan kode)
- 🧭 Contoh Node-RED flow sederhana untuk import

Ketik pilihan Anda (mis. "SSE client" atau "Node-RED flow") dan saya akan buatkan. 🚀
