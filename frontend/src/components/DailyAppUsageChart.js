import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const DailyAppUsageChart = ({ isExpanded }) => {
    const [appUsageData, setAppUsageData] = useState([]);
    const [keyPressesData, setKeyPressesData] = useState([]);

    const fetchAppUsageData = async () => {
        try {
            const response = await fetch('http://localhost:8000/daily_app_usage');
            if (response.ok) {
                const result = await response.json();
                setAppUsageData(result);
            }
        } catch (error) {
            console.error('Error fetching daily app usage data:', error);
        }
    };

    const fetchKeyPressesData = async () => {
        try {
            const response = await fetch('http://localhost:8000/daily_key_presses');
            if (response.ok) {
                const result = await response.json();
                setKeyPressesData(result);
            }
        } catch (error) {
            console.error('Error fetching daily key presses data:', error);
        }
    };

    useEffect(() => {
        if (isExpanded) {
            fetchAppUsageData();
            fetchKeyPressesData();
            const interval = setInterval(() => {
                fetchAppUsageData();
                fetchKeyPressesData();
            }, 15000); // Update every 15 seconds
            return () => clearInterval(interval);
        }
    }, [isExpanded]);

    if (!isExpanded) return null;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

    const formatXAxis = (tickItem) => {
        return new Date(tickItem).getHours() + ':00';
    };

    const renderCustomizedLabel = (entry) => {
        return `${entry.window_title}: ${entry.keystroke_count}`;
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>App Usage Distribution</Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={appUsageData}
                            dataKey="keystroke_count"
                            nameKey="window_title"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label={renderCustomizedLabel}
                        >
                            {appUsageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Key Presses Over Time (Today)</Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={keyPressesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={formatXAxis} 
                            interval="preserveStartEnd"
                        />
                        <YAxis />
                        <Tooltip 
                            labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                            formatter={(value) => [`${value} key presses`, "Count"]}
                        />
                        <Line type="monotone" dataKey="keystroke_count" stroke="#8884d8" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
        </Grid>
    );
};

export default DailyAppUsageChart;