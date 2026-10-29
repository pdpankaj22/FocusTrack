import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartData {
  day: string;
  hours: number;
}

interface WeeklyStudyChartProps {
  data: ChartData[];
}

export function WeeklyStudyChart({ data }: WeeklyStudyChartProps) {
  const maxHours = Math.max(...data.map((d) => d.hours), 0);
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-editorial">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="font-serif text-base font-semibold text-ink">Weekly Study Hours</h3>
          <p className="text-xs text-ink-muted mt-0.5">Monday through Sunday distribution</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-sm font-semibold text-ink tabular-nums">
            {totalHours.toFixed(1)}h
          </span>
          <span className="text-xs text-ink-muted ml-1">total</span>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#ECEBE4" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#77796F' }}
              axisLine={{ stroke: '#E2E1D9' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#77796F' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(239, 238, 231, 0.5)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ChartData;
                  return (
                    <div className="bg-surface border border-border p-2.5 rounded-md shadow-editorial text-xs">
                      <p className="font-medium text-ink">{item.day}</p>
                      <p className="text-forest font-semibold mt-0.5 font-mono">
                        {item.hours.toFixed(2)} hours
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
              {data.map((entry, index) => {
                // Highlight the highest study day with subtle terracotta accent when > 0
                const isMax = entry.hours > 0 && entry.hours === maxHours;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isMax ? '#C77B5A' : '#536747'}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
