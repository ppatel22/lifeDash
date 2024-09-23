import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KeystrokesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="minute" 
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(label) => new Date(label).toLocaleString()}
          formatter={(value) => [`${value} keystrokes`, "Count"]}
        />
        <Line type="monotone" dataKey="keystroke_count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default KeystrokesChart;