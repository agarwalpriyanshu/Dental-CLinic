import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/DataProvider';

function getWeekLabel(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekNum = Math.floor((date.getDate() + firstDay.getDay() - 1) / 7) + 1;
  const month = date.toLocaleString('default', { month: 'short' });
  return `${weekNum} wk ${month}`;
}

export const AppointmentsChart = () => {
  const { incidents } = useData();
  // Get last 6 weeks
  const now = new Date();
  const weeks: { [label: string]: number } = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    weeks[getWeekLabel(d)] = 0;
  }
  incidents.forEach(i => {
    const d = new Date(i.appointmentDate);
    const label = getWeekLabel(d);
    if (weeks[label] !== undefined) {
      weeks[label]++;
    }
  });
  const chartData = Object.entries(weeks).map(([week, appointments]) => ({ week, appointments }));

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Appointments per Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)'
              }}
            />
            <Bar 
              dataKey="appointments" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};