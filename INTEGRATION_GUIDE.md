# Smart Farming Dashboard - Backend Integration Guide

## 📋 Overview

Dashboard ini sekarang terintegrasi penuh dengan backend Node-RED. Sistem melakukan polling otomatis setiap 5 detik untuk mengambil data sensor dan event history dari API backend.

## 📁 File Structure

```
src/
├── types/
│   └── index.ts           # TypeScript type definitions
├── lib/
│   └── api.ts            # API client functions
├── App.tsx               # Main dashboard component
└── vite-env.d.ts         # Vite environment type definitions
```

## 🔧 TypeScript Types

### `LatestState`
```typescript
interface LatestState {
  suhu: number;              // Temperature in °C
  kelembapan: number;        // Humidity in %
  soil: number;              // Soil moisture ADC (0-1023)
  rain_raw?: number;         // Raw rain sensor value
  rain_status: string;       // "🌧 Hujan" or "☀ Cerah"
  pompa: "ON" | "OFF";       // Pump status
  updated_at: number | null; // Timestamp in milliseconds
}
```

### `EventItem`
```typescript
interface EventItem {
  ts: string;                              // ISO timestamp
  type: "Pump ON" | "Pump OFF" | "Rain" | "Warning";
  level: "info" | "warn" | "error";
  message: string;                         // Event description
}
```

### `PumpCommandResponse`
```typescript
interface PumpCommandResponse {
  status: "ok" | "error";
  pump_state?: "ON" | "OFF";
  error?: string;
}
```

## 🌐 API Functions

Semua fungsi API tersedia di `src/lib/api.ts`:

### 1. `fetchLatest()` - GET `/api/latest`
Mengambil status sensor terbaru.

```typescript
const state = await fetchLatest();
console.log(state.soil, state.suhu, state.pompa);
```

### 2. `fetchEvents()` - GET `/api/events`
Mengambil event history (max 50 events terbaru).

```typescript
const events = await fetchEvents();
events.forEach(e => console.log(e.ts, e.type, e.message));
```

### 3. `setPump(cmd)` - POST `/api/pump`
Mengubah status pompa (ON/OFF).

```typescript
const response = await setPump("ON");
if (response.status === "ok") {
  console.log("Pump set to:", response.pump_state);
}
```

## ⚙️ Configuration

### Environment Variables

Buat file `.env.local` di root project:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:1880
```

Default fallback: `http://localhost:1880`

## 🔄 Polling Mechanism

Dashboard menggunakan `useEffect` hook untuk polling otomatis:

- **Interval**: 5 detik
- **Data yang di-fetch**: Latest state + Event history
- **Error handling**: Jika API tidak tersedia, koneksi status akan ditampilkan sebagai "Disconnected"
- **UI Feedback**: 
  - ✅ Loading state pada pump button
  - 🔴 Connection indicator di navbar
  - ⚠️ Error alerts
  - 📊 Real-time sensor updates

## 📊 Dashboard Features

### 1. **Real-time Sensor Display**
- **Soil Moisture**: ADC value (0-1023) dengan normalisasi ke percentage (0-100%)
- **Temperature**: Dalam °C
- **Humidity**: Dalam %
- **Rain Status**: 🌧 Hujan / ☀ Cerah

### 2. **Pump Control**
- Toggle ON/OFF button (disabled saat Auto Mode)
- Loading spinner saat mengirim command
- Disabled state ketika API disconnected

### 3. **Auto Mode**
- Switch untuk enable/disable automatic irrigation
- Manual controls disabled saat Auto Mode aktif

### 4. **Warnings & Alerts**
- **Dry Warning**: Muncul ketika soil moisture < 300 ADC
- **Rain Warning**: Muncul ketika cuaca "Hujan"
- **Connection Alert**: Jika backend tidak tersedia

### 5. **Event History**
- Menampilkan 50 event terbaru dari backend
- Formatkan timestamp dengan `toLocaleTimeString()`
- Event types: Pump ON/OFF, Rain, Warning

### 6. **Status Badges**
- Pump Status (ON/OFF)
- Weather Status (Hujan/Cerah)
- Mode Status (Auto/Manual)

## 🚀 Usage

### Startup
1. Pastikan backend Node-RED sudah running di `http://localhost:1880`
2. Start frontend: `npm run dev`
3. Dashboard akan otomatis polling setiap 5 detik

### Testing API Connection
Buka browser console dan test:

```javascript
// Import dari module
import { fetchLatest, fetchEvents, setPump } from './lib/api.ts';

// Test fetch latest
fetchLatest().then(console.log);

// Test fetch events
fetchEvents().then(console.log);

// Test set pump
setPump("ON").then(console.log);
```

## 🔌 Backend API Expectations

Backend harus provide 3 endpoints:

### GET `/api/latest`
Response:
```json
{
  "suhu": 24,
  "kelembapan": 68,
  "soil": 580,
  "rain_status": "☀ Cerah",
  "pompa": "ON",
  "updated_at": 1700000000000
}
```

### GET `/api/events`
Response:
```json
[
  {
    "ts": "2024-11-17T14:32:15.000Z",
    "type": "Pump ON",
    "level": "info",
    "message": "Pump ON via API"
  }
]
```

### POST `/api/pump`
Request Body:
```json
{
  "cmd": "ON"
}
```

Response:
```json
{
  "status": "ok",
  "pump_state": "ON"
}
```

## 🐛 Troubleshooting

### Connection Timeout
- Pastikan Node-RED backend running
- Check CORS headers di backend
- Verify URL di `.env.local`

### Sensor Values Not Updating
- Check browser console untuk error messages
- Verify backend sedang menerima data dari ESP2
- Check flow context di Node-RED

### Pump Command Not Working
- Verify MQTT connection di Node-RED
- Check ESP2 subscribed ke topic `smartfarm/pompa`
- Check auto mode is disabled

## 📝 Notes

- Soil moisture value (0-1023 ADC) dinormalisasi ke percentage untuk display
- Event timestamps otomatis diformat dengan locale time
- Pump button disabled saat Auto Mode atau API disconnected
- Dry warning threshold: soil < 300 ADC
- Max event history: 50 items dari backend

## 🔮 Future Improvements

- [ ] Data persistence / local storage untuk offline mode
- [ ] Chart history dengan data dari backend
- [ ] User authentication
- [ ] Settings/threshold configuration
- [ ] Mobile app version
- [ ] Real-time WebSocket connection (alternative to polling)
