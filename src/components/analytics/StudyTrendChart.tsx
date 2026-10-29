import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyStudyData } from '../../types';

interface StudyTrendChartProps {
  data: DailyStudyData[];
}

export function StudyTrendChart({ data }: StudyTrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: d.date.slice(5), // MM-DD
  }));

  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-editorial">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="font-serif text-base font-semibold text-ink">Daily Study Trend</h3>
          <p className="text-xs text-ink-muted mt-0.5">Recorded study hours over selected timeframe</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-sm font-semibold text-ink tabular-nums">
            {totalHours.toFixed(1)}h
          </span>
          <span className="text-xs text-ink-muted ml-1">cumulative</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-xs text-ink-muted font-serif italic">
          No daily trend records available for this period.
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="editorialStudyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#536747" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#536747" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ECEBE4" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#77796F' }}
                axisLine={{ stroke: '#E2E1D9' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#77796F' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DailyStudyData & { label: string };
                    return (
                      <div className="bg-surface border border-border p-2.5 rounded-md shadow-editorial text-xs">
                        <p className="font-medium text-ink font-mono">{item.date}</p>
                        <p className="text-forest font-semibold mt-0.5 font-mono">
                          {item.hours.toFixed(2)} hours ({item.sessions} session{item.sessions !== 1 ? 's' : ''})
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#536747"
                strokeWidth={1.75}
                fill="url(#editorialStudyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
