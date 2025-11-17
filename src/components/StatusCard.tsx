import React from 'react';
import { Card, CardContent } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBgColor?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = '#3A86FF',
  iconBgColor = '#EBF4FF',
}) => {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon size={24} style={{ color: iconColor }} />
          </div>
          <div className="text-right">
            <div className="text-3xl" style={{ color: iconColor }}>
              {value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
