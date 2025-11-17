import React, { useState } from "react";
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
  Home,
  LayoutDashboard,
  Info,
  Settings,
  CloudRain,
  AlertTriangle,
  Sparkles,
  Clock,
  Zap,
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

const eventHistory = [
  {
    timestamp: "14:32:15",
    type: "pump_on" as const,
    description: "Pump activated automatically (moisture: 35%)",
  },
  {
    timestamp: "14:30:00",
    type: "warning" as const,
    description: "Soil moisture below threshold",
  },
  {
    timestamp: "13:45:22",
    type: "pump_off" as const,
    description: "Pump deactivated (target reached)",
  },
  {
    timestamp: "11:20:10",
    type: "rain" as const,
    description: "Rain detected - automatic irrigation paused",
  },
  {
    timestamp: "10:15:33",
    type: "pump_on" as const,
    description: "Pump activated manually",
  },
  {
    timestamp: "10:10:00",
    type: "auto" as const,
    description: "System switched to Auto mode",
  },
  {
    timestamp: "08:00:00",
    type: "pump_off" as const,
    description: "Scheduled watering completed",
  },
  {
    timestamp: "07:15:20",
    type: "pump_on" as const,
    description: "Morning auto-watering initiated",
  },
];

export default function App() {
  const [pumpStatus, setPumpStatus] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [showDryWarning, setShowDryWarning] = useState(false);
  const [showRainWarning, setShowRainWarning] = useState(false);

  // Current sensor values
  const currentMoisture = 58;
  const currentTemp = 24;
  const currentHumidity = 68;
  const rainDetected = false;

  const handlePumpToggle = () => {
    setPumpStatus(!pumpStatus);
  };

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

            {/* Navigation Icons */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banners */}
        {showDryWarning && (
          <Alert className="mb-6 border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <span className="text-yellow-900">
                Soil moisture critically low
              </span>{" "}
              - Consider activating the irrigation pump
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
                    {rainDetected ? "Rain Detected" : "No Rain"}
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
                        Automatically activate pump based on moisture
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
                  } text-white`}
                  onClick={handlePumpToggle}
                  disabled={autoMode}
                >
                  <Power className="mr-3" size={28} />
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
              Event History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {eventHistory.map((event, index) => (
                <div
                  key={index}
                  className="hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <EventHistoryItem
                    timestamp={event.timestamp}
                    type={event.type}
                    description={event.description}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            MoisSense – Smart Agriculture IoT System
          </p>
        </div>
      </footer>
    </div>
  );
}
