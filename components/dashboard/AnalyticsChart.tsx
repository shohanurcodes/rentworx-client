"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AnalyticsChart({
  data,
  label,
  prefix = "",
}: {
  data: Array<{ name: string; value: number }>;
  label: string;
  prefix?: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(148,163,184,0.12)" }}
            formatter={(value) => [
              `${prefix}${Number(value).toLocaleString()}`,
              label,
            ]}
          />
          <Bar dataKey="value" name={label} fill="var(--primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
