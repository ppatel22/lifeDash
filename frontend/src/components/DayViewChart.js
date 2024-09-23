import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DayViewChart = ({ data, days }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatData = (data) => {
    return data.map(day => {
      const formattedDay = { date: day.date, total: day.total };
      Object.entries(day.windows).forEach(([window, count], index) => {
        formattedDay[window] = count;
      });
      return formattedDay;
    });
  };

  const formattedData = formatData(data);

  if (formattedData.length === 0) {
    return <div>No data available</div>;
  }

  const dataKeys = Object.keys(formattedData[0]).filter(key => key !== 'date' && key !== 'total');

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [`${value} keystrokes`, name]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar key={key} dataKey={key} stackId="a" fill={colors[index % colors.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DayViewChart;