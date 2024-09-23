import React, { useState } from 'react';
import { Typography, Container, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyPressesChart from './KeyPressesChart';
import DailyAppUsageChart from './DailyAppUsageChart';
import ProductivityTrendChart from './ProductivityTrendChart';

const Dashboard = () => {
    const [expanded, setExpanded] = useState({
        hourlyProductivity: false,
        dailyProductivity: false,
        productivityTrend: false
    });

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded({ ...expanded, [panel]: isExpanded });
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Productivity Dashboard
                </Typography>
            </Box>

            <Accordion expanded={expanded.hourlyProductivity} onChange={handleChange('hourlyProductivity')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Hourly Productivity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <KeyPressesChart isExpanded={expanded.hourlyProductivity} />
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded.dailyProductivity} onChange={handleChange('dailyProductivity')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Daily Productivity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DailyAppUsageChart isExpanded={expanded.dailyProductivity} />
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded.productivityTrend} onChange={handleChange('productivityTrend')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Productivity Trend</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ProductivityTrendChart isExpanded={expanded.productivityTrend} />
                </AccordionDetails>
            </Accordion>
        </Container>
    );
};

export default Dashboard;