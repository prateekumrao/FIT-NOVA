// ========================================
// components/charts/ActivityCharts.tsx
// Purpose: Recharts wrappers with the FitNova look. Each chart gets plain arrays, so pages stay simple.
// ResponsiveContainer makes the charts resize on phones, tablets and desktops.
// ========================================
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface ChartPoint { label: string; value: number }

const axisStyle = { fill: '#A6B0A6', fontSize: 12 };
const tooltipStyle = { background: '#202B23', border: '1px solid #29352D', borderRadius: 12, color: '#F2F5F1', fontSize: 12 };

/** Bars, e.g. active minutes per day. */
export function BarsChart({ data, unit = 'min', height = 240 }: { data: ChartPoint[]; unit?: string; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Bar chart of activity">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 4, top: 8 }}>
          <CartesianGrid stroke="#29352D" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(183,216,184,0.06)' }} contentStyle={tooltipStyle} formatter={(v) => [`${v} ${unit}`, 'Total']} />
          <Bar dataKey="value" fill="#98BE9C" radius={[8, 8, 0, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Smooth area, e.g. a percentage trend over weeks. */
export function TrendChart({ data, unit = '%', height = 240 }: { data: ChartPoint[]; unit?: string; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="sageFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B7D8B8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#B7D8B8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#29352D" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}${unit}`, 'Value']} />
          <Area type="monotone" dataKey="value" stroke="#B7D8B8" strokeWidth={2} fill="url(#sageFill)" animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
