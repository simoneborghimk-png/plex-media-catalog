import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon: ReactNode;
  accentColor?: string;
  active?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subvalue,
  icon,
  accentColor = 'text-amber-400',
  active = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-3.5 transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:border-amber-500/40 hover:bg-slate-800/60' : ''
      } ${
        active
          ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(229,160,13,0.15)]'
          : 'bg-[#111622]/90 border-white/[0.07] hover:border-white/[0.12]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
            {label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              {typeof value === 'number' ? value.toLocaleString('it-IT') : value}
            </span>
            {subvalue && (
              <span className="text-[11px] text-slate-400 font-normal truncate">
                {subvalue}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-white/[0.04] border border-white/[0.05] ${accentColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
