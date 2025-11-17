import React from 'react';
import { Badge } from './ui/badge';

interface EventHistoryItemProps {
  timestamp: string;
  type: 'pump_on' | 'pump_off' | 'rain' | 'warning' | 'error' | 'auto';
  description: string;
}

const eventTypeConfig = {
  pump_on: { label: 'Pump ON', color: 'bg-blue-100 text-blue-800' },
  pump_off: { label: 'Pump OFF', color: 'bg-gray-100 text-gray-800' },
  rain: { label: 'Rain', color: 'bg-blue-100 text-blue-800' },
  warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
  error: { label: 'Error', color: 'bg-red-100 text-red-800' },
  auto: { label: 'Auto', color: 'bg-green-100 text-green-800' },
};

export const EventHistoryItem: React.FC<EventHistoryItemProps> = ({
  timestamp,
  type,
  description,
}) => {
  const config = eventTypeConfig[type];
  
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="min-w-[120px] text-sm text-gray-500">{timestamp}</div>
      <Badge className={`${config.color} border-0`}>{config.label}</Badge>
      <div className="text-sm text-gray-700 flex-1">{description}</div>
    </div>
  );
};
