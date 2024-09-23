import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ActivityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/daily_key_presses');
        const formattedData = response.data.map(item => ({
          hour: new Date(item.hour).getHours(),
          keystroke_count: item.keystroke_count
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Key Presses Over Time (Today)</h3>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tickFormatter={(hour) => `${hour}:00`}
            label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis label={{ value: 'Key Presses', angle: -90, position: 'insideLeft' }} />
          <Tooltip labelFormatter={(hour) => `${hour}:00`} />
          <Area 
            type="stepAfter"
            dataKey="keystroke_count" 
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;