import { LatestState, EventItem, PumpCommandResponse } from "../types/index";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:1880";

const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error occurred";
};

/**
 * Fetch latest sensor state dari backend
 */
export const fetchLatest = async (): Promise<LatestState> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/latest`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data as LatestState;
  } catch (error) {
    console.error("fetchLatest error:", handleApiError(error));
    throw error;
  }
};

/**
 * Fetch event history dari backend
 */
export const fetchEvents = async (): Promise<EventItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data as EventItem[];
  } catch (error) {
    console.error("fetchEvents error:", handleApiError(error));
    throw error;
  }
};

/**
 * Set pump state (ON/OFF) via backend
 */
export const setPump = async (
  cmd: "ON" | "OFF"
): Promise<PumpCommandResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pump`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cmd }),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data as PumpCommandResponse;
  } catch (error) {
    console.error("setPump error:", handleApiError(error));
    throw error;
  }
};
