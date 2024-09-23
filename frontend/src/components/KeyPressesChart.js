import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, useTheme } from '@mui/material';

const KeyPressesChart = ({ isExpanded }) => {
  const [data, setData] = useState([]);
  const theme = useTheme();

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/keystrokes_per_minute/');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching key presses data:', error);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchData();
      const interval = setInterval(fetchData, 15000); // Update every 15 seconds
      return () => clearInterval(interval);
    }
  }, [isExpanded]);

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isExpanded) return null;

  return (
    <>
      <Typography variant="h6" gutterBottom>Hourly Productivity</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="minute" tickFormatter={formatXAxis} stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
          <Tooltip 
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value) => [`${value} key presses`, "Count"]}
            contentStyle={{ backgroundColor: theme.palette.background.paper }}
          />
          <Line type="monotone" dataKey="keystroke_count" stroke={theme.palette.primary.main} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default KeyPressesChart;