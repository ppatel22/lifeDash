import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ResourceUsage = () => {
  const [resourceData, setResourceData] = useState([]);
  const [currentUsage, setCurrentUsage] = useState(null);

  useEffect(() => {
    fetchResourceData();
    fetchCurrentUsage();
    const interval = setInterval(fetchCurrentUsage, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchResourceData = async () => {
    const response = await fetch('http://localhost:8000/resource_usage');
    const data = await response.json();
    setResourceData(data);
  };

  const fetchCurrentUsage = async () => {
    const response = await fetch('http://localhost:8000/current_resource_usage');
    const data = await response.json();
    setCurrentUsage(data);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Resource Usage</Typography>
      {currentUsage && (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography>CPU: {currentUsage.cpu_percent}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Memory: {currentUsage.memory_percent}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Battery: {currentUsage.battery_percent}%</Typography>
          </Grid>
        </Grid>
      )}
      <LineChart width={600} height={300} data={resourceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cpu_percent" stroke="#8884d8" />
        <Line type="monotone" dataKey="memory_percent" stroke="#82ca9d" />
        <Line type="monotone" dataKey="battery_percent" stroke="#ffc658" />
      </LineChart>
    </Paper>
  );
};

export default ResourceUsage;