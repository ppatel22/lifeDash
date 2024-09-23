# Productivity Dashboard

A lightweight, web-based productivity dashboard that runs continuously on your local machine, collecting data and displaying metrics without compromising system resources.

## Project Overview

This project aims to create a personal productivity tracking system inspired by Andrej Karpathy's Quantifying Productivity/ulogme project. It features:

- Web-based user interface
- Local data storage for privacy
- Customizable and visually appealing dashboard
- Minimal resource usage
- Activity logging and resource usage monitoring

## Project Structure

```
lifeDash/
├── backend/
│   ├── data_collection/
│   │   ├── collector.py
│   ├── database/
│   │   ├── db.py
│   └── server/
│       ├── main.py
frontend/
├── public/
│ ├── index.html
│ └── favicon.ico
│ └── src/
│ ├── components/
│ │ ├── ActivityChart.js
│ │ ├── Dashboard.js
│ │ ├── ResourceUsage.js
│ │ └── Settings.js
│ ├── App.js
│ └── index.js
├── .gitignore
├── README.md
└── requirements.txt
```

## Quick Start Guide

1. Set up the environment:
   - Create and activate a Python virtual environment
   - Install Python requirements:
     ```
     pip install -r requirements.txt
     ```
   - Install Node.js and npm if not already installed
   - Install frontend dependencies:
     ```
     cd frontend
     npm install
     ```

2. Start the API server:
   ```
   uvicorn backend.server.main:app --reload
   ```

3. Start the data collection service:
   ```
   cd backend/data_collection
   python collector.py
   ```

4. Start the frontend:
   ```
   cd frontend
   npm start
   ```

After completing these steps, your Productivity Dashboard should be up and running!


## Future Features

I have a roadmap of features planned for this Productivity Dashboard. Here's a glimpse:

1. **Enhanced History Viewer**: Improve the existing history viewer for a more comprehensive and user-friendly experience in reviewing past productivity data.

2. **Fitness Integration**:
   - Strava Integration: Track running activities and analyze their impact on productivity.
   - Hevy Integration: Incorporate workout data to correlate exercise routines with productivity levels.
   - Fitness Tracker APIs: Monitor sleep patterns and energy levels to provide a holistic view of health and productivity.

3. **Notion Integration**: Connect with Notion to track daily habits and identify correlations with productivity metrics.

4. **Advanced Analytics**:
   - Use an LLM + OCR to gain deeper insights into how time is spent, potentially analyzing screenshots or app usage patterns.
   - Use an LLM to analyze productivity data and provide personalized recommendations and insights.

5. **More Dashboards**: Adding visualizations that might help me quickly understand my productivity.

6. **Project Tracking**: Add functionality to track time spent on specific projects or tasks, providing detailed reports on project-based productivity.
