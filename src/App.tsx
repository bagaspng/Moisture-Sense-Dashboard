import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Badge } from "./components/ui/badge";
import { Alert, AlertDescription } from "./components/ui/alert";
import { EventHistoryItem } from "./components/EventHistoryItem";
import {
  Droplets,
  Thermometer,
  Wind,
  Power,
  CloudRain,
  AlertTriangle,
  Clock,
  Zap,
  Loader,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { fetchLatest, fetchEvents, setPump } from "./lib/api";
import { LatestState, EventItem } from "./types/index";

// Mock data for trend chart
const moistureTrendData = [
  { time: "00:00", moisture: 45 },
  { time: "02:00", moisture: 43 },
  { time: "04:00", moisture: 40 },
  { time: "06:00", moisture: 38 },
  { time: "08:00", moisture: 35 },
  { time: "10:00", moisture: 58 },
  { time: "12:00", moisture: 55 },
  { time: "14:00", moisture: 52 },
  { time: "16:00", moisture: 48 },
  { time: "18:00", moisture: 46 },
  { time: "20:00", moisture: 62 },
  { time: "22:00", moisture: 60 },
  { time: "24:00", moisture: 58 },
];

/**
 * Helper function to format backend event type to EventHistoryItem type
 */
const formatEventType = (backendType: string): "pump_on" | "pump_off" | "warning" | "rain" | "auto" => {
  const typeMap: Record<string, "pump_on" | "pump_off" | "warning" | "rain" | "auto"> = {
    "Pump ON": "pump_on",
    "Pump OFF": "pump_off",
    Warning: "warning",
    Rain: "rain",
  };
  return typeMap[backendType] || "auto";
};

export default function App() {
  // State dari backend
  const [latestState, setLatestState] = useState<LatestState>({
    suhu: 0,
    kelembapan: 0,
    soil: 0,
    rain_status: "-",
    pompa: "OFF",
    updated_at: null,
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [pumpLoading, setPumpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showDryWarning, setShowDryWarning] = useState(false);
  const [showRainWarning, setShowRainWarning] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data dari backend
  const fetchData = async () => {
    try {
      const [latestData, eventsData] = await Promise.all([
        fetchLatest(),
        fetchEvents(),
      ]);
      setLatestState(latestData);
      setEvents(eventsData);
      setError(null);
      setIsConnected(true);

      // Trigger warnings based on data
      if (latestData.soil < 300) {
        setShowDryWarning(true);
      } else {
        setShowDryWarning(false);
      }

      if (latestData.rain_status === "🌧 Hujan") {
        setShowRainWarning(true);
      } else {
        setShowRainWarning(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to connect to backend API");
      setIsConnected(false);
    }
  };

  // Setup polling setiap 5 detik
  useEffect(() => {
    // Fetch pertama kali
    fetchData();

    // Setup interval polling
    pollIntervalRef.current = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Handle pump toggle
  const handlePumpToggle = async () => {
    if (autoMode) return;

    const newCmd = latestState.pompa === "ON" ? "OFF" : "ON";
    setPumpLoading(true);

    try {
      await setPump(newCmd as "ON" | "OFF");
      setLatestState((prev) => ({
        ...prev,
        pompa: newCmd as "ON" | "OFF",
      }));
      setError(null);
    } catch (err) {
      console.error("Error setting pump:", err);
      setError("Failed to change pump state");
    } finally {
      setPumpLoading(false);
    }
  };

  // Derived values
  // Normalize soil ADC (0-1023) to percentage (0-100)
  const currentMoisture = Math.round((latestState.soil / 1023) * 100);
  const currentTemp = latestState.suhu;
  const currentHumidity = latestState.kelembapan;
  const rainDetected = latestState.rain_status === "🌧 Hujan";
  const pumpStatus = latestState.pompa === "ON";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500">
                <Droplets className="text-white" size={20} />
              </div>
              <span className="text-xl text-gray-900">MoisSense</span>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-300 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setError(null)}
            >
              ×
            </Button>
          </Alert>
        )}

        {/* Warning Banners */}
        {showDryWarning && (
          <Alert className="mb-6 border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <span className="text-yellow-900">Soil moisture critically low</span> (ADC:{" "}
              {latestState.soil}) - Consider activating the irrigation pump
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowDryWarning(false)}
            >
              ×
            </Button>
          </Alert>
        )}

        {showRainWarning && (
          <Alert className="mb-6 border-blue-300 bg-blue-50">
            <CloudRain className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <span className="text-blue-900">Rain detected</span> - Automatic
              irrigation system locked
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowRainWarning(false)}
            >
              ×
            </Button>
          </Alert>
        )}

        {/* TOP SECTION - System Controls (Hero Section) */}
        <Card className="mb-8 border-gray-200 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Current Status */}
              <div className="space-y-6">
                {/* Large Moisture Display */}
                <div className="flex items-end gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100">
                    <Droplets className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Soil Moisture</div>
                    <div className="text-5xl text-blue-600">
                      {currentMoisture}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ADC: {latestState.soil}
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className={`px-4 py-2 ${
                      pumpStatus
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    } border`}
                  >
                    <Power size={16} className="mr-2" />
                    Pump {pumpStatus ? "ON" : "OFF"}
                  </Badge>
                  <Badge
                    className={`px-4 py-2 ${
                      rainDetected
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    } border`}
                  >
                    <CloudRain size={16} className="mr-2" />
                    {rainDetected ? "🌧 Hujan" : "☀ Cerah"}
                  </Badge>
                  <Badge
                    className={`px-4 py-2 ${
                      autoMode
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-purple-100 text-purple-800 border-purple-200"
                    } border`}
                  >
                    <Zap size={16} className="mr-2" />
                    {autoMode ? "Auto Mode" : "Manual Mode"}
                  </Badge>
                </div>

                {/* Temperature & Humidity Pills */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
                      <Thermometer className="text-red-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-red-600">Temperature</div>
                      <div className="text-xl text-red-900">
                        {currentTemp}°C
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                      <Wind className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-green-600">Humidity</div>
                      <div className="text-xl text-green-900">
                        {currentHumidity}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Controls */}
              <div className="space-y-4">
                {/* Auto Mode Toggle */}
                <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-blue-900">Auto Mode</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Automatically activate pump based on soil moisture
                      </div>
                    </div>
                    <Switch
                      checked={autoMode}
                      onCheckedChange={setAutoMode}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>

                {/* Main Pump Control Button */}
                <Button
                  className={`w-full h-20 text-lg transition-all ${
                    pumpStatus
                      ? "bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-200"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                  } text-white disabled:opacity-50`}
                  onClick={handlePumpToggle}
                  disabled={autoMode || pumpLoading || !isConnected}
                >
                  {pumpLoading ? (
                    <Loader className="mr-3 animate-spin" size={28} />
                  ) : (
                    <Power className="mr-3" size={28} />
                  )}
                  <div className="text-left">
                    <div className="text-sm opacity-90">
                      {pumpStatus ? "Pump is Active" : "Pump is Off"}
                    </div>
                    <div>
                      {pumpStatus ? "Click to Turn OFF" : "Click to Activate"}
                    </div>
                  </div>
                </Button>

                {autoMode && (
                  <p className="text-xs text-gray-500 text-center">
                    Manual controls disabled in Auto Mode
                  </p>
                )}

                {!isConnected && (
                  <p className="text-xs text-red-500 text-center">
                    Pump controls disabled - API disconnected
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MIDDLE SECTION - Trend Chart + Daily Summary */}
        <Card className="mb-8 border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Droplets size={20} className="text-blue-600" />
              24-Hour Moisture Trend & Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Trend Chart */}
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={moistureTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="time"
                    stroke="#64748B"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#64748B"
                    style={{ fontSize: "12px" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <ReferenceLine
                    y={40}
                    stroke="#FFA726"
                    strokeDasharray="5 5"
                    label={{
                      value: "Min Threshold",
                      fill: "#FFA726",
                      fontSize: 12,
                      position: "insideTopRight",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="#3A86FF"
                    strokeWidth={3}
                    dot={{ fill: "#3A86FF", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Summary Grid */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-gray-700 mb-4">Today's Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-600 mb-1">
                    Avg. Moisture
                  </div>
                  <div className="text-2xl text-blue-900">48%</div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="text-xs text-red-600 mb-1">Avg. Temp</div>
                  <div className="text-2xl text-red-900">23.5°C</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-xs text-green-600 mb-1">Auto Events</div>
                  <div className="text-2xl text-green-900">3</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-600 mb-1">Rain Events</div>
                  <div className="text-2xl text-blue-900">1</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-xs text-purple-600 mb-1">
                    Pump Duration
                  </div>
                  <div className="text-2xl text-purple-900">2h 45m</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Clock size={12} />
                    Uptime
                  </div>
                  <div className="text-2xl text-gray-900">15d 8h</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BOTTOM SECTION - Event History */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock size={20} className="text-blue-600" />
              Event History ({events.length} events)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No events recorded yet</p>
            ) : (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <EventHistoryItem
                      timestamp={new Date(event.ts).toLocaleTimeString()}
                      type={formatEventType(event.type)}
                      description={event.message}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            MoisSense – Smart Agriculture IoT System
          </p>
          {latestState.updated_at && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Last updated: {new Date(latestState.updated_at).toLocaleTimeString()}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
