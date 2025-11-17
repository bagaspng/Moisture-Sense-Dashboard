/**
 * Type definitions untuk Smart Farming Dashboard
 */

export interface LatestState {
  suhu: number;
  kelembapan: number;
  soil: number;
  rain_raw?: number;
  rain_status: string;
  pompa: "ON" | "OFF";
  updated_at: number | null;
}

export interface EventItem {
  ts: string;
  type: "Pump ON" | "Pump OFF" | "Rain" | "Warning";
  level: "info" | "warn" | "error";
  message: string;
}

export interface PumpCommandResponse {
  status: "ok" | "error";
  pump_state?: "ON" | "OFF";
  error?: string;
}
