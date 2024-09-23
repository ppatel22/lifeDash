# Productivity Dashboard Project

## Overview

The goal is to create a lightweight, web-based productivity dashboard that runs continuously on your MacBook Pro. This dashboard will collect data locally, display it on `localhost`, and integrate with various APIs to provide comprehensive productivity metrics without compromising system resources.

## Requirements

- **Web-Based User Interface:** Accessible via a web browser on `localhost`.
- **Open Source and Free:** Utilize free tools and libraries. Leverage the free Google Gemini API key if needed.
- **Local Data Storage:** Ensure all data remains on the local machine.
- **Customizable and Aesthetic UI:** Provide options for customization and maintain a visually appealing interface.
- **Resource Efficiency:** Minimal CPU and battery usage.
- **Data Collection:**
  - Record keystrokes and active window titles to monitor activity.
  - Explore alternative data collection methods if needed.

## Architecture Overview

### 1. Data Collection Service
- **Function:** Continuously monitor and record user activities such as keystrokes and active window titles.
- **Implementation:**
  - **Language:** Python
  - **Libraries:** 
    - `pynput` for keylogging
    - `pyobjc` for window titles on macOS
  - **Optimization:** Implement efficient sampling rates to minimize resource usage.

### 2. Local Database
- **Function:** Store collected data securely.
- **Implementation:**
  - **Database:** SQLite
  - **Security:** Encrypt sensitive data, especially keystrokes, using the `cryptography` library.

### 3. Web Server
- **Function:** Serve the frontend dashboard and handle API requests.
- **Implementation:**
  - **Framework:** FastAPI
  - **Endpoints:** Create RESTful APIs to fetch data from the local database and interact with external APIs.

### 4. Frontend Dashboard
- **Function:** Display productivity metrics and integrate with external APIs.
- **Implementation:**
  - **Framework:** React
  - **Design:** Focus on a clean, responsive design with customization options.
  - **Visualization:** Utilize D3.js for data visualization.

## Additional Considerations

### Strava API Integration
- **Purpose:** Fetch and display activity data alongside productivity metrics.
- **Implementation:**
  - **Authentication:** Use OAuth to securely connect with Strava.
  - **Data Handling:** Schedule regular data fetches and store relevant information in the local database.

### Notion API Integration
- **Purpose:** Pull in task lists or project data to correlate with productivity metrics.
- **Implementation:**
  - **Authentication:** Use Notion's API tokens to access workspace data.
  - **Data Handling:** Sync Notion data periodically and reflect changes in the dashboard.

### Resource Usage
- **Optimization Strategies:**
  - **Efficient Coding:** Write optimized code to reduce CPU usage.
  - **Background Processes:** Run data collection as a background service with low priority.
  - **Lazy Loading:** Load frontend components only when necessary.

### Security
- **Data Protection:**
  - **Encryption:** Encrypt sensitive data in the local database.
  - **Access Control:** Implement authentication for the web dashboard to prevent unauthorized access.
- **Best Practices:** Regularly update dependencies to patch security vulnerabilities.

### Customization
- **User Preferences:**
  - **Categories/Tags:** Allow users to define custom categories or tags for different activities.
  - **UI Themes:** Provide options to change the appearance of the dashboard.
- **Extensibility:** Design the system to easily incorporate additional APIs or data sources in the future.

## Implementation Steps

1. **Create Basic Project Structure**
   - Create a README.md with project summary and structure.
   - Set up directories for backend, frontend, and documentation.

2. **Develop Data Collection Service**
   - Implement keystroke and window title logging.
   - Ensure data is encrypted and stored in SQLite.

3. **Build the Web Server**
   - Create API endpoints to serve data to the frontend.
   - Implement integration with Strava and Notion APIs.

4. **Design Frontend Dashboard**
   - Develop responsive UI with data visualizations.
   - Add customization features for user preferences.

5. **Implement Resource Usage Monitoring**
   - Add hourly checks for CPU, memory, and battery usage.
   - Integrate the resource usage component into the main dashboard.

6. **Implement Security Measures**
   - Add authentication to the web dashboard.
   - Encrypt all sensitive data and secure API integrations.

7. **Deploy and Monitor**
   - Set up the application to run on startup.
