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

Start the API server:
```
uvicorn backend.server.main:app --reload
```

Start the data collection service:
```
cd backend/data_collection
python collector.py
```

Start the frontend:
```
cd frontend
npm start
```