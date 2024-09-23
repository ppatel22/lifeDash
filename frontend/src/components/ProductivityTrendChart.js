import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

const ProductivityTrendChart = ({ isExpanded }) => {
    const [data, setData] = useState([]);
    const [days, setDays] = useState(7);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/productivity_trend/?days=${days}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching productivity trend data:', error);
        }
    };

    useEffect(() => {
        if (isExpanded) {
            fetchData();
            const interval = setInterval(fetchData, 15000); // Update every 15 seconds
            return () => clearInterval(interval);
        }
    }, [isExpanded, days]);

    const handleDaysChange = (event, newDays) => {
        if (newDays !== null) {
            setDays(newDays);
        }
    };

    const getAppNames = () => {
        const appSet = new Set();
        data.forEach(dayData => {
            Object.keys(dayData).forEach(key => {
                if (key !== 'date') appSet.add(key);
            });
        });
        return Array.from(appSet);
    };

    const appNames = getAppNames();
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (!isExpanded) return null;

    return (
        <>
            <Typography variant="h6" gutterBottom>Productivity Trend</Typography>
            <ToggleButtonGroup
                value={days}
                exclusive
                onChange={handleDaysChange}
                aria-label="days range"
            >
                <ToggleButton value={7} aria-label="7 days">
                    7 Days
                </ToggleButton>
                <ToggleButton value={30} aria-label="30 days">
                    30 Days
                </ToggleButton>
            </ToggleButtonGroup>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {appNames.map((app, index) => (
                        <Bar key={app} dataKey={app} stackId="a" fill={colors[index % colors.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default ProductivityTrendChart;